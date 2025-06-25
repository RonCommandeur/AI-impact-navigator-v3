'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Brain } from 'lucide-react'

export default function AssessmentPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the assessment form page
    router.replace('/assessment/form')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto">
          <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Redirecting to Assessment
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Taking you to the AI impact assessment form...
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading</span>
          </div>
        </div>
      </div>
    </div>
  )
}