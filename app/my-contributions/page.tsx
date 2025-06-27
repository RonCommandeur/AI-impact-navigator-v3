'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  ThumbsUp, 
  Award, 
  Sparkles, 
  MessageCircle, 
  Share2, 
  Loader2, 
  Coins,
  Calendar,
  TrendingUp,
  Eye,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

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

// Mock data for demo mode
const mockContributions: UserContribution[] = [
  {
    id: '1',
    title: 'How I Built My First AI App with Bolt.new',
    content: 'Starting with zero AI experience, I used Bolt.new to create an amazing application. Here\'s my complete journey, the challenges I faced, and what I learned along the way...',
    category: 'Tutorial',
    votes: 24,
    nft_id: '123456789',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Why AI Won\'t Replace Developers (But Will Make Us Better)',
    content: 'There\'s so much fear about AI replacing jobs, but my experience has been the opposite. AI tools have made me more productive and allowed me to focus on creative problem-solving...',
    category: 'Discussion',
    votes: 8,
    created_at: '2025-01-12T15:30:00Z',
    updated_at: '2025-01-12T15:30:00Z'
  },
  {
    id: '3',
    title: 'Building a Side Business with AI Tools',
    content: 'I started a content creation business using various AI tools and it\'s now generating steady income. Here\'s exactly how I did it and what tools I recommend...',
    category: 'Business',
    votes: 15,
    nft_id: '987654321',
    created_at: '2025-01-08T09:15:00Z',
    updated_at: '2025-01-08T09:15:00Z'
  }
]

const mockNFTs: UserNFT[] = [
  {
    assetId: 123456789,
    name: 'Community Contributor NFT',
    description: 'Earned for valuable community contribution',
    imageUrl: 'https://via.placeholder.com/200x200/6366f1/ffffff?text=NFT',
    metadata: {
      title: 'Community Contributor NFT: How I Built My First AI App with Bolt.new',
      contributionId: '1',
      votes: 24,
      category: 'Tutorial',
      dateEarned: '2025-01-15T12:00:00Z'
    }
  },
  {
    assetId: 987654321,
    name: 'Community Contributor NFT',
    description: 'Earned for valuable community contribution',
    imageUrl: 'https://via.placeholder.com/200x200/10b981/ffffff?text=NFT',
    metadata: {
      title: 'Community Contributor NFT: Building a Side Business with AI Tools',
      contributionId: '3',
      votes: 15,
      category: 'Business',
      dateEarned: '2025-01-08T14:00:00Z'
    }
  }
]

export default function MyContributionsPage() {
  const [contributions, setContributions] = useState<UserContribution[]>(mockContributions)
  const [nfts, setNfts] = useState<UserNFT[]>(mockNFTs)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'contributions' | 'nfts'>('contributions')

  // Mock user for demo mode
  const mockUser = {
    id: 'demo-user-id',
    email: 'test@example.com'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <Navigation />

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

        {/* Demo Mode Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-900/20">
            <CardContent className="text-center p-6">
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Demo Mode Active
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Viewing sample contribution history. Post in the community to see your real data here.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
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

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'contributions' ? (
            // Contributions Tab
            <div className="space-y-6">
              {contributions.map((contribution, index) => (
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
                              {getAuthorInitials(mockUser.email)}
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
              ))}
            </div>
          ) : (
            // NFTs Tab
            <div className="space-y-6">
              {nftCount > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map((nft, index) => (
                    <motion.div
                      key={nft.assetId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-4">
                          <div className="w-full h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                            <div className="text-center text-white">
                              <Award className="w-12 h-12 mx-auto mb-2" />
                              <div className="text-sm font-medium">NFT #{nft.assetId}</div>
                            </div>
                          </div>
                          <CardTitle className="text-lg">Community Contributor NFT</CardTitle>
                          <CardDescription>
                            Earned for "{nft.metadata.title.replace('Community Contributor NFT: ', '')}"
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Votes Received:</span>
                              <span className="font-medium">{nft.metadata.votes}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Category:</span>
                              <span className="font-medium">{nft.metadata.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Date Earned:</span>
                              <span className="font-medium">{formatDate(nft.metadata.dateEarned)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Asset ID:</span>
                              <span className="font-medium text-blue-600">{nft.assetId}</span>
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
              ) :  (
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
              )}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}