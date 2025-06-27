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
import { Users, Plus, ThumbsUp, Award, Sparkles, MessageCircle, Share2, Loader2, Coins } from 'lucide-react'
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
    user_has_voted: false
  },
  {
    id: '2',
    auth_user_id: 'user2',
    title: 'Complete Guide to Prompt Engineering for Beginners',
    content: 'Prompt engineering is becoming an essential skill. In this guide, I\'ll walk you through the fundamentals, common mistakes to avoid, and advanced techniques that professionals use...',
    category: 'Tutorial',
    votes: 18,
    created_at: '2025-01-14T15:30:00Z',
    updated_at: '2025-01-14T15:30:00Z',
    author_email: 'mike@example.com',
    user_has_voted: true
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
    user_has_voted: false
  },
  {
    id: '4',
    auth_user_id: 'user4',
    title: 'Building an AI-Powered Side Business: My Journey',
    content: 'I started a content creation business using AI tools and it\'s now generating $5k/month. Here\'s exactly how I did it and what tools I used...',
    category: 'Business',
    votes: 31,
    created_at: '2025-01-12T14:20:00Z',
    updated_at: '2025-01-12T14:20:00Z',
    author_email: 'emma@example.com',
    user_has_voted: false
  }
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Contribution[]>(mockContributions)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({})
  const [newPost, setNewPost] = useState<ContributionFormData>({
    title: '',
    content: '',
    image_url: '',
    category: 'Discussion'
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
        user_has_voted: false
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
                All community features are unlocked for testing. Vote on posts and create your own content!
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
                  <CardTitle className="text-xl mt-4">{post.title}</CardTitle>
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
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
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
                      
                      <Button variant="ghost" size="sm" className="hover:text-blue-600">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="hover:text-purple-600">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
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

      <Footer />
    </div>
  )
}