import { supabase } from './supabase'
import { getTrendAnalysisWithFallback } from './grok-api'

export interface TrendData {
  job_shifts: string
  skill_demand: string
  automation_risk: string
  market_outlook: string
  salary_trends: string
  remote_work: string
  industry_adoption: Array<{
    industry: string
    adoption_rate: number
  }>
  monthly_trends: Array<{
    month: string
    job_growth: number
    skill_demand: number
  }>
  last_updated: string
  source?: 'grok_api' | 'fallback' | 'database'
  confidence_score?: number
}

export interface TrendMetrics {
  data: TrendData | null
  error?: string
}

// Get trend data for a specific user (with Grok API integration)
export async function getUserTrendData(authUserId: string): Promise<TrendMetrics> {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      return { 
        data: getFallbackTrendData(),
        error: 'Database not configured'
      }
    }

    // First, try to get existing trend data from database
    const { data: existingData, error } = await supabase
      .from('user_metrics')
      .select('trend_data, updated_at')
      .eq('auth_user_id', authUserId)
      .single()

    // Check if we have recent data (less than 1 hour old)
    const isDataFresh = existingData?.updated_at && 
      (new Date().getTime() - new Date(existingData.updated_at).getTime()) < 3600000 // 1 hour

    if (existingData?.trend_data && isDataFresh) {
      console.log('Using cached trend data from database')
      return { 
        data: {
          ...existingData.trend_data,
          source: 'database'
        } as TrendData 
      }
    }

    // If no fresh data, fetch new trends from Grok API
    console.log('Fetching fresh trend data from Grok API...')
    const { data: freshTrendData, source, error: grokError } = await getTrendAnalysisWithFallback()

    if (freshTrendData) {
      // Store the new trend data in the database
      await updateUserTrendDataInDB(authUserId, freshTrendData)
      
      return { 
        data: {
          ...freshTrendData,
          source
        }
      }
    }

    // If everything fails, return fallback data
    return { 
      data: getFallbackTrendData(),
      error: grokError || 'Failed to fetch trend data'
    }

  } catch (error) {
    console.error('Get trend data error:', error)
    return { 
      data: getFallbackTrendData(),
      error: 'An unexpected error occurred'
    }
  }
}

// Update trend data in database with error handling
async function updateUserTrendDataInDB(authUserId: string, trendData: any): Promise<void> {
  try {
    if (!supabase) {
      console.warn('Supabase not configured, skipping trend data update')
      return
    }

    const { error } = await supabase
      .from('user_metrics')
      .upsert({
        auth_user_id: authUserId,
        trend_data: trendData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'auth_user_id'
      })

    if (error) {
      console.error('Failed to update trend data in database:', error)
    } else {
      console.log('Successfully updated trend data in database')
    }
  } catch (error) {
    console.error('Error updating trend data:', error)
  }
}

// Get global trend data (with Grok API integration)
export async function getGlobalTrendData(): Promise<TrendMetrics> {
  try {
    // For global data, we'll use Grok API directly
    console.log('Fetching global trend data from Grok API...')
    const { data: trendData, source, error: grokError } = await getTrendAnalysisWithFallback()

    if (trendData) {
      return { 
        data: {
          ...trendData,
          source
        }
      }
    }

    return { 
      data: getFallbackTrendData(),
      error: grokError || 'Failed to fetch global trend data'
    }
  } catch (error) {
    console.error('Get global trend data error:', error)
    return { 
      data: getFallbackTrendData(),
      error: 'Failed to load global trend data'
    }
  }
}

// Fallback trend data when all else fails
function getFallbackTrendData(): TrendData {
  return {
    job_shifts: "28% increase in AI-related positions",
    skill_demand: "156% growth in AI skill requirements",
    automation_risk: "32% of tasks may be automated",
    market_outlook: "Positive growth trajectory in AI adoption",
    salary_trends: "12% average salary increase for AI skills",
    remote_work: "78% of AI jobs offer remote options",
    industry_adoption: [
      { industry: 'Technology', adoption_rate: 92 },
      { industry: 'Healthcare', adoption_rate: 58 },
      { industry: 'Finance', adoption_rate: 76 },
      { industry: 'Education', adoption_rate: 45 },
      { industry: 'Manufacturing', adoption_rate: 63 }
    ],
    monthly_trends: [
      { month: 'Jan 2025', job_growth: 12, skill_demand: 85 },
      { month: 'Feb 2025', job_growth: 15, skill_demand: 92 },
      { month: 'Mar 2025', job_growth: 18, skill_demand: 98 },
      { month: 'Apr 2025', job_growth: 22, skill_demand: 105 },
      { month: 'May 2025', job_growth: 25, skill_demand: 112 },
      { month: 'Jun 2025', job_growth: 28, skill_demand: 156 }
    ],
    last_updated: new Date().toISOString(),
    source: 'fallback',
    confidence_score: 0.75
  }
}

// Update trend data for a user (triggers Grok API call)
export async function updateUserTrendData(authUserId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Updating trend data for user:', authUserId)
    
    // Fetch fresh trend data from Grok API
    const { data: trendData, source, error: grokError } = await getTrendAnalysisWithFallback()

    if (!trendData) {
      return { success: false, error: grokError || 'Failed to fetch trend data' }
    }

    // Update in database
    await updateUserTrendDataInDB(authUserId, trendData)

    // Also update the user metrics with the new trend data (if Supabase is available)
    if (supabase) {
      try {
        const { error: metricsError } = await supabase.rpc('update_user_metrics_with_trends', {
          user_id: authUserId
        })

        if (metricsError) {
          console.error('Failed to update user metrics:', metricsError)
        }
      } catch (error) {
        console.error('Error updating user metrics with trends:', error)
      }
    }

    console.log(`Successfully updated trend data from ${source}`)
    return { success: true }
  } catch (error) {
    console.error('Update trend data error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Format trend data for display
export function formatTrendValue(value: string): { text: string; isPositive: boolean; percentage?: number } {
  const percentageMatch = value.match(/(\d+)%/)
  const percentage = percentageMatch ? parseInt(percentageMatch[1]) : null
  
  const isPositive = value.includes('increase') || value.includes('growth') || value.includes('premium')
  
  return {
    text: value,
    isPositive,
    percentage
  }
}

// Get trend insights based on user data
export function getTrendInsights(trendData: TrendData, userSkills: string[]): string[] {
  const insights: string[] = []
  
  // Add source indicator
  if (trendData.source === 'grok_api') {
    insights.push('🤖 Real-time AI analysis from Grok API')
  } else if (trendData.source === 'fallback') {
    insights.push('📊 Using market trend estimates (API unavailable)')
  }
  
  // Job market insights
  if (trendData.job_shifts.includes('increase')) {
    insights.push('📈 AI job market is expanding rapidly - great time to enter the field')
  }
  
  // Skill demand insights
  const skillDemandMatch = trendData.skill_demand.match(/(\d+)%/)
  if (skillDemandMatch && parseInt(skillDemandMatch[1]) > 100) {
    insights.push('🔥 AI skills are in extremely high demand - your expertise is valuable')
  }
  
  // Remote work insights
  const remoteMatch = trendData.remote_work.match(/(\d+)%/)
  if (remoteMatch && parseInt(remoteMatch[1]) > 70) {
    insights.push('🏠 Most AI roles offer remote flexibility - expand your job search globally')
  }
  
  // Salary insights
  if (trendData.salary_trends.includes('increase') || trendData.salary_trends.includes('premium')) {
    insights.push('💰 AI skills command salary premiums - invest in continuous learning')
  }
  
  // Industry-specific insights
  const topIndustry = trendData.industry_adoption.reduce((prev, current) => 
    prev.adoption_rate > current.adoption_rate ? prev : current
  )
  insights.push(`🏢 ${topIndustry.industry} leads in AI adoption at ${topIndustry.adoption_rate}%`)
  
  // Confidence score insight
  if (trendData.confidence_score && trendData.confidence_score > 0.8) {
    insights.push('✅ High confidence in trend predictions')
  }
  
  return insights.slice(0, 5) // Return top 5 insights
}

// Refresh all trend data (admin function)
export async function refreshAllTrendData(): Promise<{ success: boolean; updated: number; error?: string }> {
  try {
    if (!supabase) {
      return { success: false, updated: 0, error: 'Database not configured' }
    }

    // Get all users with metrics
    const { data: users, error } = await supabase
      .from('user_metrics')
      .select('auth_user_id')

    if (error) {
      return { success: false, updated: 0, error: 'Failed to fetch users' }
    }

    let updated = 0
    const { data: freshTrendData } = await getTrendAnalysisWithFallback()

    if (freshTrendData) {
      // Update trend data for all users
      for (const user of users) {
        await updateUserTrendDataInDB(user.auth_user_id, freshTrendData)
        updated++
      }
    }

    return { success: true, updated }
  } catch (error) {
    console.error('Refresh all trend data error:', error)
    return { success: false, updated: 0, error: 'An unexpected error occurred' }
  }
}