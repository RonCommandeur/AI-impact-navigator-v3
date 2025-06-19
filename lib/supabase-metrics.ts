import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface UserMetrics {
  skillsLearned: string[]
  assessmentsCompleted: number
  communityContributions: number
  nftsEarned: number
  progressScore: number
  totalVotes: number
  weeklyActivity: number[]
  skillProficiency: { skill: string; level: number }[]
  lastCalculated?: string
}

export interface MetricsRecord {
  id: string
  auth_user_id: string
  progress: UserMetrics
  created_at: string
  updated_at: string
}

// Get user metrics from Supabase
export async function getUserMetrics(authUserId: string): Promise<{ data: UserMetrics | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_metrics')
      .select('progress')
      .eq('auth_user_id', authUserId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Get metrics error:', error)
      return { data: null, error: 'Failed to load user metrics' }
    }

    // If no metrics found, return default metrics
    if (!data) {
      return { 
        data: {
          skillsLearned: [],
          assessmentsCompleted: 0,
          communityContributions: 0,
          nftsEarned: 0,
          progressScore: 0,
          totalVotes: 0,
          weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
          skillProficiency: [
            { skill: 'AI Tools', level: 0 },
            { skill: 'Prompt Engineering', level: 0 },
            { skill: 'Data Analysis', level: 0 },
            { skill: 'Creative Strategy', level: 0 },
            { skill: 'Community Building', level: 0 }
          ]
        }
      }
    }

    // Transform the progress data to match our interface
    const progress = data.progress as any
    const metrics: UserMetrics = {
      skillsLearned: progress.skills_learned || [],
      assessmentsCompleted: progress.assessments_completed || 0,
      communityContributions: progress.community_contributions || 0,
      nftsEarned: progress.nfts_earned || 0,
      progressScore: progress.progress_score || 0,
      totalVotes: progress.total_votes || 0,
      weeklyActivity: progress.weekly_activity || [0, 0, 0, 0, 0, 0, 0],
      skillProficiency: progress.skill_proficiency || [
        { skill: 'AI Tools', level: 0 },
        { skill: 'Prompt Engineering', level: 0 },
        { skill: 'Data Analysis', level: 0 },
        { skill: 'Creative Strategy', level: 0 },
        { skill: 'Community Building', level: 0 }
      ],
      lastCalculated: progress.last_calculated
    }

    return { data: metrics }
  } catch (error) {
    console.error('Get metrics error:', error)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Update user metrics by recalculating from existing data
export async function updateUserMetrics(authUserId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('update_user_metrics_data', {
      user_id: authUserId
    })

    if (error) {
      console.error('Update metrics error:', error)
      return { success: false, error: 'Failed to update user metrics' }
    }

    return { success: true }
  } catch (error) {
    console.error('Update metrics error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Save custom metrics data (for manual updates)
export async function saveUserMetrics(authUserId: string, metrics: Partial<UserMetrics>): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert our interface back to database format
    const progressData = {
      skills_learned: metrics.skillsLearned,
      assessments_completed: metrics.assessmentsCompleted,
      community_contributions: metrics.communityContributions,
      nfts_earned: metrics.nftsEarned,
      progress_score: metrics.progressScore,
      total_votes: metrics.totalVotes,
      weekly_activity: metrics.weeklyActivity,
      skill_proficiency: metrics.skillProficiency,
      last_calculated: new Date().toISOString()
    }

    const { error } = await supabase
      .from('user_metrics')
      .upsert({
        auth_user_id: authUserId,
        progress: progressData
      }, {
        onConflict: 'auth_user_id'
      })

    if (error) {
      console.error('Save metrics error:', error)
      return { success: false, error: 'Failed to save user metrics' }
    }

    return { success: true }
  } catch (error) {
    console.error('Save metrics error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Trigger metrics recalculation when user completes actions
export async function triggerMetricsUpdate(authUserId: string): Promise<void> {
  try {
    // Update metrics in the background
    await updateUserMetrics(authUserId)
  } catch (error) {
    console.error('Failed to trigger metrics update:', error)
    // Don't throw error as this is a background operation
  }
}

// Get all users metrics for admin/analytics (if needed)
export async function getAllUserMetrics(): Promise<{ data: MetricsRecord[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_metrics')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Get all metrics error:', error)
      return { data: [], error: 'Failed to load metrics data' }
    }

    return { data: data || [] }
  } catch (error) {
    console.error('Get all metrics error:', error)
    return { data: [], error: 'An unexpected error occurred' }
  }
}