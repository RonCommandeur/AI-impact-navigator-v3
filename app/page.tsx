'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Users, TrendingUp, Zap, ArrowRight, Sparkles, History } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Footer } from '@/components/footer'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Impact Navigator
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/assessment" className="text-gray-600 hover:text-blue-600 transition-colors">
              Assessment
            </Link>
            <Link href="/assessments" className="text-gray-600 hover:text-blue-600 transition-colors">
              My Assessments
            </Link>
            <Link href="/community" className="text-gray-600 hover:text-blue-600 transition-colors">
              Community
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-20 flex-grow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Bolt.new Hackathon 2025
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Navigate Your AI Future
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover how AI impacts your career, connect with a thriving community, and track your progress in the AI revolution. Built for individuals, communities, and citizen developers.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/assessment">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                Start AI Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3">
                Join Community
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl mb-2">AI Impact Assessment</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Get personalized insights on how AI will impact your career. Discover automation risks, new opportunities, and actionable steps to stay ahead.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/assessment">
                <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                  Start Assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <History className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl mb-2">My Assessments</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Track your AI prediction history and see how your career insights have evolved over time. View past assessments and compare results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/assessments">
                <Button variant="ghost" className="w-full justify-between group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
                  View History
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl mb-2">Community Hub</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Share AI experiences, learn from others, and earn blockchain-verified NFTs for valuable contributions. Build your reputation in the AI community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/community">
                <Button variant="ghost" className="w-full justify-between group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                  Join Community
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl mb-2">Progress Dashboard</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Track your AI adaptation journey with real-time metrics, skill progress, and market trends. Stay motivated with visual progress indicators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-between group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20">
                  View Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl sm:text-3xl mb-4">Ready to Navigate Your AI Future?</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Join thousands of individuals and citizen developers who are already preparing for the AI revolution.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/assessment">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-3">
                    Start Your Journey
                    <Zap className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}