'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, ArrowLeft, Calendar, Briefcase, TrendingUp, AlertTriangle, CheckCircle, Loader2, Eye, Plus, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import { type AIPrediction } from '@/lib/ai-predictions'
import type { User } from '@supabase/supabase-js'

interface AssessmentRecord {
  id: string
  job: string
  skills: string[]
  ai_prediction: AIPrediction | null
  created_at: string
  updated_at: string
}

export default function MyAssessmentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadAssessments(session.user.id)
      } else {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (event === 'SIGNED_IN' && session?.user) {
          await loadAssessments(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setAssessments([])
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadAssessments = async (authUserId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('id, job, skills, ai_prediction, created_at, updated_at')
        .eq('auth_user_id', authUserId)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error loading assessments:', error)
        setError('Failed to load your assessments. Please try again.')
        return
      }

      // Filter records that have job data (indicating completed assessments)
      const validAssessments = (data || []).filter(record => record.job && record.job.trim())
      setAssessments(validAssessments)

    } catch (error) {
      console.error('Error loading assessments:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Failed to sign out')
      } else {
        toast.success('Signed out successfully')
      }
    } catch (error) {
      toast.error('An error occurred during sign out')
    }
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
      toast.error('No prediction data available for this assessment')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Loading Your Assessments
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Fetching your AI prediction history...
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Almost ready</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
        <nav className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </nav>
        <div className="flex-grow flex items-center justify-center px-4">
          <Card className="max-w-md mx-auto border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardContent className="text-center p-8">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign In Required
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please sign in to view your assessment history.
              </p>
              <Link href="/assessment/form">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Sign In & Take Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md p-1">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <span className="font-semibold hidden sm:inline">My Assessments</span>
              <span className="font-semibold sm:hidden">Assessments</span>
            </div>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

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

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8"
          >
            <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="text-center p-6">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <Button
                  onClick={() => user && loadAssessments(user.id)}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Assessments List */}
        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            {assessments.length === 0 ? (
              // Empty State
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
                <CardContent className="text-center p-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Assessments Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    You haven't completed any AI impact assessments yet. Take your first assessment to get personalized insights about your career.
                  </p>
                  <Link href="/assessment/form">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-5 h-5 mr-2" />
                      Take Your First Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              // Assessments Grid
              <div className="space-y-6">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}