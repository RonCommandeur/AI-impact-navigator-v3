'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  ArrowLeft, 
  Brain, 
  Users, 
  Award, 
  Target, 
  BookOpen, 
  Zap, 
  Menu,
  X,
  ChevronRight,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Star,
  Loader2,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Footer } from '@/components/footer'
import { supabase } from '@/lib/supabase'
import { getUserMetrics, updateUserMetrics, triggerMetricsUpdate, type UserMetrics } from '@/lib/supabase-metrics'
import { toast } from 'sonner'
import type { User as SupabaseUser } from '@supabase/supabase-js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface TrendData {
  aiJobGrowth: number
  automationRisk: number
  skillDemand: { skill: string; growth: number; color: string }[]
  marketInsights: string[]
  industryTrends: { month: string; growth: number; risk: number }[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'trends' | 'activity'>('overview')
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    skillsLearned: [],
    assessmentsCompleted: 0,
    communityContributions: 0,
    nftsEarned: 0,
    progressScore: 0,
    totalVotes: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    skillProficiency: [
      { skill: 'AI Tools', level: 0 },
      { skill: 'Prompt Engineering', level: 0 },
      { skill: 'Data Analysis', level: 0 },
      { skill: 'Creative Strategy', level: 0 },
      { skill: 'Community Building', level: 0 }
    ]
  })

  const [trendData, setTrendData] = useState<TrendData>({
    aiJobGrowth: 28,
    automationRisk: 32,
    skillDemand: [
      { skill: 'AI Prompt Engineering', growth: 156, color: '#3b82f6' },
      { skill: 'Data Science', growth: 134, color: '#10b981' },
      { skill: 'Creative AI', growth: 128, color: '#8b5cf6' },
      { skill: 'AI Ethics', growth: 112, color: '#f59e0b' },
      { skill: 'Human-AI Collaboration', growth: 98, color: '#ef4444' }
    ],
    marketInsights: [
      '28% increase in AI-related job postings this quarter',
      'Prompt engineering skills show 156% growth in demand',
      'Remote AI roles growing 45% faster than on-site positions',
      'Creative + AI hybrid roles emerging as top opportunity',
      'AI ethics expertise becoming essential for leadership roles'
    ],
    industryTrends: [
      { month: 'Jan', growth: 15, risk: 42 },
      { month: 'Feb', growth: 18, risk: 40 },
      { month: 'Mar', growth: 22, risk: 38 },
      { month: 'Apr', growth: 25, risk: 36 },
      { month: 'May', growth: 26, risk: 34 },
      { month: 'Jun', growth: 28, risk: 32 }
    ]
  })

  // Check authentication status and load metrics
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserMetrics(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (event === 'SIGNED_IN' && session?.user) {
          toast.success('Successfully signed in!')
          await loadUserMetrics(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          // Reset metrics to default
          setUserMetrics({
            skillsLearned: [],
            assessmentsCompleted: 0,
            communityContributions: 0,
            nftsEarned: 0,
            progressScore: 0,
            totalVotes: 0,
            weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
            skillProficiency: [
              { skill: 'AI Tools', level: 0 },
              { skill: 'Prompt Engineering', level: 0 },
              { skill: 'Data Analysis', level: 0 },
              { skill: 'Creative Strategy', level: 0 },
              { skill: 'Community Building', level: 0 }
            ]
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserMetrics = async (authUserId: string) => {
    try {
      const { data, error } = await getUserMetrics(authUserId)
      
      if (error) {
        console.error('Error loading metrics:', error)
        toast.error('Failed to load dashboard metrics')
        return
      }

      if (data) {
        setUserMetrics(data)
      }
    } catch (error) {
      console.error('Error loading metrics:', error)
      toast.error('Failed to load dashboard metrics')
    }
  }

  const handleRefreshMetrics = async () => {
    if (!user) return

    try {
      setRefreshing(true)
      
      // Trigger metrics recalculation
      const { success, error } = await updateUserMetrics(user.id)
      
      if (!success) {
        toast.error(error || 'Failed to refresh metrics')
        return
      }

      // Reload metrics
      await loadUserMetrics(user.id)
      toast.success('Metrics refreshed successfully!')
      
    } catch (error) {
      console.error('Error refreshing metrics:', error)
      toast.error('Failed to refresh metrics')
    } finally {
      setRefreshing(false)
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

  // Chart configurations with high contrast
  const skillsChartData = {
    labels: userMetrics.skillProficiency.map(s => s.skill),
    datasets: [
      {
        label: 'Proficiency Level (%)',
        data: userMetrics.skillProficiency.map(s => s.level),
        backgroundColor: [
          'rgba(59, 130, 246, 0.9)',
          'rgba(16, 185, 129, 0.9)',
          'rgba(139, 92, 246, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(239, 68, 68, 0.9)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  }

  const skillDemandChartData = {
    labels: trendData.skillDemand.map(s => s.skill),
    datasets: [
      {
        label: 'Growth Rate (%)',
        data: trendData.skillDemand.map(s => s.growth),
        backgroundColor: trendData.skillDemand.map(s => s.color + 'E6'),
        borderColor: trendData.skillDemand.map(s => s.color),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  }

  const activityChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Activity Points',
        data: userMetrics.weeklyActivity,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  }

  const progressChartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [userMetrics.progressScore, 100 - userMetrics.progressScore],
        backgroundColor: ['#10b981', '#e5e7eb'],
        borderColor: ['#059669', '#d1d5db'],
        borderWidth: 3,
        cutout: '75%',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500'
          },
          maxRotation: 45,
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    cutout: '75%',
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'activity', label: 'Activity', icon: Activity }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Loading Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Preparing your AI insights...
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Almost ready</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
        <nav className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </nav>
        <div className="flex-grow flex items-center justify-center px-4">
          <Card className="max-w-md mx-auto border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardContent className="text-center p-8">
              <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign In Required
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please sign in to view your dashboard and progress metrics.
              </p>
              <Link href="/assessment/form">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Sign In & Get Started
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Mobile Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI Progress Insights</p>
              </div>
            </div>

            {/* Right side - User menu and refresh */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshMetrics}
                disabled={refreshing}
                className="p-2"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              {user && (
                <>
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{user.email?.split('@')[0]}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="p-2"
                  >
                    <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="mt-3 flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900"
            >
              <div className="px-4 py-3 space-y-2">
                <Link href="/assessment/form" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">New Assessment</span>
                </Link>
                <Link href="/community" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Community</span>
                </Link>
                <Link href="/assessments" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900 dark:text-white">My Assessments</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Overview Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Target className="w-6 h-6" />
                        AI Readiness Score
                      </CardTitle>
                      <CardDescription className="text-blue-100 mt-1">
                        Your overall progress in AI adaptation
                      </CardDescription>
                    </div>
                    <div className="w-20 h-20 relative">
                      <Doughnut data={progressChartData} options={doughnutOptions} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{userMetrics.progressScore}%</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-blue-100">
                        {userMetrics.progressScore >= 75 ? 'Excellent Progress' : 
                         userMetrics.progressScore >= 50 ? 'Good Progress' : 
                         userMetrics.progressScore >= 25 ? 'Getting Started' : 'Just Beginning'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-blue-100">
                        {userMetrics.lastCalculated ? 'Real-time data' : 'Live metrics'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Skills</p>
                        <p className="text-2xl font-bold text-blue-600">{userMetrics.skillsLearned.length}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        From your profile
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Assessments</p>
                        <p className="text-2xl font-bold text-green-600">{userMetrics.assessmentsCompleted}</p>
                      </div>
                      <Brain className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        AI predictions
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Posts</p>
                        <p className="text-2xl font-bold text-purple-600">{userMetrics.communityContributions}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-purple-600">
                        <Award className="w-3 h-3 mr-1" />
                        {userMetrics.totalVotes} votes
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">NFTs</p>
                        <p className="text-2xl font-bold text-yellow-600">{userMetrics.nftsEarned}</p>
                      </div>
                      <Award className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-yellow-600">
                        <Zap className="w-3 h-3 mr-1" />
                        Algorand NFTs
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Activity Chart */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your engagement over the past 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <Line data={activityChartData} options={lineOptions} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Skills Progress Chart */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Skill Proficiency
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your current skill levels and progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar data={skillsChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Skills List */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Skills Mastered</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your growing AI toolkit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userMetrics.skillProficiency.map((skill, index) => (
                      <div key={skill.skill} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{skill.skill}</span>
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learned Skills */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Skills from Your Profile</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Skills you've added to your assessment profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userMetrics.skillsLearned.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userMetrics.skillsLearned.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Complete an assessment to add skills to your profile
                      </p>
                      <Link href="/assessment/form">
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                          Take Assessment
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Market Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">AI Job Growth</p>
                        <p className="text-3xl font-bold">+{trendData.aiJobGrowth}%</p>
                        <p className="text-green-100 text-sm">This quarter</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Automation Risk</p>
                        <p className="text-3xl font-bold">{trendData.automationRisk}%</p>
                        <p className="text-orange-100 text-sm">Industry average</p>
                      </div>
                      <Brain className="w-12 h-12 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skill Demand Chart */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    In-Demand Skills
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Skills with highest growth in job market demand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar data={skillDemandChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Market Insights</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Latest trends and opportunities in AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendData.marketInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your latest actions and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userMetrics.assessmentsCompleted > 0 && (
                      <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-600">
                          <Brain className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Completed AI Impact Assessment</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Generated personalized predictions</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    
                    {userMetrics.nftsEarned > 0 && (
                      <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-yellow-600">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Earned Community NFT</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Algorand blockchain verified</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    
                    {userMetrics.communityContributions > 0 && (
                      <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-green-600">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Posted in Community Hub</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{userMetrics.totalVotes} votes received</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    
                    {userMetrics.skillsLearned.length > 0 && (
                      <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-purple-600">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Updated Skills Profile</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{userMetrics.skillsLearned.length} skills added</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600">
                        <Star className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Joined AI Impact Navigator</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to the community!</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Continue your AI journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/assessment/form">
                      <Button className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <div className="text-center">
                          <Brain className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-sm font-medium">New Assessment</span>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/community">
                      <Button variant="outline" className="w-full h-16 border-2">
                        <div className="text-center">
                          <Users className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-sm font-medium">Join Community</span>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}