import { supabase } from './supabase'
import { mintContributionNFT, type NFTMintResult } from './algorand-nft'
import { triggerMetricsUpdate } from './supabase-metrics'
import type { User } from '@supabase/supabase-js'

export interface Contribution {
  id: string
  auth_user_id: string
  title: string
  content: string
  image_url?: string
  category: string
  votes: number
  nft_id?: string
  created_at: string
  updated_at: string
  author_email?: string
  user_has_voted?: boolean
}

export interface ContributionFormData {
  title: string
  content: string
  image_url?: string
  category: string
}

// Create a new contribution
export async function createContribution(
  authUser: User, 
  formData: ContributionFormData
): Promise<{ success: boolean; error?: string; data?: Contribution }> {
  try {
    if (!formData.title.trim()) {
      return { success: false, error: 'Title is required' }
    }

    if (!formData.content.trim()) {
      return { success: false, error: 'Content is required' }
    }

    const { data, error } = await supabase
      .from('contributions')
      .insert({
        auth_user_id: authUser.id,
        title: formData.title.trim(),
        content: formData.content.trim(),
        image_url: formData.image_url?.trim() || null,
        category: formData.category || 'Discussion'
      })
      .select()
      .single()

    if (error) {
      console.error('Create contribution error:', error)
      return { success: false, error: 'Failed to create post. Please try again.' }
    }

    // Trigger metrics update in the background
    triggerMetricsUpdate(authUser.id)

    return { success: true, data }
  } catch (error) {
    console.error('Create contribution error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

// Get all contributions with vote status for current user
export async function getContributions(
  authUserId?: string
): Promise<{ data: Contribution[]; error?: string }> {
  try {
    let query = supabase
      .from('contributions')
      .select(`
        *,
        auth_user_id
      `)
      .order('created_at', { ascending: false })

    const { data: contributions, error } = await query

    if (error) {
      console.error('Get contributions error:', error)
      return { data: [], error: 'Failed to load posts' }
    }

    // Get user emails for display
    const userIds = [...new Set(contributions?.map(c => c.auth_user_id) || [])]
    const { data: users } = await supabase.auth.admin.listUsers()
    const userEmailMap = new Map(
      users.users.map(user => [user.id, user.email])
    )

    // Get vote status for current user if authenticated
    let userVotes: Set<string> = new Set()
    if (authUserId) {
      const { data: votes } = await supabase
        .from('contribution_votes')
        .select('contribution_id')
        .eq('auth_user_id', authUserId)
      
      userVotes = new Set(votes?.map(v => v.contribution_id) || [])
    }

    const enrichedContributions: Contribution[] = (contributions || []).map(contribution => ({
      ...contribution,
      author_email: userEmailMap.get(contribution.auth_user_id) || 'Unknown User',
      user_has_voted: userVotes.has(contribution.id)
    }))

    return { data: enrichedContributions }
  } catch (error) {
    console.error('Get contributions error:', error)
    return { data: [], error: 'An unexpected error occurred' }
  }
}

// Vote on a contribution with automatic NFT minting
export async function voteOnContribution(
  authUserId: string,
  contributionId: string
): Promise<{ success: boolean; error?: string; hasVoted?: boolean; nftMinted?: boolean; nftResult?: NFTMintResult }> {
  try {
    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('contribution_votes')
      .select('id')
      .eq('contribution_id', contributionId)
      .eq('auth_user_id', authUserId)
      .single()

    if (existingVote) {
      // Remove vote
      const { error } = await supabase
        .from('contribution_votes')
        .delete()
        .eq('contribution_id', contributionId)
        .eq('auth_user_id', authUserId)

      if (error) {
        console.error('Remove vote error:', error)
        return { success: false, error: 'Failed to remove vote' }
      }

      // Trigger metrics update for the voter
      triggerMetricsUpdate(authUserId)

      return { success: true, hasVoted: false }
    } else {
      // Add vote
      const { error } = await supabase
        .from('contribution_votes')
        .insert({
          contribution_id: contributionId,
          auth_user_id: authUserId
        })

      if (error) {
        console.error('Add vote error:', error)
        return { success: false, error: 'Failed to add vote' }
      }

      // Check if contribution now qualifies for NFT (10+ votes)
      const { data: contribution } = await supabase
        .from('contributions')
        .select('*')
        .eq('id', contributionId)
        .single()

      if (contribution && contribution.votes >= 10 && !contribution.nft_id) {
        // Get author email for NFT metadata
        const { data: users } = await supabase.auth.admin.listUsers()
        const authorUser = users.users.find(user => user.id === contribution.auth_user_id)
        
        const contributionWithEmail = {
          ...contribution,
          author_email: authorUser?.email || 'Unknown User'
        }

        // Mint NFT on Algorand
        console.log('Minting NFT for contribution:', contributionId)
        const nftResult = await mintContributionNFT(contributionWithEmail)

        if (nftResult.success && nftResult.assetId) {
          // Store NFT asset ID in database
          const { error: updateError } = await supabase
            .from('contributions')
            .update({ 
              nft_id: nftResult.assetId.toString()
            })
            .eq('id', contributionId)

          if (updateError) {
            console.error('Failed to update NFT ID:', updateError)
          }

          // Trigger metrics update for the contribution author
          triggerMetricsUpdate(contribution.auth_user_id)

          return { 
            success: true, 
            hasVoted: true, 
            nftMinted: true,
            nftResult 
          }
        } else {
          console.error('NFT minting failed:', nftResult.error)
          return { 
            success: true, 
            hasVoted: true, 
            nftMinted: false 
          }
        }
      }

      // Trigger metrics update for the voter
      triggerMetricsUpdate(authUserId)

      return { success: true, hasVoted: true }
    }
  } catch (error) {
    console.error('Vote error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Check if contribution should earn NFT (10+ votes)
export async function checkNFTEligibility(contributionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('contributions')
      .select('votes, nft_id')
      .eq('id', contributionId)
      .single()

    if (error || !data) {
      return false
    }

    return data.votes >= 10 && !data.nft_id
  } catch (error) {
    console.error('NFT eligibility check error:', error)
    return false
  }
}

// Award NFT to contribution (now stores Algorand asset ID)
export async function awardNFT(
  contributionId: string, 
  algorandAssetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contributions')
      .update({ nft_id: algorandAssetId })
      .eq('id', contributionId)

    if (error) {
      console.error('Award NFT error:', error)
      return { success: false, error: 'Failed to award NFT' }
    }

    return { success: true }
  } catch (error) {
    console.error('Award NFT error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get contribution with NFT details
export async function getContributionWithNFT(contributionId: string): Promise<{
  success: boolean
  data?: Contribution & { nft_details?: any }
  error?: string
}> {
  try {
    const { data: contribution, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('id', contributionId)
      .single()

    if (error) {
      return { success: false, error: 'Contribution not found' }
    }

    // If contribution has NFT, get NFT details from Algorand
    let nft_details = null
    if (contribution.nft_id) {
      // In production, this would fetch from Algorand blockchain
      nft_details = {
        assetId: parseInt(contribution.nft_id),
        name: 'Community Contributor NFT',
        description: `NFT awarded for "${contribution.title}"`,
        imageUrl: 'https://via.placeholder.com/200x200/6366f1/ffffff?text=NFT'
      }
    }

    return {
      success: true,
      data: {
        ...contribution,
        nft_details
      }
    }
  } catch (error) {
    console.error('Get contribution with NFT error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}