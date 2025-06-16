'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, ArrowLeft, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Loader2, Share2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import { generateAIAssessment, type UserProfile, type AssessmentResult } from '@/lib/ai-assessment'

function AssessmentResultsContent() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateResults = async () => {
      try {
        // Get form data from URL params
        const profile: UserProfile = {
          jobTitle: searchParams.get('jobTitle') || '',
          skills: searchParams.get('skills') || '',
          experience: searchParams.get('experience') || '',
          industry: searchParams.get('industry') || '',
          concerns: searchParams.get('concerns') || ''
        }

        if (!profile.jobTitle || !profile.skills) {
          setError('Missing required information. Please complete the assessment form.')
          setLoading(false)
          return
        }

        // Generate AI assessment
        const assessment = await generateAIAssessment(profile)
        setResult(assessment)

        // Save assessment to database
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('assessments')
            .insert({
              user_id: user.id,
              job_title: profile.jobTitle,
              skills: profile.skills,
              experience: profile.experience,
              industry: profile.industry,
              concerns: profile.concerns,
              risk_level: assessment.riskLevel,
              risk_percentage: assessment.riskPercentage,
              impact_areas: assessment.impactAreas,
              opportunities: assessment.opportunities,
              recommendations: assessment.recommendations,
              timeframe: assessment.timeframe,
              detailed_analysis: assessment.detailedAnalysis
            })
        }

      } catch (err) {
        console.error('Error generating assessment:', err)
        setError('Failed to generate assessment. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    generateResults()
  }, [searchParams])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
      case 'medium': return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30'
      case 'high': return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
      default: return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-900/30'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-5 h-5" />
      case 'medium': return <AlertTriangle className="w-5 h-5" />
      case 'high': return <AlertTriangle className="w-5 h-5" />
      default: return <AlertTriangle className="w-5 h-5" />
    }
  }

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: 'My AI Impact Assessment',
          text: `I just completed an AI impact assessment! My risk level is ${result.riskLevel} with ${result.riskPercentage}% automation risk.`,
          url: window.location.href
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Analyzing Your Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI is generating personalized insights for your career...
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
        <nav className="container mx-auto px-4 py-6">
          <Link href="/assessment/form" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Assessment</span>
          </Link>
        </nav>
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md mx-4 border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardContent className="text-center p-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Assessment Error
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {error}
              </p>
              <Link href="/assessment/form">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/assessment/form" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1">
            <ArrowLeft className="w-5 h-5" />
            <span>New Assessment</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span className="font-semibold hidden sm:inline">Assessment Results</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Risk Overview */}
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3 mb-2">
                    Your AI Impact Assessment
                    <Badge className={getRiskColor(result.riskLevel)}>
                      {getRiskIcon(result.riskLevel)}
                      {result.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Based on your profile as a {searchParams.get('jobTitle')}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Automation Risk</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{result.riskPercentage}%</span>
                  </div>
                  <Progress value={result.riskPercentage} className="h-3" />
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  AI may impact approximately {result.riskPercentage}% of your current tasks within the next {result.timeframe}.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {result.detailedAnalysis}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Areas and Opportunities */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Areas of Impact
                </CardTitle>
                <CardDescription>
                  Tasks that may be affected by AI automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.impactAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  New Opportunities
                </CardTitle>
                <CardDescription>
                  Emerging roles and skills in the AI era
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Recommended Actions
              </CardTitle>
              <CardDescription>
                Steps you can take to thrive in the AI era
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Sparkles className="w-5 h-5 mr-2" />
                Share in Community
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
            <Link href="/assessment/form">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Take New Assessment
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default function AssessmentResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <AssessmentResultsContent />
    </Suspense>
  )
}