// AI Impact Predictions using Claude-like analysis
// Generates structured JSON predictions for user profiles

import { triggerMetricsUpdate } from './supabase-metrics'

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
  detailed_impact: {
    immediate_threats: string[]
    long_term_opportunities: string[]
    skill_gaps: string[]
    market_shifts: string[]
    strategic_advantages: string[]
  }
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
    detailed_impact: {
      immediate_threats: [
        'AI can now generate logos, social media graphics, and basic layouts within seconds',
        'Stock photography and illustration markets are being disrupted by AI-generated content',
        'Template-based design work is increasingly automated through AI design tools',
        'Basic photo editing and image enhancement tasks are becoming fully automated'
      ],
      long_term_opportunities: [
        'Creative strategy and brand storytelling remain uniquely human domains',
        'AI-human collaboration in design will become the new standard, amplifying creativity',
        'New career paths emerging in AI prompt engineering and creative AI direction',
        'Demand for designers who can effectively leverage AI tools is rapidly increasing'
      ],
      skill_gaps: [
        'Limited knowledge of AI design tools like Midjourney, DALL-E, and Stable Diffusion',
        'Lack of prompt engineering skills for generating precise visual content',
        'Missing understanding of AI capabilities and limitations in creative work',
        'Need for hybrid skills combining traditional design with AI augmentation'
      ],
      market_shifts: [
        'Design agencies are restructuring teams to include AI specialists',
        'Clients increasingly expect faster turnaround times enabled by AI tools',
        'Freelance market is becoming more competitive as AI lowers barriers to entry',
        'Premium design work now focuses on strategy, brand identity, and complex problem-solving'
      ],
      strategic_advantages: [
        'Your creative vision and aesthetic judgment cannot be replicated by AI',
        'Client relationship skills and communication remain essential',
        'Understanding of brand psychology and user experience principles',
        'Ability to iterate and refine based on feedback and business objectives'
      ]
    },
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
    detailed_impact: {
      immediate_threats: [
        'AI can generate boilerplate code and simple functions with high accuracy',
        'Basic debugging and code review tasks are increasingly automated',
        'Simple algorithm implementations can be generated instantly by AI',
        'Documentation writing and code commenting are becoming automated'
      ],
      long_term_opportunities: [
        'Complex system architecture and design remain human-driven',
        'AI will amplify developer productivity by 3-5x in many tasks',
        'New opportunities in AI model integration and deployment',
        'Growing demand for developers who can build AI-powered applications'
      ],
      skill_gaps: [
        'Limited experience with AI coding assistants like GitHub Copilot',
        'Lack of prompt engineering skills for effective code generation',
        'Missing knowledge of AI/ML model integration and deployment',
        'Need for better understanding of AI capabilities and limitations'
      ],
      market_shifts: [
        'Development teams are restructuring around AI-augmented workflows',
        'Companies expect faster delivery cycles enabled by AI tools',
        'Junior developer roles are evolving to require AI proficiency',
        'Senior roles increasingly focus on architecture and AI strategy'
      ],
      strategic_advantages: [
        'Problem-solving skills and logical thinking cannot be automated',
        'System design and architecture require human judgment',
        'Understanding business requirements and translating them to code',
        'Debugging complex issues and optimizing performance at scale'
      ]
    },
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
    detailed_impact: {
      immediate_threats: [
        'AI can produce blog posts, product descriptions, and marketing copy at scale',
        'Basic research and fact compilation tasks are becoming automated',
        'SEO article writing and content optimization can be done by AI',
        'Social media posts and email campaigns are increasingly AI-generated'
      ],
      long_term_opportunities: [
        'Complex storytelling and narrative development remain uniquely human',
        'Brand voice development and strategic content planning require human insight',
        'Investigative journalism and original research cannot be automated',
        'Editorial judgment and content curation skills are becoming more valuable'
      ],
      skill_gaps: [
        'Limited experience with AI writing tools and platforms',
        'Lack of skills in directing and editing AI-generated content',
        'Missing knowledge of prompt engineering for content creation',
        'Need for better understanding of AI-human collaborative workflows'
      ],
      market_shifts: [
        'Content agencies are restructuring around AI-assisted workflows',
        'Clients expect faster content production and lower costs',
        'Freelance writing market is becoming more competitive',
        'Premium writing services focus on strategy, research, and brand voice'
      ],
      strategic_advantages: [
        'Cultural understanding and emotional intelligence in writing',
        'Ability to conduct interviews and build relationships with sources',
        'Critical thinking and fact-checking capabilities',
        'Understanding of audience psychology and persuasion techniques'
      ]
    },
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
    detailed_impact: {
      immediate_threats: [
        'AI can generate lesson plans, quizzes, and educational materials instantly',
        'Basic grading and feedback on simple assignments are becoming automated',
        'Research and content compilation for curriculum development can be AI-assisted',
        'Administrative tasks like scheduling and progress tracking are increasingly automated'
      ],
      long_term_opportunities: [
        'Personalized learning experiences will be revolutionized by AI',
        'Teachers can focus more on mentorship, emotional support, and critical thinking',
        'AI will enable better tracking of student progress and learning gaps',
        'New opportunities in AI literacy education and digital citizenship'
      ],
      skill_gaps: [
        'Limited knowledge of AI tools for education and lesson planning',
        'Lack of understanding about AI ethics and responsible use in education',
        'Missing skills in interpreting AI-generated analytics and insights',
        'Need for training in AI-assisted personalized learning approaches'
      ],
      market_shifts: [
        'Educational institutions are investing heavily in AI integration',
        'Students increasingly expect personalized and adaptive learning experiences',
        'Teaching roles are evolving to include AI literacy instruction',
        'Administrative efficiency is becoming a key performance metric'
      ],
      strategic_advantages: [
        'Emotional intelligence and empathy cannot be replicated by AI',
        'Ability to inspire and motivate students through personal connection',
        'Critical thinking instruction and Socratic questioning methods',
        'Cultural sensitivity and understanding of diverse learning needs'
      ]
    },
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
    detailed_impact: {
      immediate_threats: [
        'AI can generate ad copy, email campaigns, and social media content at scale',
        'Basic market research and competitor analysis are becoming automated',
        'Campaign optimization and A/B testing can be handled by AI algorithms',
        'Customer segmentation and targeting are increasingly AI-driven'
      ],
      long_term_opportunities: [
        'Strategic brand positioning and messaging require human insight',
        'Complex customer journey mapping and experience design remain human-centered',
        'Crisis management and reputation strategy need human judgment',
        'Creative campaign concepts and storytelling benefit from human creativity'
      ],
      skill_gaps: [
        'Limited experience with AI marketing automation platforms',
        'Lack of skills in interpreting AI-generated analytics and insights',
        'Missing knowledge of AI-powered personalization strategies',
        'Need for better understanding of AI ethics in marketing and privacy'
      ],
      market_shifts: [
        'Marketing teams are restructuring around AI-powered tools and workflows',
        'Clients expect more sophisticated targeting and personalization',
        'Real-time campaign optimization is becoming the standard',
        'Data privacy regulations are reshaping AI-driven marketing practices'
      ],
      strategic_advantages: [
        'Understanding of human psychology and behavioral triggers',
        'Ability to build authentic brand relationships and trust',
        'Strategic thinking and long-term brand vision development',
        'Crisis communication and reputation management skills'
      ]
    },
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
    detailed_impact: {
      immediate_threats: [
        'AI can process and analyze large datasets faster than humans',
        'Basic statistical analysis and pattern recognition are becoming automated',
        'Report generation and data visualization can be done by AI tools',
        'Routine data cleaning and preparation tasks are increasingly automated'
      ],
      long_term_opportunities: [
        'Strategic interpretation of data insights requires human business acumen',
        'Complex problem-solving and hypothesis formation remain human-driven',
        'Stakeholder communication and presentation skills are becoming more valuable',
        'AI model development and validation create new career opportunities'
      ],
      skill_gaps: [
        'Limited experience with advanced AI and machine learning tools',
        'Lack of skills in AI model interpretation and validation',
        'Missing knowledge of AI ethics and bias detection in analytics',
        'Need for better understanding of AI-assisted decision-making frameworks'
      ],
      market_shifts: [
        'Analytics teams are integrating AI and machine learning specialists',
        'Clients expect more predictive insights and real-time analytics',
        'Self-service analytics tools are democratizing basic analysis',
        'Advanced analytics roles are focusing on AI strategy and implementation'
      ],
      strategic_advantages: [
        'Business context understanding and domain expertise',
        'Ability to ask the right questions and frame analytical problems',
        'Communication skills for translating data insights to stakeholders',
        'Critical thinking for validating and challenging AI-generated insights'
      ]
    },
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
    detailed_impact: {
      immediate_threats: [
        'AI can handle routine scheduling, reporting, and administrative tasks',
        'Basic performance monitoring and metrics tracking are becoming automated',
        'Simple decision-making processes can be supported by AI algorithms',
        'Resource allocation and project planning tools are increasingly AI-powered'
      ],
      long_term_opportunities: [
        'Strategic planning and vision development remain uniquely human capabilities',
        'Team motivation, coaching, and conflict resolution require emotional intelligence',
        'Change management and organizational transformation need human leadership',
        'AI strategy development creates new opportunities for forward-thinking managers'
      ],
      skill_gaps: [
        'Limited understanding of AI capabilities and limitations for business applications',
        'Lack of skills in managing AI-augmented teams and workflows',
        'Missing knowledge of AI ethics, governance, and risk management',
        'Need for better understanding of digital transformation strategies'
      ],
      market_shifts: [
        'Organizations are restructuring around AI-enabled processes and teams',
        'Boards and executives expect AI strategy development and implementation',
        'Employee expectations include AI-powered productivity tools and support',
        'Management roles are evolving to include AI governance and oversight'
      ],
      strategic_advantages: [
        'Emotional intelligence and interpersonal skills cannot be automated',
        'Strategic thinking and long-term vision development require human insight',
        'Change management and organizational culture building remain human-centered',
        'Ethical decision-making and values-based leadership are uniquely human'
      ]
    },
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
    detailed_impact: {
      immediate_threats: [
        'AI can automate routine administrative and data entry tasks',
        'Basic research, compilation, and report generation are becoming automated',
        'Simple decision-making processes can be supported by AI algorithms',
        'Communication tasks like email drafting and scheduling are increasingly AI-assisted'
      ],
      long_term_opportunities: [
        'Strategic thinking and complex problem-solving remain uniquely human',
        'Relationship building and interpersonal skills become more valuable',
        'Creative and innovative thinking cannot be replicated by AI',
        'Ethical decision-making and values-based judgment require human insight'
      ],
      skill_gaps: [
        'Limited familiarity with AI tools relevant to your industry',
        'Lack of understanding about AI capabilities and limitations',
        'Missing skills in human-AI collaboration and workflow integration',
        'Need for continuous learning and adaptation strategies'
      ],
      market_shifts: [
        'Organizations across industries are integrating AI into core processes',
        'Job roles are evolving to require AI literacy and collaboration skills',
        'Remote and hybrid work models are being enhanced by AI tools',
        'Continuous learning and reskilling are becoming essential for career growth'
      ],
      strategic_advantages: [
        'Domain expertise and industry knowledge cannot be easily automated',
        'Communication and relationship-building skills remain essential',
        'Critical thinking and problem-solving abilities are uniquely human',
        'Adaptability and learning agility provide competitive advantages'
      ]
    },
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

// Save AI prediction to Supabase profiles table
export async function saveAIPrediction(authUserId: string, prediction: AIPrediction): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await import('./supabase')
    
    const { error } = await supabase
      .from('profiles')
      .update({
        ai_prediction: prediction,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', authUserId)

    if (error) {
      console.error('Save prediction error:', error)
      return { success: false, error: 'Failed to save AI prediction' }
    }

    // Trigger metrics update in the background
    triggerMetricsUpdate(authUserId)

    return { success: true }
  } catch (error) {
    console.error('Save prediction error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get AI prediction from Supabase profiles table
export async function getAIPrediction(authUserId: string): Promise<{ data: AIPrediction | null; error?: string }> {
  try {
    const { supabase } = await import('./supabase')
    
    const { data, error } = await supabase
      .from('profiles')
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