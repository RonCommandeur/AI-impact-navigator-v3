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
import { Users, ArrowLeft, Plus, ThumbsUp, Award, Sparkles, MessageCircle, Share2, Loader2, User, LogOut, Coins } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import { 
  createContribution, 
  getContributions, 
  voteOnContribution, 
  checkNFTEligibility,
  awardNFT,
  type Contribution, 
  type ContributionFormData 
} from '@/lib/supabase-contributions'
import { formatAlgorandAddress } from '@/lib/algorand-nft'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function CommunityPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [posts, setPosts] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
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

  // Check authentication status on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      await loadPosts(session?.user?.id)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (event === 'SIGNED_IN' && session?.user) {
          toast.success('Successfully signed in!')
          await loadPosts(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          await loadPosts()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadPosts = async (authUserId?: string) => {
    try {
      const { data, error } = await getContributions(authUserId)
      
      if (error) {
        toast.error(error)
        return
      }

      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/community`
        }
      })
      
      if (error) {
        toast.error('Failed to sign in with Google')
        console.error('Auth error:', error)
      }
    } catch (error) {
      toast.error('An error occurred during sign in')
      console.error('Sign in error:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Failed to sign out')
      } else {
        toast.success('Signed out successfully')
      }
    } catch (error) {
      toast.error('An error occurred during sign out')
    }
  }

  const handleVote = async (contributionId: string) => {
    if (!user) {
      toast.error('Please sign in to vote')
      return
    }

    // Set voting state to show loading
    setVotingStates(prev => ({ ...prev, [contributionId]: true }))

    try {
      const { success, error, hasVoted, nftMinted, nftResult } = await voteOnContribution(user.id, contributionId)
      
      if (!success) {
        toast.error(error || 'Failed to vote')
        return
      }

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === contributionId) {
          const newVotes = hasVoted ? post.votes + 1 : post.votes - 1
          const updatedPost = {
            ...post,
            votes: newVotes,
            user_has_voted: hasVoted
          }

          // Update NFT status if minted
          if (nftMinted && nftResult?.assetId) {
            updatedPost.nft_id = nftResult.assetId.toString()
          }

          return updatedPost
        }
        return post
      }))
      
      // Show appropriate toast messages
      if (nftMinted && nftResult?.success) {
        const post = posts.find(p => p.id === contributionId)
        toast.success(
          `🎉 NFT Minted! ${post?.author_email?.split('@')[0]} earned an Algorand NFT (Asset ID: ${nftResult.assetId}) for reaching 10 votes!`,
          { duration: 6000 }
        )
      } else {
        toast.success(hasVoted ? 'Vote added!' : 'Vote removed!')
      }
    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to vote')
    } finally {
      // Clear voting state
      setVotingStates(prev => ({ ...prev, [contributionId]: false }))
    }
  }

  const handleSubmitPost = async () => {
    if (!user) {
      toast.error('Please sign in to share a post')
      return
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in title and content')
      return
    }

    try {
      setSubmitting(true)
      
      const { success, error, data } = await createContribution(user, newPost)

      if (!success) {
        toast.error(error || 'Failed to create post')
        return
      }

      // Add new post to local state
      if (data) {
        const enrichedPost: Contribution = {
          ...data,
          author_email: user.email || 'Unknown User',
          user_has_voted: false
        }
        setPosts(prev => [enrichedPost, ...prev])
      }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-green-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Loading Community
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Fetching the latest posts...
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Loader2 className="w-5 h-5 animate-spin text-green-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Almost ready</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md p-1">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-green-600" />
              <span className="font-semibold hidden sm:inline">Community Hub</span>
              <span className="font-semibold sm:hidden">Community</span>
            </div>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

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

        {/* Sign In Prompt for Non-Authenticated Users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-8"
          >
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
              <CardContent className="text-center p-6">
                <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Join the Community
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sign in to share your AI experiences, vote on posts, and earn Algorand NFTs.
                </p>
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

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

          {user && (
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
          )}
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
                        disabled={!user || votingStates[post.id]}
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

        {filteredPosts.length === 0 && !loading && (
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