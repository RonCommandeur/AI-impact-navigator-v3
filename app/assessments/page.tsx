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

// Mock data for demo mode
const mockAssessments: AssessmentRecord[] = [
  {
    id: '1',
    job: 'Frontend Developer',
    skills: ['JavaScript', 'React', 'CSS', 'Node.js'],
    ai_prediction: {
      risk_score: 25,
      impact: 'Low automation risk - AI enhances rather than replaces frontend developers. Your skills in React and JavaScript are in high demand.',
      actions: ['Learn AI coding assistants', 'Master prompt engineering', 'Focus on user experience'],
      opportunities: ['AI-assisted development', 'AI tool integration', 'Enhanced productivity workflows'],
      timeframe: '3-5 years',
      confidence: 0.9
    },
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    job: 'Graphic Designer',
    skills: ['Photoshop', 'Illustrator', 'Figma', 'Brand Design'],
    ai_prediction: {
      risk_score: 45,
      impact: 'Medium automation risk - AI tools are transforming design workflows but creative strategy remains essential.',
      actions: ['Learn Midjourney and DALL-E', 'Develop prompt engineering skills', 'Focus on creative strategy'],
      opportunities: ['AI-assisted design', 'Prompt engineering specialist', 'Creative AI direction'],
      timeframe: '2-3 years',
      confidence: 0.85
    },
    created_at: '2025-01-10T14:20:00Z',
    updated_at: '2025-01-10T14:20:00Z'
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
            Track your AI impact predictions and see how your career insights have evolved over time.
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
                Viewing sample assessment history. Take a real assessment to see your data here.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assessments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
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

          {/* Assessments Cards */}
          <div className="grid gap-6">
            {assessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => viewAssessmentDetails(assessment)}>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl flex items-center gap-3 mb-2">
                          <Briefcase className="w-5 h-5 text-purple-600" />
                          {assessment.job}
                          {assessment.ai_prediction && (
                            <Badge className={getRiskColor(assessment.ai_prediction.risk_score)}>
                              {getRiskIcon(assessment.ai_prediction.risk_score)}
                              <span className="ml-1">{getRiskLevel(assessment.ai_prediction.risk_score)}</span>
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          Completed on {formatDate(assessment.updated_at)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {assessment.ai_prediction && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {assessment.ai_prediction.risk_score}%
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Risk Score
                            </div>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Skills Assessed
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {assessment.skills.slice(0, 4).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {assessment.skills.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{assessment.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Impact Summary */}
                      {assessment.ai_prediction && (
                        <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            AI Impact Summary
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {assessment.ai_prediction.impact}
                          </p>
                        </div>
                      )}

                      {/* Action Hint */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Click to view full details
                        </span>
                        <TrendingUp className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
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