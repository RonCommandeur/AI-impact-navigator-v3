'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, ArrowLeft, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Loader2, Share2, Code, Target, Clock } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import { type AIPrediction } from '@/lib/ai-predictions'

function AssessmentResultsContent() {
  const searchParams = useSearchParams()
  const [prediction, setPrediction] = useState<AIPrediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showJSON, setShowJSON] = useState(false)

  useEffect(() => {
    const loadResults = async () => {
      try {
        // Get prediction data from URL params
        const predictionParam = searchParams.get('prediction')
        
        if (!predictionParam) {
          setError('No prediction data found. Please complete the assessment form.')
          setLoading(false)
          return
        }

        const parsedPrediction: AIPrediction = JSON.parse(predictionParam)
        setPrediction(parsedPrediction)

      } catch (err) {
        console.error('Error loading results:', err)
        setError('Failed to load assessment results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [searchParams])

  const getRiskColor = (score: number) => {
    if (score <= 25) return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
    if (score <= 50) return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30'
    return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
  }

  const getRiskIcon = (score: number) => {
    if (score <= 25) return <CheckCircle className="w-5 h-5" />
    if (score <= 50) return <AlertTriangle className="w-5 h-5" />
    return <AlertTriangle className="w-5 h-5" />
  }

  const getRiskLevel = (score: number) => {
    if (score <= 25) return 'LOW'
    if (score <= 50) return 'MEDIUM'
    return 'HIGH'
  }

  const handleShare = async () => {
    if (navigator.share && prediction) {
      try {
        await navigator.share({
          title: 'My AI Impact Prediction',
          text: `I just got my AI impact prediction! Risk score: ${prediction.risk_score}% - ${prediction.impact}`,
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

  const copyJSONToClipboard = () => {
    if (prediction) {
      navigator.clipboard.writeText(JSON.stringify(prediction, null, 2))
      toast.success('JSON prediction copied to clipboard!')
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
              Loading Your AI Prediction
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Preparing your personalized results...
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Almost ready</span>
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
                Results Error
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

  if (!prediction) {
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
            <span className="font-semibold hidden sm:inline">AI Prediction Results</span>
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
                    Your AI Impact Prediction
                    <Badge className={getRiskColor(prediction.risk_score)}>
                      {getRiskIcon(prediction.risk_score)}
                      {getRiskLevel(prediction.risk_score)} RISK
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Based on your profile as a {searchParams.get('jobTitle')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowJSON(!showJSON)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Code className="w-4 h-4" />
                    {showJSON ? 'Hide' : 'Show'} JSON
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Risk Score</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{prediction.risk_score}%</span>
                  </div>
                  <Progress value={prediction.risk_score} className="h-3" />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {prediction.impact}
                  </p>
                </div>
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Timeframe: {prediction.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>Confidence: {Math.round(prediction.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JSON Display */}
          {showJSON && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-500" />
                      JSON Prediction Data
                    </CardTitle>
                    <Button
                      onClick={copyJSONToClipboard}
                      variant="outline"
                      size="sm"
                    >
                      Copy JSON
                    </Button>
                  </div>
                  <CardDescription>
                    Structured prediction data for developers and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-gray-800 dark:text-gray-200">
                      {JSON.stringify(prediction, null, 2)}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Actions and Opportunities */}
          <div className="grid md:grid-cols-2 gap-6">
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
                <ul className="space-y-3">
                  {prediction.actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{action}</span>
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
                  Emerging roles and possibilities in your field
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {prediction.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

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