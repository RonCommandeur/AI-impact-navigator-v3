'use client'

import { Brain } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              AI Impact Navigator
            </span>
          </div>
          
          {/* Powered by text */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Powered by{' '}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Bolt.new
            </a>
            {' '}& Supabase
          </div>
        </div>
        
        {/* Mobile-centered version for very small screens */}
        <div className="sm:hidden text-center mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Built for the 2025 Hackathon
          </div>
        </div>
      </div>
    </footer>
  )
}