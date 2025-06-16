// AI Impact Predictions using Claude-like analysis
// Generates structured JSON predictions for user profiles

export interface UserProfile {
  job: string
  skills: string[]
  experience?: string
  industry?: string
  concerns?: string
}

export interface AIPrediction {
  risk_score: number
  impact: string
  actions: string[]
  opportunities: string[]
  timeframe: string
  confidence: number
  analysis_date: string
}

// Enhanced AI prediction engine with Claude-like reasoning
export async function generateAIPrediction(profile: UserProfile): Promise<AIPrediction> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const job = profile.job.toLowerCase()
  const skills = profile.skills.map(s => s.toLowerCase())
  
  // Advanced AI analysis based on job role and skills
  let prediction: AIPrediction
  
  if (isDesignRole(job, skills)) {
    prediction = generateDesignPrediction(profile)
  } else if (isDeveloperRole(job, skills)) {
    prediction = generateDeveloperPrediction(profile)
  } else if (isWriterRole(job, skills)) {
    prediction = generateWriterPrediction(profile)
  } else if (isTeacherRole(job, skills)) {
    prediction = generateTeacherPrediction(profile)
  } else if (isMarketingRole(job, skills)) {
    prediction = generateMarketingPrediction(profile)
  } else if (isAnalystRole(job, skills)) {
    prediction = generateAnalystPrediction(profile)
  } else if (isManagerRole(job, skills)) {
    prediction = generateManagerPrediction(profile)
  } else {
    prediction = generateGenericPrediction(profile)
  }
  
  // Add metadata
  prediction.analysis_date = new Date().toISOString()
  prediction.confidence = calculateConfidence(profile)
  
  return prediction
}

// Role detection functions
function isDesignRole(job: string, skills: string[]): boolean {
  const designKeywords = ['designer', 'design', 'creative', 'artist', 'visual', 'graphic', 'ui', 'ux']
  const designSkills = ['photoshop', 'illustrator', 'figma', 'sketch', 'indesign', 'canva', 'adobe']
  
  return designKeywords.some(keyword => job.includes(keyword)) ||
         skills.some(skill => designSkills.some(designSkill => skill.includes(designSkill)))
}

function isDeveloperRole(job: string, skills: string[]): boolean {
  const devKeywords = ['developer', 'programmer', 'engineer', 'coding', 'software', 'web', 'mobile', 'frontend', 'backend', 'fullstack']
  const devSkills = ['javascript', 'python', 'java', 'react', 'node', 'html', 'css', 'sql', 'git', 'api']
  
  return devKeywords.some(keyword => job.includes(keyword)) ||
         skills.some(skill => devSkills.some(devSkill => skill.includes(devSkill)))
}

function isWriterRole(job: string, skills: string[]): boolean {
  const writerKeywords = ['writer', 'content', 'copywriter', 'journalist', 'blogger', 'editor', 'author']
  const writerSkills = ['writing', 'content', 'copywriting', 'seo', 'wordpress', 'blogging']
  
  return writerKeywords.some(keyword => job.includes(keyword)) ||
         skills.some(skill => writerSkills.some(writerSkill => skill.includes(writerSkill)))
}

function isTeacherRole(job: string, skills: string[]): boolean {
  const teacherKeywords = ['teacher', 'educator', 'instructor', 'professor', 'tutor', 'trainer']
  const teacherSkills = ['teaching', 'education', 'curriculum', 'classroom', 'training']
  
  return teacherKeywords.some(keyword => job.includes(keyword)) ||
         skills.some(skill => teacherSkills.some(teacherSkill => skill.includes(teacherSkill)))
}

function isMarketingRole(job: string, skills: string[]): boolean {
  const marketingKeywords = ['marketing', 'marketer', 'social media', 'digital marketing', 'brand', 'advertising']
  const marketingSkills = ['marketing', 'social media', 'seo', 'google ads', 'facebook ads', 'analytics']
  
  return marketingKeywords.some(keyword => job.includes(keyword)) ||
         skills.some(skill => marketingSkills.some(marketingSkill => skill.includes(marketingSkill)))
}

function isAnalystRole(job: string, skills: string[]): boolean {
  const analystKeywords = ['analyst', 'data', 'research', 'business intelligence', 'statistics']
  const analystSkills = ['excel', 'sql', 'python', 'r', 'tableau', 'power bi', 'analytics', 'statistics']
  
  return analystKeywords.some(keyword => job.includes(keyword)) ||
         skills.some(skill => analystSkills.some(analystSkill => skill.includes(analystSkill)))
}

function isManagerRole(job: string, skills: string[]): boolean {
  const managerKeywords = ['manager', 'director', 'lead', 'supervisor', 'coordinator', 'head']
  const managerSkills = ['management', 'leadership', 'project management', 'team lead']
  
  return managerKeywords.some(keyword => job.includes(keyword)) ||
         skills.some(skill => managerSkills.some(managerSkill => skill.includes(managerSkill)))
}

// Prediction generators for each role type
function generateDesignPrediction(profile: UserProfile): AIPrediction {
  const hasAISkills = profile.skills.some(skill => 
    ['midjourney', 'dall-e', 'ai', 'prompt engineering'].some(ai => skill.toLowerCase().includes(ai))
  )
  
  const riskScore = hasAISkills ? 25 : 45
  
  return {
    risk_score: riskScore,
    impact: `${riskScore}% automation risk - AI tools are transforming design workflows`,
    actions: [
      'Learn Midjourney for AI image generation',
      'Master DALL-E and Stable Diffusion',
      'Develop prompt engineering skills',
      'Focus on creative strategy and brand storytelling',
      'Learn Figma AI plugins and integrations'
    ],
    opportunities: [
      'AI-assisted design workflows',
      'Prompt engineering specialist',
      'AI art direction',
      'NFT and digital art creation',
      'AI tool training and consultation'
    ],
    timeframe: '2-3 years',
    confidence: 0.85
  }
}

function generateDeveloperPrediction(profile: UserProfile): AIPrediction {
  const hasAISkills = profile.skills.some(skill => 
    ['ai', 'machine learning', 'copilot', 'chatgpt', 'claude'].some(ai => skill.toLowerCase().includes(ai))
  )
  
  const riskScore = hasAISkills ? 15 : 30
  
  return {
    risk_score: riskScore,
    impact: `${riskScore}% automation risk - AI enhances rather than replaces developers`,
    actions: [
      'Master GitHub Copilot and AI coding assistants',
      'Learn prompt engineering for code generation',
      'Focus on system architecture and problem-solving',
      'Develop AI/ML integration skills',
      'Build expertise in AI model deployment'
    ],
    opportunities: [
      'AI-assisted development',
      'AI application development',
      'Prompt engineering for code',
      'AI model integration specialist',
      'AI tool development'
    ],
    timeframe: '3-5 years',
    confidence: 0.90
  }
}

function generateWriterPrediction(profile: UserProfile): AIPrediction {
  const hasAISkills = profile.skills.some(skill => 
    ['ai writing', 'chatgpt', 'claude', 'jasper', 'copy.ai'].some(ai => skill.toLowerCase().includes(ai))
  )
  
  const riskScore = hasAISkills ? 40 : 65
  
  return {
    risk_score: riskScore,
    impact: `${riskScore}% automation risk - AI can generate content but lacks human insight`,
    actions: [
      'Specialize in creative and strategic writing',
      'Learn to collaborate with AI writing tools',
      'Develop expertise in brand voice and storytelling',
      'Focus on research and fact-checking skills',
      'Master content strategy and planning'
    ],
    opportunities: [
      'AI content editing and optimization',
      'Prompt crafting specialist',
      'Content strategy consultant',
      'AI writing tool trainer',
      'Human-AI collaborative storytelling'
    ],
    timeframe: '1-2 years',
    confidence: 0.80
  }
}

function generateTeacherPrediction(profile: UserProfile): AIPrediction {
  const hasAISkills = profile.skills.some(skill => 
    ['ai', 'educational technology', 'online learning', 'chatgpt'].some(ai => skill.toLowerCase().includes(ai))
  )
  
  const riskScore = hasAISkills ? 15 : 25
  
  return {
    risk_score: riskScore,
    impact: `${riskScore}% automation risk - AI enhances education but cannot replace human connection`,
    actions: [
      'Integrate AI tools for personalized learning',
      'Develop AI literacy curriculum',
      'Learn AI-assisted lesson planning',
      'Focus on mentorship and emotional support',
      'Master blended learning approaches'
    ],
    opportunities: [
      'AI-enhanced personalized learning',
      'Educational AI consultant',
      'AI literacy educator',
      'Adaptive learning specialist',
      'Human-AI collaborative teaching'
    ],
    timeframe: '4-6 years',
    confidence: 0.85
  }
}

function generateMarketingPrediction(profile: UserProfile): AIPrediction {
  const hasAISkills = profile.skills.some(skill => 
    ['ai marketing', 'chatgpt', 'automation', 'ai analytics'].some(ai => skill.toLowerCase().includes(ai))
  )
  
  const riskScore = hasAISkills ? 30 : 50
  
  return {
    risk_score: riskScore,
    impact: `${riskScore}% automation risk - AI transforms marketing but requires human strategy`,
    actions: [
      'Learn AI marketing automation tools',
      'Master AI-powered analytics and insights',
      'Develop creative campaign strategy skills',
      'Focus on brand storytelling and positioning',
      'Build expertise in AI-driven personalization'
    ],
    opportunities: [
      'AI marketing automation specialist',
      'Personalization strategy expert',
      'AI-powered content optimization',
      'Marketing AI consultant',
      'Customer journey AI architect'
    ],
    timeframe: '2-3 years',
    confidence: 0.80
  }
}

function generateAnalystPrediction(profile: UserProfile): AIPrediction {
  const hasAISkills = profile.skills.some(skill => 
    ['machine learning', 'ai', 'python', 'data science'].some(ai => skill.toLowerCase().includes(ai))
  )
  
  const riskScore = hasAISkills ? 20 : 40
  
  return {
    risk_score: riskScore,
    impact: `${riskScore}% automation risk - AI automates analysis but requires human interpretation`,
    actions: [
      'Learn machine learning and AI analytics',
      'Master advanced data visualization',
      'Develop business storytelling skills',
      'Focus on strategic recommendations',
      'Build expertise in AI model interpretation'
    ],
    opportunities: [
      'AI-powered analytics specialist',
      'Machine learning analyst',
      'Business intelligence AI expert',
      'Predictive analytics consultant',
      'Data science AI researcher'
    ],
    timeframe: '2-4 years',
    confidence: 0.85
  }
}

function generateManagerPrediction(profile: UserProfile): AIPrediction {
  const hasAISkills = profile.skills.some(skill => 
    ['ai', 'digital transformation', 'automation', 'ai strategy'].some(ai => skill.toLowerCase().includes(ai))
  )
  
  const riskScore = hasAISkills ? 10 : 25
  
  return {
    risk_score: riskScore,
    impact: `${riskScore}% automation risk - AI enhances management but cannot replace leadership`,
    actions: [
      'Develop AI strategy and implementation skills',
      'Learn to manage AI-augmented teams',
      'Focus on change management and adaptation',
      'Build expertise in AI ethics and governance',
      'Master human-AI collaboration frameworks'
    ],
    opportunities: [
      'AI transformation leader',
      'Digital strategy consultant',
      'AI governance specialist',
      'Human-AI collaboration expert',
      'AI ethics and policy advisor'
    ],
    timeframe: '3-5 years',
    confidence: 0.90
  }
}

function generateGenericPrediction(profile: UserProfile): AIPrediction {
  const riskScore = 35
  
  return {
    risk_score: riskScore,
    impact: `${riskScore}% automation risk - AI will impact routine tasks across industries`,
    actions: [
      'Learn relevant AI tools for your industry',
      'Develop critical thinking and problem-solving skills',
      'Focus on human-centered tasks and relationships',
      'Build expertise in AI tool management',
      'Cultivate creativity and strategic thinking'
    ],
    opportunities: [
      'AI tool integration specialist',
      'Process optimization expert',
      'Human-AI collaboration facilitator',
      'AI training and support',
      'Strategic planning and adaptation'
    ],
    timeframe: '2-4 years',
    confidence: 0.70
  }
}

function calculateConfidence(profile: UserProfile): number {
  let confidence = 0.70 // Base confidence
  
  // Increase confidence based on profile completeness
  if (profile.experience) confidence += 0.05
  if (profile.industry) confidence += 0.05
  if (profile.skills.length > 3) confidence += 0.10
  if (profile.skills.length > 6) confidence += 0.05
  if (profile.concerns) confidence += 0.05
  
  return Math.min(confidence, 0.95) // Cap at 95%
}

// Save AI prediction to Supabase users table
export async function saveAIPrediction(authUserId: string, prediction: AIPrediction): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await import('./supabase')
    
    const { error } = await supabase
      .from('users')
      .update({
        ai_prediction: prediction,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', authUserId)

    if (error) {
      console.error('Save prediction error:', error)
      return { success: false, error: 'Failed to save AI prediction' }
    }

    return { success: true }
  } catch (error) {
    console.error('Save prediction error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get AI prediction from Supabase users table
export async function getAIPrediction(authUserId: string): Promise<{ data: AIPrediction | null; error?: string }> {
  try {
    const { supabase } = await import('./supabase')
    
    const { data, error } = await supabase
      .from('users')
      .select('ai_prediction')
      .eq('auth_user_id', authUserId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Get prediction error:', error)
      return { data: null, error: 'Failed to load AI prediction' }
    }

    return { data: data?.ai_prediction || null }
  } catch (error) {
    console.error('Get prediction error:', error)
    return { data: null, error: 'An unexpected error occurred' }
  }
}