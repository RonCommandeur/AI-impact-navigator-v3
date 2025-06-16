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
import { Users, ArrowLeft, Plus, ThumbsUp, Award, Sparkles, MessageCircle, Share2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'

interface Post {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  votes: number
  hasVoted: boolean
  hasNFT: boolean
  createdAt: string
  category: string
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'How I Used Bolt.new to Build My First AI App',
      content: 'Just completed my first AI-powered application using Bolt.new! The no-code approach made it incredibly accessible. Here\'s what I learned and the challenges I faced...',
      author: 'Sam Chen',
      authorAvatar: 'SC',
      votes: 24,
      hasVoted: false,
      hasNFT: true,
      createdAt: '2 hours ago',
      category: 'Tutorial'
    },
    {
      id: '2',
      title: 'AI Impact on Graphic Design: My Experience',
      content: 'As a graphic designer, I was initially worried about AI tools like DALL-E and Midjourney. But after 6 months of adapting, here\'s how I\'ve turned AI into my creative partner...',
      author: 'Fiona Martinez',
      authorAvatar: 'FM',
      votes: 18,
      hasVoted: true,
      hasNFT: true,
      createdAt: '5 hours ago',
      category: 'Experience'
    },
    {
      id: '3',
      title: 'Small Business AI Tools That Actually Work',
      content: 'Running a small cafe, I was skeptical about AI. But these 5 tools have genuinely improved my marketing and customer service. Here\'s my honest review...',
      author: 'Bella Rodriguez',
      authorAvatar: 'BR',
      votes: 15,
      hasVoted: false,
      hasNFT: true,
      createdAt: '1 day ago',
      category: 'Business'
    },
    {
      id: '4',
      title: 'Learning Prompt Engineering: A Beginner\'s Guide',
      content: 'Prompt engineering seemed intimidating at first, but it\'s become one of my most valuable skills. Here\'s a step-by-step guide for beginners...',
      author: 'Alex Kim',
      authorAvatar: 'AK',
      votes: 12,
      hasVoted: false,
      hasNFT: false,
      createdAt: '2 days ago',
      category: 'Tutorial'
    },
    {
      id: '5',
      title: 'AI Ethics in Community Building',
      content: 'As we build AI-powered communities, we need to consider the ethical implications. Here are some thoughts on responsible AI development...',
      author: 'Jordan Taylor',
      authorAvatar: 'JT',
      votes: 8,
      hasVoted: false,
      hasNFT: false,
      createdAt: '3 days ago',
      category: 'Discussion'
    }
  ])

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Discussion'
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const handleVote = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId && !post.hasVoted) {
        const newVotes = post.votes + 1
        const hasNFT = newVotes >= 10
        
        if (hasNFT && !post.hasNFT) {
          toast.success(`🎉 ${post.author} earned an NFT for reaching 10 votes!`)
        }
        
        return {
          ...post,
          votes: newVotes,
          hasVoted: true,
          hasNFT: hasNFT
        }
      }
      return post
    }))
    
    toast.success('Vote recorded!')
  }

  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in all fields')
      return
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: 'You',
      authorAvatar: 'YU',
      votes: 0,
      hasVoted: false,
      hasNFT: false,
      createdAt: 'Just now',
      category: newPost.category
    }

    setPosts(prev => [post, ...prev])
    setNewPost({ title: '', content: '', category: 'Discussion' })
    setIsDialogOpen(false)
    toast.success('Post shared successfully!')
  }

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category.toLowerCase() === filter)

  const categories = ['all', 'tutorial', 'experience', 'business', 'discussion']

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-green-600" />
            <span className="font-semibold">Community Hub</span>
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
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Community Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your AI experiences, learn from others, and earn blockchain-verified NFTs for valuable contributions.
          </p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                Share Your Story
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Share Your AI Experience</DialogTitle>
                <DialogDescription>
                  Help others by sharing your AI journey, tutorials, or insights. Posts with 10+ votes earn NFTs!
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
                    className="w-full p-2 border rounded-md"
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
                  <Button onClick={handleSubmitPost} className="bg-green-600 hover:bg-green-700">
                    Share Post
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
          transition={{ delay: 0.2 }}
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
                          {post.authorAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{post.author}</p>
                          {post.hasNFT && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                              <Award className="w-3 h-3 mr-1" />
                              NFT
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{post.createdAt}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id)}
                        disabled={post.hasVoted}
                        className={`${post.hasVoted ? 'text-green-600' : 'hover:text-green-600'}`}
                      >
                        <ThumbsUp className={`w-4 h-4 mr-2 ${post.hasVoted ? 'fill-current' : ''}`} />
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
                    
                    {post.votes >= 10 && (
                      <div className="flex items-center text-sm text-yellow-600">
                        <Sparkles className="w-4 h-4 mr-1" />
                        NFT Earned!
                      </div>
                    )}
                  </div>
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
            <p className="text-gray-500">Be the first to share in this category!</p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}