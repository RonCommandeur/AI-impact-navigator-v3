'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Brain, 
  Users, 
  Award, 
  Target, 
  BookOpen, 
  Zap, 
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Star,
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

// Chart component that loads dynamically to avoid build issues
const ChartComponent = ({ type, data, options, className = "h-48" }: {
  type: 'bar' | 'doughnut' | 'line'
  data: any
  options: any
  className?: string
}) => {
  const [Chart, setChart] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const loadChart = async () => {
      if (typeof window !== 'undefined') {
        try {
          const chartModule = await import('react-chartjs-2')
          const chartJSModule = await import('chart.js')

          const { Bar, Doughnut, Line } = chartModule
          const {
            Chart: ChartJS,
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
          } = chartJSModule

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

          const chartComponents = { bar: Bar, doughnut: Doughnut, line: Line }
          setChart(() => chartComponents[type])
        } catch (error) {
          console.error('Failed to load chart:', error)
        }
      }
    }

    loadChart()
  }, [type])

  if (!mounted) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="text-gray-400">Loading chart...</div>
      </div>
    )
  }

  if (!Chart) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className={className}>
      <Chart data={data} options={options} />
    </div>
  )
}

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [refreshingTrends, setRefreshingTrends] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'trends' | 'activity'>('overview')

  // Mock user for demo mode
  const mockUser = {
    id: 'demo-user-id',
    email: 'test@example.com'
  }

  // Mock user metrics for demo
  const userMetrics = {
    skillsLearned: ['JavaScript', 'React', 'AI Tools', 'Prompt Engineering'],
    assessmentsCompleted: 2,
    communityContributions: 3,
    nftsEarned: 1,
    progressScore: 75,
    totalVotes: 18,
    weeklyActivity: [12, 8, 15, 22, 18, 25, 20],
    skillProficiency: [
      { skill: 'AI Tools', level: 85 },
      { skill: 'Prompt Engineering', level: 70 },
      { skill: 'Data Analysis', level: 60 },
      { skill: 'Creative Strategy', level: 80 },
      { skill: 'Community Building', level: 65 }
    ]
  }

  // Mock trend data
  const trendData = {
    job_shifts: "28% increase in AI-related positions",
    skill_demand: "156% growth in AI skill requirements",
    automation_risk: "32% of tasks may be automated",
    market_outlook: "Market sentiment: bullish (87% confidence)",
    salary_trends: "12% average salary increase for AI skills",
    remote_work: "78% of AI jobs offer remote options",
    monthly_trends: [
      { month: 'Jan 2025', job_growth: 12, skill_demand: 85 },
      { month: 'Feb 2025', job_growth: 15, skill_demand: 92 },
      { month: 'Mar 2025', job_growth: 18, skill_demand: 98 },
      { month: 'Apr 2025', job_growth: 22, skill_demand: 105 },
      { month: 'May 2025', job_growth: 25, skill_demand: 112 },
      { month: 'Jun 2025', job_growth: 28, skill_demand: 156 }
    ],
    source: 'fallback'
  }

  const handleRefreshMetrics = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
    toast.success('Metrics refreshed successfully!')
  }

  const handleRefreshTrends = async () => {
    setRefreshingTrends(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setRefreshingTrends(false)
    toast.success('Trend data refreshed successfully!')
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

  // Trend charts
  const trendChartData = {
    labels: trendData.monthly_trends.map(t => t.month),
    datasets: [
      {
        label: 'Job Growth (%)',
        data: trendData.monthly_trends.map(t => t.job_growth),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Skill Demand (%)',
        data: trendData.monthly_trends.map(t => t.skill_demand),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
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
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'activity', label: 'Activity', icon: Activity }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <Navigation />

      {/* Dashboard Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              AI Progress Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Track your AI adaptation journey with real-time insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshMetrics}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <WifiOff className="w-3 h-3 text-orange-500" />
              <span className="hidden sm:inline">Demo Data</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
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

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 pb-8">
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
                      <ChartComponent 
                        type="doughnut" 
                        data={progressChartData} 
                        options={doughnutOptions}
                        className="w-20 h-20"
                      />
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
                      <span className="text-blue-100">Excellent Progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-blue-100">Demo metrics</span>
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
                  <ChartComponent 
                    type="line" 
                    data={activityChartData} 
                    options={chartOptions}
                    className="h-48"
                  />
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
                  <ChartComponent 
                    type="bar" 
                    data={skillsChartData} 
                    options={chartOptions}
                    className="h-64"
                  />
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
                  <div className="flex flex-wrap gap-2">
                    {userMetrics.skillsLearned.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
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
              {/* Trend Data Source Indicator */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <WifiOff className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Demo Market Data
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Using sample market estimates for demonstration
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshTrends}
                      disabled={refreshingTrends}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshingTrends ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Market Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Job Market</p>
                        <p className="text-2xl font-bold">{trendData.job_shifts}</p>
                        <p className="text-green-100 text-sm">Current quarter</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Skill Demand</p>
                        <p className="text-2xl font-bold">{trendData.skill_demand}</p>
                        <p className="text-blue-100 text-sm">Growth rate</p>
                      </div>
                      <Brain className="w-12 h-12 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trend Chart */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Market Trends
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Job growth and skill demand over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartComponent 
                    type="line" 
                    data={trendChartData} 
                    options={chartOptions}
                    className="h-64"
                  />
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Market Insights</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Sample trends and opportunities in AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        Market Outlook
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {trendData.market_outlook}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                        Salary Trends
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {trendData.salary_trends}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        Remote Work
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {trendData.remote_work}
                      </p>
                    </div>
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
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-600">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Completed AI Impact Assessment</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Generated personalized predictions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-yellow-600">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Earned Community NFT</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Algorand blockchain verified</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-green-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Posted in Community Hub</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{userMetrics.totalVotes} votes received</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600">
                        <Star className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Joined AI Impact Navigator</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to the community!</p>
                      </div>
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