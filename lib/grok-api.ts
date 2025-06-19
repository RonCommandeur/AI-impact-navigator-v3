// Grok API integration for X trend analysis
// Provides AI-powered trend insights with fallback to dummy data

export interface GrokTrendResponse {
  job_market_analysis: string
  skill_demand_forecast: string
  automation_impact: string
  salary_trends: string
  remote_work_trends: string
  industry_insights: Array<{
    industry: string
    adoption_rate: number
    growth_trend: string
  }>
  monthly_projections: Array<{
    month: string
    job_growth: number
    skill_demand: number
  }>
  market_sentiment: 'bullish' | 'bearish' | 'neutral'
  confidence_score: number
}

export interface GrokApiConfig {
  apiKey?: string
  baseUrl: string
  timeout: number
}

// Grok API configuration
const GROK_CONFIG: GrokApiConfig = {
  apiKey: process.env.GROK_API_KEY || process.env.NEXT_PUBLIC_GROK_API_KEY,
  baseUrl: 'https://api.x.ai/v1',
  timeout: 10000 // 10 seconds
}

// Generate AI trend analysis prompt
function generateTrendPrompt(): string {
  return `
Analyze current AI and technology job market trends based on recent data. Provide insights in the following JSON format:

{
  "job_market_analysis": "Brief analysis of AI job market growth",
  "skill_demand_forecast": "Analysis of in-demand AI skills",
  "automation_impact": "Assessment of automation risks and opportunities",
  "salary_trends": "Salary trend analysis for AI professionals",
  "remote_work_trends": "Remote work trends in AI industry",
  "industry_insights": [
    {"industry": "Technology", "adoption_rate": 85, "growth_trend": "Strong growth"},
    {"industry": "Healthcare", "adoption_rate": 45, "growth_trend": "Moderate growth"}
  ],
  "monthly_projections": [
    {"month": "Jan 2025", "job_growth": 15, "skill_demand": 85},
    {"month": "Feb 2025", "job_growth": 18, "skill_demand": 92}
  ],
  "market_sentiment": "bullish",
  "confidence_score": 0.85
}

Focus on actionable insights for professionals navigating AI career transitions.
`
}

// Call Grok API for trend analysis
export async function fetchGrokTrendAnalysis(): Promise<{ success: boolean; data?: GrokTrendResponse; error?: string }> {
  try {
    // Check if API key is available
    if (!GROK_CONFIG.apiKey) {
      console.warn('Grok API key not found, using fallback data')
      return { success: false, error: 'API key not configured' }
    }

    console.log('Fetching trend analysis from Grok API...')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), GROK_CONFIG.timeout)

    const response = await fetch(`${GROK_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are an AI market analyst specializing in technology and AI job market trends. Provide accurate, data-driven insights in JSON format.'
          },
          {
            role: 'user',
            content: generateTrendPrompt()
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw new Error('Invalid response format from Grok API')
    }

    const content = result.choices[0].message.content
    
    // Parse JSON response
    let trendData: GrokTrendResponse
    try {
      trendData = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse Grok response as JSON:', parseError)
      throw new Error('Invalid JSON response from Grok API')
    }

    // Validate required fields
    if (!trendData.job_market_analysis || !trendData.skill_demand_forecast) {
      throw new Error('Incomplete trend data from Grok API')
    }

    console.log('Successfully fetched trend analysis from Grok API')
    return { success: true, data: trendData }

  } catch (error) {
    console.error('Grok API error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout' }
      }
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Unknown error occurred' }
  }
}

// Generate fallback trend data when API fails
export function generateFallbackTrendData(): GrokTrendResponse {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  
  // Generate realistic but dummy data
  const baseGrowth = 15 + Math.floor(Math.random() * 20) // 15-35%
  const baseSkillDemand = 80 + Math.floor(Math.random() * 40) // 80-120%
  
  return {
    job_market_analysis: `${baseGrowth}% increase in AI-related job postings this quarter, driven by enterprise AI adoption and digital transformation initiatives`,
    skill_demand_forecast: `${baseSkillDemand}% growth in demand for AI skills, particularly prompt engineering, machine learning, and AI ethics expertise`,
    automation_impact: `${25 + Math.floor(Math.random() * 15)}% of routine tasks may be automated, creating opportunities for higher-value strategic work`,
    salary_trends: `${8 + Math.floor(Math.random() * 7)}% average salary premium for AI skills, with senior roles commanding up to 25% higher compensation`,
    remote_work_trends: `${60 + Math.floor(Math.random() * 25)}% of AI positions offer remote or hybrid work options, enabling global talent access`,
    industry_insights: [
      { industry: 'Technology', adoption_rate: 85 + Math.floor(Math.random() * 10), growth_trend: 'Strong growth' },
      { industry: 'Healthcare', adoption_rate: 45 + Math.floor(Math.random() * 20), growth_trend: 'Accelerating adoption' },
      { industry: 'Finance', adoption_rate: 70 + Math.floor(Math.random() * 15), growth_trend: 'Steady growth' },
      { industry: 'Education', adoption_rate: 35 + Math.floor(Math.random() * 25), growth_trend: 'Emerging adoption' },
      { industry: 'Manufacturing', adoption_rate: 55 + Math.floor(Math.random() * 20), growth_trend: 'Moderate growth' },
      { industry: 'Retail', adoption_rate: 40 + Math.floor(Math.random() * 25), growth_trend: 'Growing interest' }
    ],
    monthly_projections: [
      { month: 'Jan 2025', job_growth: 12, skill_demand: 85 },
      { month: 'Feb 2025', job_growth: 15, skill_demand: 92 },
      { month: 'Mar 2025', job_growth: 18, skill_demand: 98 },
      { month: 'Apr 2025', job_growth: 22, skill_demand: 105 },
      { month: 'May 2025', job_growth: 25, skill_demand: 112 },
      { month: currentMonth, job_growth: baseGrowth, skill_demand: baseSkillDemand }
    ],
    market_sentiment: Math.random() > 0.3 ? 'bullish' : 'neutral',
    confidence_score: 0.75 + (Math.random() * 0.2) // 0.75-0.95
  }
}

// Convert Grok response to TrendData format
export function convertGrokToTrendData(grokData: GrokTrendResponse): any {
  return {
    job_shifts: grokData.job_market_analysis,
    skill_demand: grokData.skill_demand_forecast,
    automation_risk: grokData.automation_impact,
    market_outlook: `Market sentiment: ${grokData.market_sentiment} (${Math.round(grokData.confidence_score * 100)}% confidence)`,
    salary_trends: grokData.salary_trends,
    remote_work: grokData.remote_work_trends,
    industry_adoption: grokData.industry_insights.map(insight => ({
      industry: insight.industry,
      adoption_rate: insight.adoption_rate
    })),
    monthly_trends: grokData.monthly_projections,
    last_updated: new Date().toISOString(),
    source: 'grok_api',
    confidence_score: grokData.confidence_score
  }
}

// Main function to get trend analysis with fallback
export async function getTrendAnalysisWithFallback(): Promise<{ data: any; source: 'grok_api' | 'fallback'; error?: string }> {
  try {
    // Try Grok API first
    const grokResult = await fetchGrokTrendAnalysis()
    
    if (grokResult.success && grokResult.data) {
      console.log('Using Grok API trend data')
      return {
        data: convertGrokToTrendData(grokResult.data),
        source: 'grok_api'
      }
    }
    
    // Fall back to dummy data
    console.log('Falling back to dummy trend data:', grokResult.error)
    const fallbackData = generateFallbackTrendData()
    
    return {
      data: convertGrokToTrendData(fallbackData),
      source: 'fallback',
      error: grokResult.error
    }
    
  } catch (error) {
    console.error('Error in trend analysis:', error)
    
    // Generate fallback data
    const fallbackData = generateFallbackTrendData()
    
    return {
      data: convertGrokToTrendData(fallbackData),
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}