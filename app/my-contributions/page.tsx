'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  ArrowLeft, 
  ThumbsUp, 
  Award, 
  Sparkles, 
  MessageCircle, 
  Share2, 
  Loader2, 
  LogOut, 
  Coins,
  Calendar,
  TrendingUp,
  Eye,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Footer } from '@/components/footer'
import { getUserNFTs, formatAlgorandAddress } from '@/lib/algorand-nft'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserContribution {
  id: string
  title: string
  content: string
  image_url?: string
  category: string
  votes: number
  nft_id?: string
  created_at: string
  updated_at: string
}

interface UserNFT {
  assetId: number
  name: string
  description: string
  imageUrl: string
  metadata: {
    title: string
    contributionId: string
    votes: number
    category: string
    dateEarned: string
  }
}

export default function MyContributionsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [contributions, setContributions] = useState<UserContribution[]>([])
  const [nfts, setNfts] = useState<UserNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'contributions' | 'nfts'>('contributions')
  const [error, setError] = useState<string | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserData(session.user.id)
      } else {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (event === 'SIGNED_IN' && session?.user) {
          toast.success('Successfully signed in!')
          await loadUserData(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setContributions([])
          setNfts([])
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (authUserId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Load user contributions
      await loadContributions(authUserId)
      
      // Load user NFTs (mock data for demo)
      await loadNFTs(authUserId)

    } catch (error) {
      console.error('Error loading user data:', error)
      setError('Failed to load your data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadContributions = async (authUserId: string) => {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('auth_user_id', authUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading contributions:', error)
      throw new Error('Failed to load contributions')
    }

    setContributions(data || [])
  }

  const loadNFTs = async (authUserId: string) => {
    try {
      // In production, this would use the user's actual Algorand address
      const mockUserAddress = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
      const userNFTs = await getUserNFTs(mockUserAddress)
      setNfts(userNFTs)
    } catch (error) {
      console.error('Error loading NFTs:', error)
      // Don't throw here, NFTs are optional
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/my-contributions`
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAuthorInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  const totalVotes = contributions.reduce((sum, contrib) => sum + contrib.votes, 0)
  const nftCount = contributions.filter(contrib => contrib.nft_id).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Loading Your Contributions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Fetching your posts and NFTs...
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Almost ready</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
        <nav className="container mx-auto px-4 py-6">
          <Link href="/community" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Community</span>
          </Link>
        </nav>
        <div className="flex-grow flex items-center justify-center px-4">
          <Card className="max-w-md mx-auto border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardContent className="text-center p-8">
              <User className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign In Required
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please sign in to view your contributions and NFTs.
              </p>
              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-purple-600 hover:bg-purple-700"
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
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/community" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md p-1">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Community</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6 text-purple-600" />
              <span className="font-semibold hidden sm:inline">My Contributions</span>
              <span className="font-semibold sm:hidden">My Posts</span>
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
                  className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            My Contributions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your community posts, votes received, and Algorand NFTs earned for valuable contributions.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Posts</p>
                  <p className="text-2xl font-bold text-purple-600">{contributions.length}</p>
                </div>
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Votes</p>
                  <p className="text-2xl font-bold text-green-600">{totalVotes}</p>
                </div>
                <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">NFTs Earned</p>
                  <p className="text-2xl font-bold text-yellow-600">{nftCount}</p>
                </div>
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Votes</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {contributions.length > 0 ? Math.round(totalVotes / contributions.length) : 0}
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8"
        >
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'contributions' ? "default" : "outline"}
              onClick={() => setActiveTab('contributions')}
              className={activeTab === 'contributions' ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Posts ({contributions.length})
            </Button>
            <Button
              variant={activeTab === 'nfts' ? "default" : "outline"}
              onClick={() => setActiveTab('nfts')}
              className={activeTab === 'nfts' ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              <Award className="w-4 h-4 mr-2" />
              NFTs ({nftCount})
            </Button>
          </div>

          <Link href="/community">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create New Post</span>
              <span className="sm:hidden">New Post</span>
            </Button>
          </Link>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8"
          >
            <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="text-center p-6">
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <Button
                  onClick={() => user && loadUserData(user.id)}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Content */}
        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {activeTab === 'contributions' ? (
              // Contributions Tab
              <div className="space-y-6">
                {contributions.length === 0 ? (
                  <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
                    <CardContent className="text-center p-12">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Posts Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You haven't shared any posts in the community yet. Start sharing your AI experiences!
                      </p>
                      <Link href="/community">
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          <Plus className="w-5 h-5 mr-2" />
                          Share Your First Post
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  contributions.map((contribution, index) => (
                    <motion.div
                      key={contribution.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                                  {getAuthorInitials(user.email || 'You')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">You</p>
                                  {contribution.nft_id && (
                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                      <Award className="w-3 h-3 mr-1" />
                                      NFT #{contribution.nft_id}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{formatTimeAgo(contribution.created_at)}</p>
                              </div>
                            </div>
                            <Badge variant="outline">{contribution.category}</Badge>
                          </div>
                          <CardTitle className="text-xl mt-4">{contribution.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {contribution.image_url && (
                            <img 
                              src={contribution.image_url} 
                              alt={contribution.title}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            {contribution.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-green-600">
                                <ThumbsUp className="w-4 h-4 mr-2 fill-current" />
                                {contribution.votes}
                              </div>
                              
                              <Button variant="ghost" size="sm" className="hover:text-blue-600">
                                <Eye className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">View in Community</span>
                                <span className="sm:hidden">View</span>
                              </Button>
                              
                              <Button variant="ghost" size="sm" className="hover:text-purple-600">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                            </div>
                            
                            {contribution.votes >= 10 && contribution.nft_id && (
                              <div className="flex items-center text-sm text-yellow-600">
                                <Sparkles className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">NFT Earned!</span>
                                <span className="sm:hidden">NFT!</span>
                              </div>
                            )}
                          </div>

                          {/* NFT Details */}
                          {contribution.nft_id && (
                            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                              <div className="flex items-center gap-2 mb-2">
                                <Coins className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                                  Algorand NFT Minted
                                </span>
                              </div>
                              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                                <div>Asset ID: {contribution.nft_id}</div>
                                <div>Blockchain: Algorand Testnet</div>
                                <div>Type: Community Contributor NFT</div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              // NFTs Tab
              <div className="space-y-6">
                {nftCount === 0 ? (
                  <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 backdrop-blur-sm">
                    <CardContent className="text-center p-12">
                      <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No NFTs Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You haven't earned any NFTs yet. Create valuable posts that receive 10+ votes to earn Algorand NFTs!
                      </p>
                      <Link href="/community">
                        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                          <Sparkles className="w-5 h-5 mr-2" />
                          Start Contributing
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contributions
                      .filter(contrib => contrib.nft_id)
                      .map((contribution, index) => (
                        <motion.div
                          key={contribution.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-4">
                              <div className="w-full h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                                <div className="text-center text-white">
                                  <Award className="w-12 h-12 mx-auto mb-2" />
                                  <div className="text-sm font-medium">NFT #{contribution.nft_id}</div>
                                </div>
                              </div>
                              <CardTitle className="text-lg">Community Contributor NFT</CardTitle>
                              <CardDescription>
                                Earned for "{contribution.title}"
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Votes Received:</span>
                                  <span className="font-medium">{contribution.votes}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                                  <span className="font-medium">{contribution.category}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Date Earned:</span>
                                  <span className="font-medium">{formatDate(contribution.created_at)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Asset ID:</span>
                                  <span className="font-medium text-blue-600">{contribution.nft_id}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Coins className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    Algorand Blockchain
                                  </span>
                                </div>
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  Verified on Algorand Testnet
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}