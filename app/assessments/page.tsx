'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, ArrowLeft, Calendar, Briefcase, TrendingUp, AlertTriangle, CheckCircle, Loader2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

interface AssessmentRecord {
  id: string
  job: string
  skills: string[]
  ai_prediction: any
  created_at: string
  updated_at: string
}

// Expanded mock data with 20 diverse assessment entries
const mockAssessments: AssessmentRecord[] = [
  {
    id: '1',
    job: 'Frontend Developer',
    skills: ['JavaScript', 'React', 'CSS', 'Node.js', 'TypeScript'],
    ai_prediction: {
      risk_score: 25,
      impact: 'Low automation risk - AI enhances rather than replaces frontend developers. Your skills in React and JavaScript are in high demand.',
      actions: ['Learn AI coding assistants', 'Master prompt engineering', 'Focus on user experience', 'Build AI-powered applications'],
      opportunities: ['AI-assisted development', 'AI tool integration', 'Enhanced productivity workflows', 'AI model deployment'],
      timeframe: '3-5 years',
      confidence: 0.9
    },
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    job: 'Graphic Designer',
    skills: ['Photoshop', 'Illustrator', 'Figma', 'Brand Design', 'Typography'],
    ai_prediction: {
      risk_score: 45,
      impact: 'Medium automation risk - AI tools are transforming design workflows but creative strategy remains essential.',
      actions: ['Learn Midjourney and DALL-E', 'Develop prompt engineering skills', 'Focus on creative strategy', 'Master AI design tools'],
      opportunities: ['AI-assisted design', 'Prompt engineering specialist', 'Creative AI direction', 'NFT and digital art creation'],
      timeframe: '2-3 years',
      confidence: 0.85
    },
    created_at: '2025-01-10T14:20:00Z',
    updated_at: '2025-01-10T14:20:00Z'
  },
  {
    id: '3',
    job: 'Content Writer',
    skills: ['Content Creation', 'SEO', 'Copywriting', 'WordPress', 'Social Media'],
    ai_prediction: {
      risk_score: 65,
      impact: 'High automation risk - AI can generate content but lacks human insight and cultural understanding.',
      actions: ['Specialize in strategic writing', 'Learn AI writing tools', 'Focus on brand voice', 'Develop content strategy skills'],
      opportunities: ['AI content editing', 'Prompt crafting specialist', 'Content strategy consultant', 'AI writing trainer'],
      timeframe: '1-2 years',
      confidence: 0.8
    },
    created_at: '2025-01-08T09:15:00Z',
    updated_at: '2025-01-08T09:15:00Z'
  },
  {
    id: '4',
    job: 'Data Analyst',
    skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics', 'Power BI'],
    ai_prediction: {
      risk_score: 40,
      impact: 'Medium automation risk - AI automates analysis but requires human interpretation and business context.',
      actions: ['Learn machine learning', 'Master advanced visualization', 'Focus on strategic insights', 'Build storytelling skills'],
      opportunities: ['AI-powered analytics', 'Machine learning analyst', 'Business intelligence expert', 'Predictive analytics consultant'],
      timeframe: '2-4 years',
      confidence: 0.85
    },
    created_at: '2025-01-05T16:45:00Z',
    updated_at: '2025-01-05T16:45:00Z'
  },
  {
    id: '5',
    job: 'UX Designer',
    skills: ['User Research', 'Prototyping', 'Figma', 'Usability Testing', 'Design Systems'],
    ai_prediction: {
      risk_score: 30,
      impact: 'Low-medium automation risk - AI can assist with design but human empathy and user understanding remain crucial.',
      actions: ['Learn AI design tools', 'Focus on user psychology', 'Master research methods', 'Integrate AI in workflows'],
      opportunities: ['AI-enhanced user research', 'Conversational AI design', 'Personalized experiences', 'AI ethics in design'],
      timeframe: '3-4 years',
      confidence: 0.88
    },
    created_at: '2025-01-03T11:20:00Z',
    updated_at: '2025-01-03T11:20:00Z'
  },
  {
    id: '6',
    job: 'Digital Marketing Manager',
    skills: ['Google Ads', 'Facebook Ads', 'Analytics', 'SEO', 'Content Marketing'],
    ai_prediction: {
      risk_score: 50,
      impact: 'Medium automation risk - AI transforms marketing automation but strategic thinking and creativity remain essential.',
      actions: ['Learn AI marketing tools', 'Master data analysis', 'Focus on strategy', 'Build personalization expertise'],
      opportunities: ['AI marketing automation', 'Personalization expert', 'AI-powered optimization', 'Marketing AI consultant'],
      timeframe: '2-3 years',
      confidence: 0.82
    },
    created_at: '2024-12-28T13:10:00Z',
    updated_at: '2024-12-28T13:10:00Z'
  },
  {
    id: '7',
    job: 'Elementary School Teacher',
    skills: ['Curriculum Development', 'Classroom Management', 'Educational Technology', 'Student Assessment'],
    ai_prediction: {
      risk_score: 20,
      impact: 'Low automation risk - AI enhances education but cannot replace human connection, empathy, and mentorship.',
      actions: ['Integrate AI in lessons', 'Learn educational AI tools', 'Focus on mentorship', 'Develop AI literacy curriculum'],
      opportunities: ['AI-enhanced learning', 'Educational AI consultant', 'Personalized education', 'AI literacy educator'],
      timeframe: '4-6 years',
      confidence: 0.9
    },
    created_at: '2024-12-25T08:30:00Z',
    updated_at: '2024-12-25T08:30:00Z'
  },
  {
    id: '8',
    job: 'Software Engineer',
    skills: ['Python', 'Java', 'AWS', 'Docker', 'Git', 'System Design'],
    ai_prediction: {
      risk_score: 22,
      impact: 'Low automation risk - AI accelerates coding but complex system design and architecture require human expertise.',
      actions: ['Master AI coding tools', 'Learn prompt engineering', 'Focus on architecture', 'Build AI integration skills'],
      opportunities: ['AI-assisted development', 'AI model deployment', 'MLOps specialist', 'AI application architect'],
      timeframe: '3-5 years',
      confidence: 0.92
    },
    created_at: '2024-12-20T15:45:00Z',
    updated_at: '2024-12-20T15:45:00Z'
  },
  {
    id: '9',
    job: 'Product Manager',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis', 'Stakeholder Management'],
    ai_prediction: {
      risk_score: 18,
      impact: 'Low automation risk - AI supports product decisions but strategic vision and stakeholder management remain uniquely human.',
      actions: ['Learn AI product features', 'Master data-driven decisions', 'Focus on strategy', 'Build AI product expertise'],
      opportunities: ['AI product strategy', 'AI feature development', 'Product AI consultant', 'AI ethics in products'],
      timeframe: '3-5 years',
      confidence: 0.87
    },
    created_at: '2024-12-18T10:15:00Z',
    updated_at: '2024-12-18T10:15:00Z'
  },
  {
    id: '10',
    job: 'Business Analyst',
    skills: ['Requirements Analysis', 'Process Mapping', 'Stakeholder Management', 'SQL', 'Business Intelligence'],
    ai_prediction: {
      risk_score: 35,
      impact: 'Medium automation risk - AI can analyze data but business context understanding and stakeholder communication remain essential.',
      actions: ['Learn AI analytics tools', 'Focus on strategic analysis', 'Build communication skills', 'Master business intelligence'],
      opportunities: ['AI business insights', 'Process automation consultant', 'AI implementation specialist', 'Digital transformation analyst'],
      timeframe: '2-4 years',
      confidence: 0.83
    },
    created_at: '2024-12-15T12:40:00Z',
    updated_at: '2024-12-15T12:40:00Z'
  },
  {
    id: '11',
    job: 'HR Manager',
    skills: ['Talent Acquisition', 'Employee Relations', 'Performance Management', 'HR Analytics', 'Compensation'],
    ai_prediction: {
      risk_score: 28,
      impact: 'Low-medium automation risk - AI assists with screening and analytics but human judgment in people decisions remains critical.',
      actions: ['Learn HR AI tools', 'Focus on strategic HR', 'Build emotional intelligence', 'Master people analytics'],
      opportunities: ['AI-powered recruitment', 'People analytics specialist', 'AI bias prevention', 'Employee experience AI'],
      timeframe: '3-4 years',
      confidence: 0.86
    },
    created_at: '2024-12-12T09:25:00Z',
    updated_at: '2024-12-12T09:25:00Z'
  },
  {
    id: '12',
    job: 'Financial Analyst',
    skills: ['Financial Modeling', 'Excel', 'Bloomberg', 'Valuation', 'Risk Analysis', 'Python'],
    ai_prediction: {
      risk_score: 42,
      impact: 'Medium automation risk - AI excels at data processing but strategic financial insights and client relationships remain human-driven.',
      actions: ['Learn financial AI tools', 'Focus on strategic analysis', 'Build client relationships', 'Master advanced modeling'],
      opportunities: ['AI-powered modeling', 'Algorithmic trading', 'Risk AI specialist', 'Financial AI consultant'],
      timeframe: '2-3 years',
      confidence: 0.84
    },
    created_at: '2024-12-08T14:55:00Z',
    updated_at: '2024-12-08T14:55:00Z'
  },
  {
    id: '13',
    job: 'Customer Service Representative',
    skills: ['Communication', 'Problem Solving', 'CRM Software', 'Conflict Resolution', 'Product Knowledge'],
    ai_prediction: {
      risk_score: 58,
      impact: 'Medium-high automation risk - AI chatbots handle routine queries but complex issues and emotional support require human touch.',
      actions: ['Specialize in complex issues', 'Learn AI support tools', 'Focus on emotional intelligence', 'Build technical expertise'],
      opportunities: ['AI training specialist', 'Customer experience consultant', 'AI quality assurance', 'Human-AI collaboration expert'],
      timeframe: '1-3 years',
      confidence: 0.79
    },
    created_at: '2024-12-05T11:30:00Z',
    updated_at: '2024-12-05T11:30:00Z'
  },
  {
    id: '14',
    job: 'Sales Representative',
    skills: ['Relationship Building', 'CRM', 'Lead Generation', 'Negotiation', 'Market Analysis'],
    ai_prediction: {
      risk_score: 32,
      impact: 'Medium automation risk - AI assists with lead scoring and analysis but relationship building and complex negotiations remain human-centric.',
      actions: ['Learn AI sales tools', 'Focus on relationship building', 'Master consultative selling', 'Build industry expertise'],
      opportunities: ['AI-powered lead generation', 'Sales AI trainer', 'Customer intelligence specialist', 'AI sales strategy consultant'],
      timeframe: '2-4 years',
      confidence: 0.81
    },
    created_at: '2024-12-01T16:20:00Z',
    updated_at: '2024-12-01T16:20:00Z'
  },
  {
    id: '15',
    job: 'Operations Manager',
    skills: ['Process Optimization', 'Supply Chain', 'Project Management', 'Quality Control', 'Team Leadership'],
    ai_prediction: {
      risk_score: 26,
      impact: 'Low-medium automation risk - AI optimizes processes but strategic planning and team leadership require human judgment.',
      actions: ['Learn AI optimization tools', 'Focus on strategic planning', 'Build leadership skills', 'Master change management'],
      opportunities: ['AI process optimization', 'Supply chain AI', 'Operations AI consultant', 'Digital transformation leader'],
      timeframe: '3-5 years',
      confidence: 0.88
    },
    created_at: '2024-11-28T13:45:00Z',
    updated_at: '2024-11-28T13:45:00Z'
  },
  {
    id: '16',
    job: 'Research Scientist',
    skills: ['Research Design', 'Statistical Analysis', 'Python', 'Machine Learning', 'Publication Writing'],
    ai_prediction: {
      risk_score: 24,
      impact: 'Low automation risk - AI accelerates research but hypothesis formation, experimental design, and interpretation remain human-driven.',
      actions: ['Master AI research tools', 'Focus on novel hypotheses', 'Build interdisciplinary skills', 'Learn AI ethics'],
      opportunities: ['AI research acceleration', 'AI model development', 'Research AI consultant', 'AI ethics researcher'],
      timeframe: '4-6 years',
      confidence: 0.91
    },
    created_at: '2024-11-25T10:10:00Z',
    updated_at: '2024-11-25T10:10:00Z'
  },
  {
    id: '17',
    job: 'Social Media Manager',
    skills: ['Content Creation', 'Analytics', 'Community Management', 'Paid Advertising', 'Brand Strategy'],
    ai_prediction: {
      risk_score: 52,
      impact: 'Medium automation risk - AI generates content and optimizes ads but brand voice and community engagement require human creativity.',
      actions: ['Learn AI content tools', 'Focus on strategy', 'Build community skills', 'Master brand storytelling'],
      opportunities: ['AI content optimization', 'Social AI specialist', 'Brand AI consultant', 'Community AI tools trainer'],
      timeframe: '1-3 years',
      confidence: 0.78
    },
    created_at: '2024-11-22T14:35:00Z',
    updated_at: '2024-11-22T14:35:00Z'
  },
  {
    id: '18',
    job: 'Project Manager',
    skills: ['Project Planning', 'Agile', 'Risk Management', 'Stakeholder Communication', 'Resource Management'],
    ai_prediction: {
      risk_score: 29,
      impact: 'Low-medium automation risk - AI assists with scheduling and tracking but stakeholder management and strategic decisions remain human-centered.',
      actions: ['Learn AI project tools', 'Focus on leadership', 'Build strategic thinking', 'Master change management'],
      opportunities: ['AI project optimization', 'Digital transformation PM', 'AI implementation specialist', 'Project AI consultant'],
      timeframe: '3-4 years',
      confidence: 0.85
    },
    created_at: '2024-11-18T09:50:00Z',
    updated_at: '2024-11-18T09:50:00Z'
  },
  {
    id: '19',
    job: 'Accountant',
    skills: ['Financial Reporting', 'Tax Preparation', 'Auditing', 'Excel', 'QuickBooks', 'Compliance'],
    ai_prediction: {
      risk_score: 48,
      impact: 'Medium automation risk - AI automates routine bookkeeping but complex analysis, compliance, and advisory services remain valuable.',
      actions: ['Learn AI accounting tools', 'Focus on advisory services', 'Build analytical skills', 'Master compliance expertise'],
      opportunities: ['AI-powered auditing', 'Financial AI consultant', 'Compliance automation', 'AI tax optimization'],
      timeframe: '2-3 years',
      confidence: 0.82
    },
    created_at: '2024-11-15T12:25:00Z',
    updated_at: '2024-11-15T12:25:00Z'
  },
  {
    id: '20',
    job: 'Video Editor',
    skills: ['Adobe Premiere', 'After Effects', 'Color Grading', 'Motion Graphics', 'Audio Editing'],
    ai_prediction: {
      risk_score: 55,
      impact: 'Medium-high automation risk - AI can handle basic editing but creative storytelling and complex post-production require human artistry.',
      actions: ['Learn AI video tools', 'Focus on creative direction', 'Master advanced techniques', 'Build storytelling skills'],
      opportunities: ['AI-assisted editing', 'Creative AI director', 'Video AI trainer', 'AI post-production specialist'],
      timeframe: '1-2 years',
      confidence: 0.77
    },
    created_at: '2024-11-12T15:40:00Z',
    updated_at: '2024-11-12T15:40:00Z'
  }
]

export default function MyAssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(mockAssessments)
  const [loading, setLoading] = useState(false)

  // Mock user for demo mode
  const mockUser = {
    id: 'demo-user-id',
    email: 'test@example.com'
  }

  const getRiskColor = (score: number) => {
    if (score <= 25) return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
    if (score <= 50) return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30'
    return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
  }

  const getRiskIcon = (score: number) => {
    if (score <= 25) return <CheckCircle className="w-4 h-4" />
    if (score <= 50) return <AlertTriangle className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
  }

  const getRiskLevel = (score: number) => {
    if (score <= 25) return 'LOW'
    if (score <= 50) return 'MEDIUM'
    return 'HIGH'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const viewAssessmentDetails = (assessment: AssessmentRecord) => {
    if (!assessment.ai_prediction) {
      return
    }

    // Create URL params for the results page
    const params = new URLSearchParams({
      jobTitle: assessment.job,
      skills: assessment.skills.join(', '),
      prediction: JSON.stringify(assessment.ai_prediction)
    })
    
    window.location.href = `/assessment/results?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-4 py-4 sm:py-8 flex-grow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            My AI Assessments
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your AI impact predictions across different roles and see how your career insights have evolved over time.
          </p>
        </motion.div>

        {/* Demo Mode Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="text-center p-6">
              <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Demo Mode Active
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Viewing 20 sample assessments across diverse career paths. Take a real assessment to see your data here.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assessments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} found
            </div>
            <Link href="/assessment/form">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                New Assessment
              </Button>
            </Link>
          </div>

          {/* Assessments Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
                      onClick={() => viewAssessmentDetails(assessment)}>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getRiskColor(assessment.ai_prediction.risk_score)}>
                          {getRiskIcon(assessment.ai_prediction.risk_score)}
                          <span className="ml-1">{getRiskLevel(assessment.ai_prediction.risk_score)}</span>
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {assessment.ai_prediction.risk_score}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Risk Score
                          </div>
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2 flex items-center gap-2 group-hover:text-purple-600 transition-colors">
                          <Briefcase className="w-5 h-5 text-purple-600" />
                          {assessment.job}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(assessment.updated_at)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Skills Assessed
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {assessment.skills.slice(0, 3).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {assessment.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{assessment.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Impact Summary */}
                      <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          AI Impact Summary
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {assessment.ai_prediction.impact}
                        </p>
                      </div>

                      {/* Confidence & Timeframe */}
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Confidence: {Math.round(assessment.ai_prediction.confidence * 100)}%
                        </span>
                        <span>
                          Timeframe: {assessment.ai_prediction.timeframe}
                        </span>
                      </div>

                      {/* Action Hint */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Click to view details
                        </span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-purple-600" />
                          <TrendingUp className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}