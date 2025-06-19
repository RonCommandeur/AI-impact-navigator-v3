import { supabase } from './supabase'

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
}

export interface TrendMetrics {
  data: TrendData | null
  error?: string
}

// Get trend data for a specific user
export async function getUserTrendData(authUserId: string): Promise<TrendMetrics> {
  try {
    const { data, error } = await supabase
      .from('user_metrics')
      .select('trend_data')
      .eq('auth_user_id', authUserId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Get trend data error:', error)
      return { data: null, error: 'Failed to load trend data' }
    }

    // If no trend data found, return default/sample data
    if (!data?.trend_data) {
      return { 
        data: {
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
          last_updated: new Date().toISOString()
        }
      }
    }

    return { data: data.trend_data as TrendData }
  } catch (error) {
    console.error('Get trend data error:', error)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Get global trend data (aggregated from all users)
export async function getGlobalTrendData(): Promise<TrendMetrics> {
  try {
    // For now, return sample global data
    // In production, this could aggregate data from multiple sources
    return {
      data: {
        job_shifts: "35% increase in AI-related job postings globally",
        skill_demand: "180% growth in demand for AI skills",
        automation_risk: "28% average automation risk across industries",
        market_outlook: "Strong growth expected through 2025-2026",
        salary_trends: "15% average salary premium for AI expertise",
        remote_work: "82% of AI positions offer flexible work arrangements",
        industry_adoption: [
          { industry: 'Technology', adoption_rate: 95 },
          { industry: 'Finance', adoption_rate: 78 },
          { industry: 'Healthcare', adoption_rate: 62 },
          { industry: 'Education', adoption_rate: 48 },
          { industry: 'Manufacturing', adoption_rate: 67 },
          { industry: 'Retail', adoption_rate: 55 }
        ],
        monthly_trends: [
          { month: 'Jan 2025', job_growth: 18, skill_demand: 95 },
          { month: 'Feb 2025', job_growth: 22, skill_demand: 108 },
          { month: 'Mar 2025', job_growth: 26, skill_demand: 125 },
          { month: 'Apr 2025', job_growth: 30, skill_demand: 142 },
          { month: 'May 2025', job_growth: 33, skill_demand: 165 },
          { month: 'Jun 2025', job_growth: 35, skill_demand: 180 }
        ],
        last_updated: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Get global trend data error:', error)
    return { data: null, error: 'Failed to load global trend data' }
  }
}

// Update trend data for a user (triggers recalculation)
export async function updateUserTrendData(authUserId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('update_user_metrics_with_trends', {
      user_id: authUserId
    })

    if (error) {
      console.error('Update trend data error:', error)
      return { success: false, error: 'Failed to update trend data' }
    }

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
  
  return insights.slice(0, 4) // Return top 4 insights
}