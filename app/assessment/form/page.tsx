'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Brain, ArrowLeft, Loader2, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'
import { parseSkillsString, skillsArrayToString } from '@/lib/supabase-users'
import { generateAIPrediction, type UserProfile, type AIPrediction } from '@/lib/ai-predictions'

interface FormData {
  jobTitle: string
  skills: string[]
  skillsInput: string
  experience: string
  industry: string
  concerns: string
}

export default function AssessmentFormPage() {
  const [submitting, setSubmitting] = useState(false)
  const [generatingPrediction, setGeneratingPrediction] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    skills: [],
    skillsInput: '',
    experience: '',
    industry: '',
    concerns: ''
  })

  // Mock user for demo mode
  const mockUser = {
    id: 'demo-user-id',
    email: 'test@example.com'
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSkillsInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      skillsInput: value,
      skills: parseSkillsString(value)
    }))
  }

  const addSkillTag = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      const newSkills = [...formData.skills, trimmedSkill]
      setFormData(prev => ({
        ...prev,
        skills: newSkills,
        skillsInput: skillsArrayToString(newSkills)
      }))
    }
  }

  const removeSkillTag = (skillToRemove: string) => {
    const newSkills = formData.skills.filter(skill => skill !== skillToRemove)
    setFormData(prev => ({
      ...prev,
      skills: newSkills,
      skillsInput: skillsArrayToString(newSkills)
    }))
  }

  const handleSkillsKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const input = e.currentTarget.value.trim()
      if (input) {
        addSkillTag(input)
        e.currentTarget.value = ''
      }
    }
  }

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!formData.jobTitle.trim()) {
      errors.push('Job title is required')
    }

    if (formData.skills.length === 0) {
      errors.push('At least one skill is required')
    }

    const validSkills = formData.skills.filter(skill => skill.trim().length > 0)
    if (validSkills.length === 0) {
      errors.push('Please enter valid skills')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateForm()
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error))
      return
    }

    try {
      setSubmitting(true)
      
      toast.success('Profile data prepared! Generating AI impact prediction...')
      
      // Generate AI prediction
      setGeneratingPrediction(true)
      
      const userProfile: UserProfile = {
        job: formData.jobTitle.trim(),
        skills: formData.skills.filter(skill => skill.trim().length > 0),
        experience: formData.experience.trim(),
        industry: formData.industry.trim(),
        concerns: formData.concerns.trim()
      }

      const prediction = await generateAIPrediction(userProfile)
      
      toast.success('🎉 AI prediction generated successfully!')
      
      // Redirect to results page with prediction data
      const params = new URLSearchParams({
        jobTitle: formData.jobTitle,
        skills: formData.skillsInput,
        experience: formData.experience,
        industry: formData.industry,
        concerns: formData.concerns,
        prediction: JSON.stringify(prediction)
      })
      
      window.location.href = `/assessment/results?${params.toString()}`
      
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
      setGeneratingPrediction(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="font-semibold hidden sm:inline">AI Impact Assessment</span>
            </div>
            <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
              Demo Mode
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Assessment Form */}
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl mb-2 text-gray-900 dark:text-white">
                Tell Us About Yourself
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                Share your professional background to receive personalized AI impact predictions with structured JSON insights and actionable recommendations.
              </CardDescription>
              {generatingPrediction && (
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Generating AI predictions...</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title - Required */}
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-900 dark:text-white">
                    Job Title *
                  </Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    placeholder="e.g., Graphic Designer, Software Developer, Content Writer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    required
                    className="h-12 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    aria-describedby="jobTitle-help"
                  />
                  <p id="jobTitle-help" className="text-xs text-gray-500 dark:text-gray-400">
                    Enter your current job title or the role you're interested in
                  </p>
                </div>

                {/* Skills - Required with Tags */}
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-medium text-gray-900 dark:text-white">
                    Key Skills *
                  </Label>
                  
                  {/* Skills Tags Display */}
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-md border">
                      {formData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkillTag(skill)}
                            className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                            aria-label={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Input
                    id="skills"
                    type="text"
                    placeholder="Type a skill and press Enter or comma to add (e.g., JavaScript, Photoshop)"
                    value={formData.skillsInput}
                    onChange={(e) => handleSkillsInputChange(e.target.value)}
                    onKeyDown={handleSkillsKeyPress}
                    className="h-12 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    aria-describedby="skills-help"
                  />
                  <p id="skills-help" className="text-xs text-gray-500 dark:text-gray-400">
                    Add your skills one by one. Press Enter or comma after each skill to add it as a tag.
                  </p>
                </div>

                {/* Experience - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-900 dark:text-white">
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    type="text"
                    placeholder="e.g., 5 years, Entry level, 10+ years"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="h-12 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Industry - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-900 dark:text-white">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    type="text"
                    placeholder="e.g., Technology, Marketing, Healthcare, Education"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="h-12 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Concerns - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="concerns" className="text-sm font-medium text-gray-900 dark:text-white">
                    Concerns or Goals (Optional)
                  </Label>
                  <Textarea
                    id="concerns"
                    placeholder="e.g., Worried about job automation, want to learn AI tools, looking for new opportunities"
                    value={formData.concerns}
                    onChange={(e) => handleInputChange('concerns', e.target.value)}
                    className="min-h-[100px] text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-y"
                    aria-describedby="concerns-help"
                  />
                  <p id="concerns-help" className="text-xs text-gray-500 dark:text-gray-400">
                    Share any specific concerns about AI or goals you'd like to achieve
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting || !formData.jobTitle.trim() || formData.skills.length === 0}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {generatingPrediction ? 'Generating AI Predictions...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      Get My AI Impact Prediction
                      <Sparkles className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Demo Mode Note */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    * Required fields. Running in demo mode - no account needed.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}