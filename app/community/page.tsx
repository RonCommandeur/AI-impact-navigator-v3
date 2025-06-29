'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Plus, ThumbsUp, Award, Sparkles, MessageCircle, Share2, Loader2, Coins, Heart, BookmarkPlus, Bookmark, ExternalLink, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

// Mock data for demo mode
interface Contribution {
  id: string
  auth_user_id: string
  title: string
  content: string
  image_url?: string
  category: string
  votes: number
  nft_id?: string
  created_at: string
  updated_at: string
  author_email?: string
  user_has_voted?: boolean
  comments?: Comment[]
  comments_count?: number
  user_has_saved?: boolean
}

interface Comment {
  id: string
  author: string
  content: string
  created_at: string
  likes: number
  user_has_liked?: boolean
}

interface ContributionFormData {
  title: string
  content: string
  image_url?: string
  category: string
}

const mockContributions: Contribution[] = [
  {
    id: '1',
    auth_user_id: 'user1',
    title: 'How I Used AI to Boost My Productivity by 300%',
    content: 'After integrating ChatGPT and Claude into my daily workflow, I discovered some amazing strategies that completely transformed how I work. Here are the top 5 tools and techniques that made the biggest difference...',
    category: 'Experience',
    votes: 24,
    nft_id: '123456',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    author_email: 'sarah@example.com',
    user_has_voted: false,
    comments_count: 8,
    user_has_saved: false,
    comments: [
      {
        id: 'c1',
        author: 'Mike Chen',
        content: 'This is exactly what I needed! Thanks for sharing your workflow.',
        created_at: '2025-01-15T11:00:00Z',
        likes: 5,
        user_has_liked: false
      },
      {
        id: 'c2',
        author: 'Emma Rodriguez',
        content: 'The Claude integration tips are gold. Already implemented 3 of them!',
        created_at: '2025-01-15T12:30:00Z',
        likes: 8,
        user_has_liked: true
      }
    ]
  },
  {
    id: '2',
    auth_user_id: 'user2',
    title: 'Complete Guide to Prompt Engineering for Beginners',
    content: 'Prompt engineering is becoming an essential skill. In this guide, I\'ll walk you through the fundamentals, common mistakes to avoid, and advanced techniques that professionals use...',
    category: 'Tutorial',
    votes: 18,
    nft_id: '654321',
    created_at: '2025-01-14T15:30:00Z',
    updated_at: '2025-01-14T15:30:00Z',
    author_email: 'mike@example.com',
    user_has_voted: true,
    comments_count: 12,
    user_has_saved: true,
    comments: [
      {
        id: 'c3',
        author: 'Alex Johnson',
        content: 'Best prompt engineering guide I\'ve read! Bookmarked for future reference.',
        created_at: '2025-01-14T16:00:00Z',
        likes: 15,
        user_has_liked: true
      }
    ]
  },
  {
    id: '3',
    auth_user_id: 'user3',
    title: 'Why I\'m Not Afraid of AI Taking My Job as a Designer',
    content: 'There\'s a lot of fear around AI replacing creative jobs, but I believe it\'s actually making us more creative and strategic. Here\'s how I\'ve adapted and thrived...',
    category: 'Discussion',
    votes: 12,
    nft_id: '789012',
    created_at: '2025-01-13T09:15:00Z',
    updated_at: '2025-01-13T09:15:00Z',
    author_email: 'alex@example.com',
    user_has_voted: false,
    comments_count: 6,
    user_has_saved: false,
    comments: []
  },
  {
    id: '4',
    auth_user_id: 'user4',
    title: 'Building an AI-Powered Side Business: My Journey',
    content: 'I started a content creation business using AI tools and it\'s now generating $5k/month. Here\'s exactly how I did it and what tools I used...',
    category: 'Business',
    votes: 31,
    nft_id: '456789',
    created_at: '2025-01-12T14:20:00Z',
    updated_at: '2025-01-12T14:20:00Z',
    author_email: 'emma@example.com',
    user_has_voted: false,
    comments_count: 25,
    user_has_saved: true,
    comments: []
  },
  // NEW ENTRIES START HERE
  {
    id: '5',
    auth_user_id: 'user5',
    title: 'From Traditional Marketing to AI-First Strategy: 6 Month Update',
    content: 'Six months ago, I was skeptical about AI in marketing. Today, my campaigns are performing 240% better and I\'m working half the hours. Here\'s my complete transformation journey, including the tools that made the difference, mistakes I made, and why traditional marketers need to embrace this shift now...',
    category: 'Experience',
    votes: 42,
    nft_id: '987654',
    created_at: '2025-01-11T08:45:00Z',
    updated_at: '2025-01-11T08:45:00Z',
    author_email: 'priya@example.com',
    user_has_voted: false,
    comments_count: 18,
    user_has_saved: true,
    comments: [
      {
        id: 'c4',
        author: 'David Kim',
        content: 'Amazing results! Which AI tools did you find most effective for campaign optimization?',
        created_at: '2025-01-11T09:20:00Z',
        likes: 12,
        user_has_liked: false
      },
      {
        id: 'c5',
        author: 'Lisa Zhang',
        content: 'This gives me hope! I\'m in traditional marketing and feeling overwhelmed by AI. Your story is inspiring.',
        created_at: '2025-01-11T10:15:00Z',
        likes: 9,
        user_has_liked: true
      },
      {
        id: 'c6',
        author: 'Marcus Thompson',
        content: '240% improvement sounds too good to be true. Can you share some specific metrics?',
        created_at: '2025-01-11T11:30:00Z',
        likes: 3,
        user_has_liked: false
      }
    ]
  },
  {
    id: '6',
    auth_user_id: 'user6',
    title: 'Step-by-Step: Automating Your Email Workflows with Claude',
    content: 'Tired of spending hours on email management? I\'ll show you exactly how to set up Claude to handle 80% of your email tasks. This tutorial covers email sorting, response drafting, calendar scheduling, and follow-up automation. Includes templates and prompts you can copy-paste...',
    category: 'Tutorial',
    votes: 15,
    nft_id: '345678',
    created_at: '2025-01-10T16:30:00Z',
    updated_at: '2025-01-10T16:30:00Z',
    author_email: 'carlos@example.com',
    user_has_voted: true,
    comments_count: 22,
    user_has_saved: false,
    comments: [
      {
        id: 'c7',
        author: 'Jennifer Park',
        content: 'This is a game-changer! Implemented the email sorting system and already saving 2 hours daily.',
        created_at: '2025-01-10T17:15:00Z',
        likes: 18,
        user_has_liked: true
      },
      {
        id: 'c8',
        author: 'Roberto Silva',
        content: 'Love the step-by-step approach. Perfect for someone like me who\'s new to AI automation.',
        created_at: '2025-01-10T18:45:00Z',
        likes: 7,
        user_has_liked: false
      }
    ]
  },
  {
    id: '7',
    auth_user_id: 'user7',
    title: 'My First AI Freelance Client Paid Me $12K for a One-Week Project',
    content: 'I\'ve been freelancing for 3 years, but adding AI services to my offerings changed everything. Last month, a client paid me $12,000 for a project that took one week using AI tools. Here\'s how I positioned myself, what services I offered, and the exact tools I used to deliver incredible results...',
    category: 'Business',
    votes: 67,
    nft_id: '234567',
    created_at: '2025-01-09T12:00:00Z',
    updated_at: '2025-01-09T12:00:00Z',
    author_email: 'taylor@example.com',
    user_has_voted: false,
    comments_count: 34,
    user_has_saved: true,
    comments: [
      {
        id: 'c9',
        author: 'Amanda Foster',
        content: 'Incredible! What type of project was it? I\'m looking to add AI services to my consulting.',
        created_at: '2025-01-09T13:20:00Z',
        likes: 23,
        user_has_liked: false
      },
      {
        id: 'c10',
        author: 'Kevin Wu',
        content: 'This is motivating! I\'ve been hesitant to charge premium rates for AI work, but this shows it\'s possible.',
        created_at: '2025-01-09T14:10:00Z',
        likes: 16,
        user_has_liked: true
      },
      {
        id: 'c11',
        author: 'Nina Petrov',
        content: 'Amazing story! Did you have to learn new skills specifically for this project?',
        created_at: '2025-01-09T15:45:00Z',
        likes: 8,
        user_has_liked: false
      }
    ]
  },
  {
    id: '8',
    auth_user_id: 'user8',
    title: 'The Ethics of AI in Hiring: Where Do We Draw the Line?',
    content: 'As an HR professional, I\'m seeing more companies use AI for resume screening and candidate evaluation. While it\'s efficient, I\'m concerned about bias and fairness. Where should we draw ethical lines? What are your thoughts on AI making decisions about people\'s careers?',
    category: 'Discussion',
    votes: 8,
    created_at: '2025-01-08T19:20:00Z',
    updated_at: '2025-01-08T19:20:00Z',
    author_email: 'rachel@example.com',
    user_has_voted: false,
    comments_count: 16,
    user_has_saved: false,
    comments: [
      {
        id: 'c12',
        author: 'James Parker',
        content: 'Great question! I think transparency is key - candidates should know when AI is involved in the process.',
        created_at: '2025-01-08T20:00:00Z',
        likes: 11,
        user_has_liked: true
      },
      {
        id: 'c13',
        author: 'Maria Gonzalez',
        content: 'AI can help reduce human bias, but only if it\'s trained on diverse, representative data.',
        created_at: '2025-01-08T21:30:00Z',
        likes: 14,
        user_has_liked: false
      },
      {
        id: 'c14',
        author: 'Thomas Liu',
        content: 'I was rejected by an AI system last month. Never got to speak to a human. That felt dehumanizing.',
        created_at: '2025-01-09T08:15:00Z',
        likes: 19,
        user_has_liked: true
      }
    ]
  },
  {
    id: '9',
    auth_user_id: 'user9',
    title: 'My Biggest AI Learning Mistakes (And What I Wish I Knew)',
    content: 'After 18 months of learning AI tools, I\'ve made some expensive mistakes. Spent $2,000 on courses I didn\'t need, wasted months on outdated tools, and nearly burned out trying to learn everything at once. Here are the 7 biggest mistakes I made and how you can avoid them...',
    category: 'Experience',
    votes: 29,
    nft_id: '876543',
    created_at: '2025-01-07T14:15:00Z',
    updated_at: '2025-01-07T14:15:00Z',
    author_email: 'jordan@example.com',
    user_has_voted: true,
    comments_count: 21,
    user_has_saved: true,
    comments: [
      {
        id: 'c15',
        author: 'Sophie Anderson',
        content: 'Thank you for being honest about the struggles! Most people only share their wins.',
        created_at: '2025-01-07T15:30:00Z',
        likes: 25,
        user_has_liked: true
      },
      {
        id: 'c16',
        author: 'Michael Brown',
        content: 'I made similar mistakes with courses. Wish I had seen this post 6 months ago!',
        created_at: '2025-01-07T16:45:00Z',
        likes: 12,
        user_has_liked: false
      }
    ]
  },
  {
    id: '10',
    auth_user_id: 'user10',
    title: 'Building AI Workflows for Small Business: Complete Tutorial',
    content: 'Small businesses can benefit hugely from AI, but most tutorials focus on enterprise solutions. I\'ll show you how to build practical AI workflows for businesses with 5-50 employees. Covers customer service automation, inventory management, social media scheduling, and basic data analysis. All using free or low-cost tools...',
    category: 'Tutorial',
    votes: 35,
    nft_id: '765432',
    created_at: '2025-01-06T10:30:00Z',
    updated_at: '2025-01-06T10:30:00Z',
    author_email: 'sam@example.com',
    user_has_voted: false,
    comments_count: 14,
    user_has_saved: true,
    comments: [
      {
        id: 'c17',
        author: 'Linda Chen',
        content: 'Finally, something for small businesses! Most AI content is aimed at big corporations.',
        created_at: '2025-01-06T11:45:00Z',
        likes: 20,
        user_has_liked: true
      },
      {
        id: 'c18',
        author: 'Paul Martinez',
        content: 'Implementing the customer service workflow next week. Thanks for the detailed guide!',
        created_at: '2025-01-06T13:20:00Z',
        likes: 8,
        user_has_liked: false
      }
    ]
  },
  {
    id: '11',
    auth_user_id: 'user11',
    title: 'Client Reactions to AI: From Skeptical to "How Did We Live Without This?"',
    content: 'As a consultant, I was nervous about telling clients I use AI tools. But their reactions have been incredible! From initial skepticism to requesting more AI-powered solutions, here\'s how I introduced AI to conservative clients and won them over. Includes scripts, case studies, and ROI metrics that convinced them...',
    category: 'Business',
    votes: 22,
    nft_id: '654987',
    created_at: '2025-01-05T09:45:00Z',
    updated_at: '2025-01-05T09:45:00Z',
    author_email: 'diana@example.com',
    user_has_voted: false,
    comments_count: 19,
    user_has_saved: false,
    comments: [
      {
        id: 'c19',
        author: 'Steven Lee',
        content: 'This is so helpful! I\'ve been hiding my AI usage from clients out of fear.',
        created_at: '2025-01-05T11:00:00Z',
        likes: 15,
        user_has_liked: true
      },
      {
        id: 'c20',
        author: 'Grace Williams',
        content: 'The ROI metrics section is gold. Exactly what I need to convince my traditional clients.',
        created_at: '2025-01-05T12:30:00Z',
        likes: 11,
        user_has_liked: false
      }
    ]
  },
  {
    id: '12',
    auth_user_id: 'user12',
    title: 'The Future of Remote Work: AI as Your Perfect Colleague',
    content: 'Working remotely with AI assistants has completely changed my perspective on collaboration. AI doesn\'t replace human colleagues, it enhances them. Here\'s my vision for the future of remote work and how AI will make distributed teams more effective than ever before...',
    category: 'Discussion',
    votes: 14,
    nft_id: '321654',
    created_at: '2025-01-04T16:00:00Z',
    updated_at: '2025-01-04T16:00:00Z',
    author_email: 'alex.future@example.com',
    user_has_voted: true,
    comments_count: 28,
    user_has_saved: false,
    comments: [
      {
        id: 'c21',
        author: 'Maya Patel',
        content: 'Love this perspective! AI as a colleague, not a competitor. That\'s the mindset shift we need.',
        created_at: '2025-01-04T17:15:00Z',
        likes: 22,
        user_has_liked: true
      },
      {
        id: 'c22',
        author: 'Chris Taylor',
        content: 'Interesting points about distributed teams. How do you handle AI hallucinations in team settings?',
        created_at: '2025-01-04T18:45:00Z',
        likes: 7,
        user_has_liked: false
      },
      {
        id: 'c23',
        author: 'Elena Rossi',
        content: 'The section about AI improving async communication really resonates with my experience.',
        created_at: '2025-01-04T19:30:00Z',
        likes: 13,
        user_has_liked: true
      }
    ]
  },
  {
    id: '13',
    auth_user_id: 'user13',
    title: 'How Our Team Went from AI-Resistant to AI-Champions in 3 Months',
    content: 'Leading change is hard, especially with AI. My team of 12 developers was initially resistant to AI coding tools. Three months later, they\'re champions who can\'t imagine working without them. Here\'s the exact strategy I used to win hearts and minds, including the mistakes that almost derailed everything...',
    category: 'Experience',
    votes: 38,
    nft_id: '159753',
    created_at: '2025-01-03T13:20:00Z',
    updated_at: '2025-01-03T13:20:00Z',
    author_email: 'morgan@example.com',
    user_has_voted: false,
    comments_count: 17,
    user_has_saved: true,
    comments: [
      {
        id: 'c24',
        author: 'Derek Johnson',
        content: 'As a team lead, this is incredibly valuable. What was the biggest resistance point?',
        created_at: '2025-01-03T14:30:00Z',
        likes: 14,
        user_has_liked: false
      },
      {
        id: 'c25',
        author: 'Aria Singh',
        content: 'The change management approach here is brilliant. Applicable beyond just AI adoption.',
        created_at: '2025-01-03T15:45:00Z',
        likes: 18,
        user_has_liked: true
      }
    ]
  },
  {
    id: '14',
    auth_user_id: 'user14',
    title: 'Advanced Prompt Engineering: Context Layering & Chain-of-Thought',
    content: 'Ready to level up your prompt engineering? Most tutorials cover basics, but here are advanced techniques that separate pros from beginners. Context layering, chain-of-thought reasoning, few-shot learning, and prompt chaining. Includes 50+ examples and templates for complex business scenarios...',
    category: 'Tutorial',
    votes: 56,
    nft_id: '456123',
    created_at: '2025-01-02T11:00:00Z',
    updated_at: '2025-01-02T11:00:00Z',
    author_email: 'expert.prompts@example.com',
    user_has_voted: true,
    comments_count: 31,
    user_has_saved: true,
    comments: [
      {
        id: 'c26',
        author: 'Lucas Rivera',
        content: 'This is next-level content! The context layering examples are incredibly detailed.',
        created_at: '2025-01-02T12:15:00Z',
        likes: 28,
        user_has_liked: true
      },
      {
        id: 'c27',
        author: 'Zoe Campbell',
        content: 'Finally, advanced prompt engineering content! Most tutorials are too basic.',
        created_at: '2025-01-02T13:30:00Z',
        likes: 22,
        user_has_liked: false
      },
      {
        id: 'c28',
        author: 'Hassan Ahmed',
        content: 'The chain-of-thought section improved my complex problem-solving prompts by 300%!',
        created_at: '2025-01-02T14:45:00Z',
        likes: 35,
        user_has_liked: true
      }
    ]
  }
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Contribution[]>(mockContributions)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({})
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({})
  const [sharingStates, setSharingStates] = useState<Record<string, boolean>>({})
  const [newPost, setNewPost] = useState<ContributionFormData>({
    title: '',
    content: '',
    image_url: '',
    category: 'Discussion'
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Contribution | null>(null)
  const [commentText, setCommentText] = useState('')
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  // Mock user for demo mode
  const mockUser = {
    id: 'demo-user-id',
    email: 'test@example.com'
  }

  const handleVote = async (contributionId: string) => {
    // Set voting state to show loading
    setVotingStates(prev => ({ ...prev, [contributionId]: true }))

    try {
      // Simulate voting with mock data
      await new Promise(resolve => setTimeout(resolve, 500))

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === contributionId) {
          const hasVoted = !post.user_has_voted
          const newVotes = hasVoted ? post.votes + 1 : post.votes - 1
          const updatedPost = {
            ...post,
            votes: newVotes,
            user_has_voted: hasVoted
          }

          // Check if post should get NFT (10+ votes)
          if (newVotes >= 10 && !post.nft_id && hasVoted) {
            updatedPost.nft_id = Math.floor(Math.random() * 1000000).toString()
            toast.success(
              `🎉 NFT Minted! ${post.author_email?.split('@')[0]} earned an Algorand NFT for reaching 10 votes!`,
              { duration: 6000 }
            )
          } else {
            toast.success(hasVoted ? 'Vote added!' : 'Vote removed!')
          }

          // CRITICAL FIX: Update selectedPost if it's the same post
          if (selectedPost && selectedPost.id === contributionId) {
            setSelectedPost(updatedPost)
          }

          return updatedPost
        }
        return post
      }))
    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to vote')
    } finally {
      // Clear voting state
      setVotingStates(prev => ({ ...prev, [contributionId]: false }))
    }
  }

  const handleSave = async (contributionId: string) => {
    setSavingStates(prev => ({ ...prev, [contributionId]: true }))

    try {
      // Simulate saving with mock data
      await new Promise(resolve => setTimeout(resolve, 300))

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === contributionId) {
          const hasSaved = !post.user_has_saved
          const updatedPost = {
            ...post,
            user_has_saved: hasSaved
          }

          // CRITICAL FIX: Update selectedPost if it's the same post
          if (selectedPost && selectedPost.id === contributionId) {
            setSelectedPost(updatedPost)
          }

          toast.success(hasSaved ? '📚 Post saved to your collection!' : 'Post removed from saved items')
          return updatedPost
        }
        return post
      }))

    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save post')
    } finally {
      setSavingStates(prev => ({ ...prev, [contributionId]: false }))
    }
  }

  const handleShare = async (post: Contribution) => {
    setSharingStates(prev => ({ ...prev, [post.id]: true }))

    try {
      // Create shareable URL (in real app, this would be the actual post URL)
      const shareUrl = `${window.location.origin}/community/post/${post.id}`
      const shareData = {
        title: post.title,
        text: `Check out this post: "${post.title}" by ${post.author_email?.split('@')[0] || 'Community Member'}`,
        url: shareUrl
      }

      // Try native Web Share API first
      if (navigator.share && 'canShare' in navigator && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success('Post shared successfully!')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Share error:', error)
      // Fallback to manual copy
      try {
        const shareUrl = `${window.location.origin}/community/post/${post.id}`
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
      } catch (clipboardError) {
        toast.error('Failed to share post')
      }
    } finally {
      setSharingStates(prev => ({ ...prev, [post.id]: false }))
    }
  }

  const handleSubmitPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in title and content')
      return
    }

    try {
      setSubmitting(true)
      
      // Simulate posting with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create new post
      const newContribution: Contribution = {
        id: Math.random().toString(36).substr(2, 9),
        auth_user_id: mockUser.id,
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        image_url: newPost.image_url?.trim() || undefined,
        category: newPost.category,
        votes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_email: mockUser.email,
        user_has_voted: false,
        comments: [],
        comments_count: 0,
        user_has_saved: false
      }

      // Add new post to local state
      setPosts(prev => [newContribution, ...prev])

      // Reset form
      setNewPost({ title: '', content: '', image_url: '', category: 'Discussion' })
      setIsDialogOpen(false)
      toast.success('Post shared successfully!')
      
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to share post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !selectedPost) {
      toast.error('Please enter a comment')
      return
    }

    try {
      setCommentingPostId(selectedPost.id)
      
      // Simulate comment posting
      await new Promise(resolve => setTimeout(resolve, 500))

      const newComment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        author: 'You',
        content: commentText.trim(),
        created_at: new Date().toISOString(),
        likes: 0,
        user_has_liked: false
      }

      // Update the selected post
      const updatedPost = {
        ...selectedPost,
        comments: [...(selectedPost.comments || []), newComment],
        comments_count: (selectedPost.comments_count || 0) + 1
      }
      setSelectedPost(updatedPost)

      // Update posts list
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? updatedPost
          : post
      ))

      setCommentText('')
      toast.success('Comment posted successfully!')
      
    } catch (error) {
      console.error('Comment error:', error)
      toast.error('Failed to post comment')
    } finally {
      setCommentingPostId(null)
    }
  }

  const handleCommentLike = async (commentId: string) => {
    if (!selectedPost) return

    try {
      // Simulate like/unlike
      await new Promise(resolve => setTimeout(resolve, 200))

      const updatedComments = selectedPost.comments?.map(comment => {
        if (comment.id === commentId) {
          const hasLiked = !comment.user_has_liked
          return {
            ...comment,
            likes: hasLiked ? comment.likes + 1 : comment.likes - 1,
            user_has_liked: hasLiked
          }
        }
        return comment
      }) || []

      const updatedPost = {
        ...selectedPost,
        comments: updatedComments
      }

      setSelectedPost(updatedPost)

      // Update posts list as well
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? updatedPost
          : post
      ))

    } catch (error) {
      console.error('Comment like error:', error)
    }
  }

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category.toLowerCase() === filter)

  const categories = ['all', 'tutorial', 'experience', 'business', 'discussion']

  const getAuthorInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-4 py-4 sm:py-8 flex-grow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Community Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your AI experiences, learn from others, and earn <strong>Algorand NFTs</strong> for valuable contributions with 10+ votes.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Coins className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Powered by Algorand Blockchain</span>
          </div>
        </motion.div>

        {/* Demo Mode Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-900/20">
            <CardContent className="text-center p-6">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Demo Mode Active
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Explore a vibrant community with 14 diverse posts! Vote, save, share, comment, and create your own content.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category)}
                className={filter === category ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Share Your Story</span>
                <span className="sm:hidden">Share</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Share Your AI Experience</DialogTitle>
                <DialogDescription>
                  Help others by sharing your AI journey, tutorials, or insights. Posts with 10+ votes earn Algorand NFTs!
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., How I Learned Prompt Engineering"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600"
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Discussion">Discussion</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Experience">Experience</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL (Optional)</Label>
                  <Input
                    id="image_url"
                    placeholder="https://example.com/image.jpg"
                    value={newPost.image_url}
                    onChange={(e) => setNewPost(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your story, insights, or tutorial..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[150px]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitPost} 
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      'Share Post'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Posts Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {getAuthorInitials(post.author_email || 'Unknown')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{post.author_email?.split('@')[0] || 'Unknown User'}</p>
                          {post.nft_id && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                              <Award className="w-3 h-3 mr-1" />
                              NFT #{post.nft_id}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-xl mt-4 cursor-pointer hover:text-blue-600 transition-colors" 
                           onClick={() => setSelectedPost(post)}>
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id)}
                        disabled={votingStates[post.id]}
                        className={`${post.user_has_voted ? 'text-green-600' : 'hover:text-green-600'}`}
                      >
                        {votingStates[post.id] ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ThumbsUp className={`w-4 h-4 mr-2 ${post.user_has_voted ? 'fill-current' : ''}`} />
                        )}
                        {post.votes}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:text-blue-600"
                        onClick={() => setSelectedPost(post)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments_count || 0}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:text-purple-600"
                        onClick={() => handleShare(post)}
                        disabled={sharingStates[post.id]}
                      >
                        {sharingStates[post.id] ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Share2 className="w-4 h-4 mr-2" />
                        )}
                        Share
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${post.user_has_saved ? 'text-blue-600' : 'hover:text-blue-600'}`}
                        onClick={() => handleSave(post.id)}
                        disabled={savingStates[post.id]}
                      >
                        {savingStates[post.id] ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : post.user_has_saved ? (
                          <Bookmark className="w-4 h-4 mr-2 fill-current" />
                        ) : (
                          <BookmarkPlus className="w-4 h-4 mr-2" />
                        )}
                        <span className="hidden sm:inline">{post.user_has_saved ? 'Saved' : 'Save'}</span>
                      </Button>
                    </div>
                    
                    {post.votes >= 10 && post.nft_id && (
                      <div className="flex items-center text-sm text-yellow-600">
                        <Sparkles className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Algorand NFT Earned!</span>
                        <span className="sm:hidden">NFT Earned!</span>
                      </div>
                    )}
                  </div>

                  {/* NFT Details */}
                  {post.nft_id && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                          Algorand NFT Minted
                        </span>
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">
                        <div>Asset ID: {post.nft_id}</div>
                        <div>Blockchain: Algorand Testnet</div>
                        <div>Type: Community Contributor NFT</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Be the first to share your AI experience!' 
                : `Be the first to share in the ${filter} category!`
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {getAuthorInitials(selectedPost.author_email || 'Unknown')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{selectedPost.author_email?.split('@')[0] || 'Unknown User'}</p>
                    {selectedPost.nft_id && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        NFT #{selectedPost.nft_id}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{formatTimeAgo(selectedPost.created_at)}</p>
                </div>
              </div>
              <DialogTitle className="text-xl">{selectedPost.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedPost.category}</Badge>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {selectedPost.image_url && (
                <img 
                  src={selectedPost.image_url} 
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(selectedPost.id)}
                  disabled={votingStates[selectedPost.id]}
                  className={`${selectedPost.user_has_voted ? 'text-green-600' : 'hover:text-green-600'}`}
                >
                  {votingStates[selectedPost.id] ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ThumbsUp className={`w-4 h-4 mr-2 ${selectedPost.user_has_voted ? 'fill-current' : ''}`} />
                  )}
                  {selectedPost.votes}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:text-purple-600"
                  onClick={() => handleShare(selectedPost)}
                  disabled={sharingStates[selectedPost.id]}
                >
                  {sharingStates[selectedPost.id] ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  Share
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${selectedPost.user_has_saved ? 'text-blue-600' : 'hover:text-blue-600'}`}
                  onClick={() => handleSave(selectedPost.id)}
                  disabled={savingStates[selectedPost.id]}
                >
                  {savingStates[selectedPost.id] ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : selectedPost.user_has_saved ? (
                    <Bookmark className="w-4 h-4 mr-2 fill-current" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                  )}
                  {selectedPost.user_has_saved ? 'Saved' : 'Save'}
                </Button>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comments ({selectedPost.comments?.length || 0})</h3>
                
                {/* Existing Comments */}
                <div className="space-y-4">
                  {selectedPost.comments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-xs">
                          {comment.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{comment.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommentLike(comment.id)}
                          className={`h-auto p-1 text-xs ${comment.user_has_liked ? 'text-red-500' : 'hover:text-red-500'}`}
                        >
                          <Heart className={`w-3 h-3 mr-1 ${comment.user_has_liked ? 'fill-current' : ''}`} />
                          {comment.likes}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                        YOU
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">Be respectful and constructive in your feedback</p>
                        <Button
                          onClick={handleSubmitComment}
                          disabled={!commentText.trim() || commentingPostId === selectedPost.id}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {commentingPostId === selectedPost.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Posting...
                            </>
                          ) : (
                            'Post Comment'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  )
}