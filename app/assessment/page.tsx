'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, ArrowLeft, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'

interface AssessmentResult {
  riskLevel: 'low' | 'medium' | 'high'
  riskPercentage: number
  impactAreas: string[]
  opportunities: string[]
  recommendations: string[]
  timeframe: string
}

export default function AssessmentPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    jobTitle: '',
    skills: '',
    experience: '',
    industry: '',
    concerns: ''
  })
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateAssessment = async () => {
    setLoading(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock AI assessment based on job title
    const jobTitle = formData.jobTitle.toLowerCase()
    let mockResult: AssessmentResult
    
    if (jobTitle.includes('designer') || jobTitle.includes('artist')) {
      mockResult = {
        riskLevel: 'medium',
        riskPercentage: 45,
        impactAreas: ['Image generation', 'Logo design', 'Basic illustrations'],
        opportunities: ['AI-assisted design', 'NFT creation', 'Prompt engineering'],
        recommendations: [
          'Learn AI design tools like Midjourney and DALL-E',
          'Develop prompt engineering skills',
          'Focus on creative strategy and client relationships',
          'Explore NFT and digital art markets'
        ],
        timeframe: '2-3 years'
      }
    } else if (jobTitle.includes('developer') || jobTitle.includes('programmer')) {
      mockResult = {
        riskLevel: 'low',
        riskPercentage: 25,
        impactAreas: ['Code generation', 'Bug fixing', 'Documentation'],
        opportunities: ['AI-assisted coding', 'Prompt engineering', 'AI model training'],
        recommendations: [
          'Master AI coding assistants like GitHub Copilot',
          'Learn prompt engineering for code generation',
          'Focus on system architecture and problem-solving',
          'Develop skills in AI/ML model deployment'
        ],
        timeframe: '3-5 years'
      }
    } else if (jobTitle.includes('writer') || jobTitle.includes('content')) {
      mockResult = {
        riskLevel: 'high',
        riskPercentage: 65,
        impactAreas: ['Content creation', 'Copywriting', 'Basic research'],
        opportunities: ['AI content editing', 'Prompt crafting', 'Content strategy'],
        recommendations: [
          'Specialize in creative and strategic writing',
          'Learn to work with AI writing tools',
          'Develop expertise in content strategy',
          'Focus on brand voice and storytelling'
        ],
        timeframe: '1-2 years'
      }
    } else {
      mockResult = {
        riskLevel: 'medium',
        riskPercentage: 35,
        impactAreas: ['Routine tasks', 'Data processing', 'Basic analysis'],
        opportunities: ['AI tool integration', 'Process optimization', 'Strategic thinking'],
        recommendations: [
          'Learn relevant AI tools for your industry',
          'Develop strategic and creative thinking skills',
          'Focus on human-centered tasks',
          'Build expertise in AI tool management'
        ],
        timeframe: '2-4 years'
      }
    }
    
    setResult(mockResult)
    setLoading(false)
    setStep(3)
    toast.success('Assessment completed!')
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">AI Impact Assessment</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 flex-grow">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Discover AI's Impact on Your Career</CardTitle>
                <CardDescription className="text-base">
                  Tell us about yourself and we'll provide personalized insights on how AI might affect your work and what opportunities await.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Graphic Designer, Software Developer, Content Writer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Key Skills *</Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., Photoshop, JavaScript, Content Strategy, Data Analysis"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 5 years"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Marketing, Healthcare"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="h-12"
                  />
                </div>
                
                <Button 
                  onClick={() => setStep(2)} 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={!formData.jobTitle || !formData.skills}
                >
                  Continue Assessment
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">Additional Context</CardTitle>
                <CardDescription className="text-base">
                  Help us provide more personalized insights by sharing any specific concerns or goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="concerns">Concerns or Goals (Optional)</Label>
                  <Textarea
                    id="concerns"
                    placeholder="e.g., Worried about job automation, want to learn AI tools, looking for new opportunities"
                    value={formData.concerns}
                    onChange={(e) => handleInputChange('concerns', e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1 h-12"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={generateAssessment}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Get My Assessment'}
                    {!loading && <Brain className="w-5 h-5 ml-2" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Risk Overview */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  Your AI Impact Assessment
                  <Badge className={getRiskColor(result.riskLevel)}>
                    {getRiskIcon(result.riskLevel)}
                    {result.riskLevel.toUpperCase()} RISK
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Based on your profile as a {formData.jobTitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Automation Risk</span>
                      <span className="text-sm text-gray-600">{result.riskPercentage}%</span>
                    </div>
                    <Progress value={result.riskPercentage} className="h-3" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    AI may impact approximately {result.riskPercentage}% of your current tasks within the next {result.timeframe}.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Impact Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Areas of Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.impactAreas.map((area, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    New Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
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
                      <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  Share in Community
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Dashboard
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => {
                  setStep(1)
                  setResult(null)
                  setFormData({
                    jobTitle: '',
                    skills: '',
                    experience: '',
                    industry: '',
                    concerns: ''
                  })
                }}
                className="w-full sm:w-auto"
              >
                Take New Assessment
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}