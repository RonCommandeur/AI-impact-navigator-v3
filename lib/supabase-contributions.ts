import { supabase } from './supabase'
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

// Vote on a contribution
export async function voteOnContribution(
  authUserId: string,
  contributionId: string
): Promise<{ success: boolean; error?: string; hasVoted?: boolean }> {
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

// Award NFT to contribution
export async function awardNFT(
  contributionId: string, 
  nftId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contributions')
      .update({ nft_id: nftId })
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