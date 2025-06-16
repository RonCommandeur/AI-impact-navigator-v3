'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, ArrowLeft, Brain, Users, Award, Target, BookOpen, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Footer } from '@/components/footer'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

interface UserMetrics {
  skillsLearned: string[]
  assessmentsCompleted: number
  communityContributions: number
  nftsEarned: number
  progressScore: number
}

interface TrendData {
  aiJobGrowth: number
  automationRisk: number
  skillDemand: { skill: string; growth: number }[]
  marketInsights: string[]
}

export default function DashboardPage() {
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    skillsLearned: ['Prompt Engineering', 'AI Tools', 'Bolt.new', 'Community Building'],
    assessmentsCompleted: 2,
    communityContributions: 3,
    nftsEarned: 1,
    progressScore: 75
  })

  const [trendData, setTrendData] = useState<TrendData>({
    aiJobGrowth: 23,
    automationRisk: 35,
    skillDemand: [
      { skill: 'Prompt Engineering', growth: 150 },
      { skill: 'AI Tool Mastery', growth: 120 },
      { skill: 'Data Analysis', growth: 90 },
      { skill: 'Creative Strategy', growth: 85 }
    ],
    marketInsights: [
      '23% increase in AI-related job postings this month',
      'Prompt engineering skills in highest demand',
      'Remote AI roles growing 40% faster than on-site',
      'Creative + AI hybrid roles emerging rapidly'
    ]
  })

  const skillsChartData = {
    labels: userMetrics.skillsLearned,
    datasets: [
      {
        label: 'Proficiency Level',
        data: [85, 70, 90, 60],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  }

  const trendsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'AI Job Growth (%)',
        data: [5, 8, 12, 18, 20, 23],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Automation Risk (%)',
        data: [40, 38, 37, 36, 35, 35],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <span className="font-semibold">Progress Dashboard</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Your AI Journey Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your progress, celebrate achievements, and stay ahead of AI trends.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Target className="w-8 h-8" />
                Overall Progress
              </CardTitle>
              <CardDescription className="text-purple-100">
                Your AI adaptation journey score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">AI Readiness Score</span>
                  <span className="text-2xl font-bold">{userMetrics.progressScore}%</span>
                </div>
                <Progress value={userMetrics.progressScore} className="h-4 bg-white/20" />
                <p className="text-purple-100">
                  Excellent progress! You're well-prepared for the AI revolution.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Skills Learned</p>
                  <p className="text-2xl font-bold text-blue-600">{userMetrics.skillsLearned.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assessments</p>
                  <p className="text-2xl font-bold text-green-600">{userMetrics.assessmentsCompleted}</p>
                </div>
                <Brain className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contributions</p>
                  <p className="text-2xl font-bold text-purple-600">{userMetrics.communityContributions}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">NFTs Earned</p>
                  <p className="text-2xl font-bold text-yellow-600">{userMetrics.nftsEarned}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Your Skills Progress
                </CardTitle>
                <CardDescription>
                  Proficiency levels in key AI-related skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar data={skillsChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trends Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Market Trends
                </CardTitle>
                <CardDescription>
                  AI job growth vs automation risk over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={trendsChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Skills & Insights */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills Learned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Skills Mastered</CardTitle>
                <CardDescription>
                  Your growing AI toolkit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userMetrics.skillsLearned.map((skill, index) => (
                    <Badge
                      key={skill}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>
                  Latest AI industry trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendData.marketInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recommended Next Steps</CardTitle>
              <CardDescription>
                Continue your AI journey with these actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    Take Another Assessment
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Explore AI's impact on different career paths or update your current assessment.
                  </p>
                  <Link href="/assessment">
                    <Badge className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                      Start Assessment
                    </Badge>
                  </Link>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                    Share Your Experience
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Help others by sharing your AI journey in the community hub.
                  </p>
                  <Link href="/community">
                    <Badge className="bg-green-600 hover:bg-green-700 cursor-pointer">
                      Join Community
                    </Badge>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}