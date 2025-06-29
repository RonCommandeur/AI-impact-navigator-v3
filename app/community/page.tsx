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
import { Separator } from '@/components/ui/separator'
import { Users, Plus, ThumbsUp, Award, Sparkles, MessageCircle, Share2, Loader2, Coins, Eye, Clock, TrendingUp, Bookmark, MoreHorizontal, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

// Enhanced mock data with much more interesting and diverse content
interface Contribution {
  id: string
  auth_user_id: string
  title: string
  content: string
  excerpt: string
  image_url?: string
  category: string
  votes: number
  comments: number
  views: number
  nft_id?: string
  created_at: string
  updated_at: string
  author_email?: string
  author_name?: string
  author_avatar?: string
  user_has_voted?: boolean
  is_trending?: boolean
  reading_time?: number
  tags?: string[]
}

interface Comment {
  id: string
  author_name: string
  author_avatar?: string
  content: string
  created_at: string
  votes: number
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
    title: 'How I Built My First AI App with Bolt.new in 24 Hours',
    excerpt: 'From zero coding experience to a fully functional AI-powered productivity app using Bolt.new. Here\'s my complete journey...',
    content: `I never thought I'd be able to build a real AI application, but Bolt.new changed everything. As someone with a marketing background and zero coding experience, I was skeptical about all the "no-code" platforms out there. But when I discovered Bolt.new's AI-powered development environment, I decided to give it a shot.

**The Challenge:**
My company needed a tool to automatically categorize and prioritize customer feedback from multiple channels. We were drowning in emails, social media comments, and survey responses.

**Hour 1-4: Getting Started**
I started by simply describing what I wanted to build in plain English. Bolt.new's AI immediately understood and began generating the initial structure. The interface was intuitive, and I could see the code being written in real-time.

**Hour 5-12: Building Core Features**
The AI helped me integrate with our existing tools:
- Connected to our Gmail API for customer emails
- Set up sentiment analysis using OpenAI's API
- Created a simple dashboard for viewing categorized feedback

**Hour 13-20: Refining and Testing**
This is where Bolt.new really shined. When I encountered bugs or wanted to add features, I could just describe the problem in natural language, and the AI would suggest and implement fixes.

**Hour 21-24: Deployment and Polish**
Deploying was surprisingly simple. Bolt.new handled all the configuration, and within minutes, our team was using the app.

**Results:**
- Reduced feedback processing time by 80%
- Improved customer response time from days to hours
- Saved our team 15+ hours per week

**Key Learnings:**
1. Be specific about what you want to achieve
2. Start simple and iterate
3. Don't be afraid to ask the AI to explain concepts
4. Test with real data early and often

The app now processes over 1,000 pieces of feedback per week automatically. My CEO was so impressed that I'm now leading our AI adoption initiative across all departments.

**Tools Used:**
- Bolt.new (obviously!)
- OpenAI API for sentiment analysis
- Gmail API for email integration
- Supabase for data storage

If you're on the fence about trying Bolt.new, just do it. The worst that can happen is you learn something new. The best case? You might just revolutionize how your company works.`,
    category: 'Tutorial',
    votes: 47,
    comments: 23,
    views: 342,
    nft_id: '123456789',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    author_email: 'sarah@example.com',
    author_name: 'Sarah Chen',
    author_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    user_has_voted: false,
    is_trending: true,
    reading_time: 8,
    tags: ['bolt.new', 'ai', 'no-code', 'productivity', 'automation']
  },
  {
    id: '2',
    auth_user_id: 'user2',
    title: 'The Complete Guide to Prompt Engineering for Non-Techies',
    excerpt: 'Demystifying prompt engineering with practical examples and techniques that anyone can use to get better results from AI...',
    content: `Prompt engineering isn't just for developers. As someone who transitioned from HR to AI consulting, I've learned that good prompting is about clear communication, not technical jargon.

**What is Prompt Engineering?**
Think of it as giving really good instructions to a very smart assistant who takes everything literally.

**The CLEAR Framework:**
- **C**ontext: Set the scene
- **L**ength: Specify desired output length
- **E**xamples: Show what you want
- **A**udience: Define who it's for
- **R**ole: Tell the AI what role to play

**Real Examples:**

*Bad Prompt:*
"Write about marketing"

*Good Prompt:*
"As a senior marketing consultant, write a 500-word blog post explaining the top 3 digital marketing trends for 2025. Include specific examples and actionable tips for small business owners."

**Advanced Techniques:**

1. **Chain of Thought Prompting**
"Let's think step by step..." - This simple phrase dramatically improves reasoning.

2. **Role Playing**
"You are a data scientist with 10 years of experience..." - Setting context helps AI provide more relevant responses.

3. **Few-Shot Learning**
Provide 2-3 examples before asking for output.

**Common Mistakes:**
- Being too vague
- Not specifying format
- Forgetting to mention constraints
- Not iterating on prompts

**My Favorite Prompts:**

For brainstorming:
"Generate 10 creative solutions to [problem]. For each solution, provide: 1) Brief description 2) Pros 3) Cons 4) Implementation difficulty (1-10)"

For analysis:
"Analyze this [data/text/situation] from three perspectives: optimistic, pessimistic, and realistic. Present findings in a structured format."

For content creation:
"Create content for [audience] about [topic]. Tone: [professional/casual/friendly]. Length: [X words]. Include: [specific elements]."

**Results I've Achieved:**
- Reduced content creation time by 70%
- Improved client presentation quality dramatically
- Generated over $50k in new business using AI-enhanced proposals

The key is practice. Start with simple prompts and gradually add complexity. Save your best prompts in a personal library.`,
    category: 'Tutorial',
    votes: 38,
    comments: 19,
    views: 289,
    created_at: '2025-01-14T15:30:00Z',
    updated_at: '2025-01-14T15:30:00Z',
    author_email: 'mike@example.com',
    author_name: 'Mike Rodriguez',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    user_has_voted: true,
    reading_time: 6,
    tags: ['prompt-engineering', 'ai', 'productivity', 'communication']
  },
  {
    id: '3',
    auth_user_id: 'user3',
    title: 'Why I\'m Not Afraid of AI Taking My Job as a Designer',
    excerpt: 'There\'s a lot of fear around AI replacing creative jobs, but my experience has been the opposite. Here\'s how AI made me a better designer...',
    content: `Six months ago, I was terrified that AI would make me obsolete. As a graphic designer with 8 years of experience, I watched in horror as DALL-E and Midjourney started producing images that rivaled human creativity. But instead of fighting it, I decided to embrace it.

**The Mindset Shift**

I realized AI isn't here to replace designers—it's here to elevate us. Just like how Photoshop didn't eliminate the need for artistic vision, AI tools amplify our creativity rather than replace it.

**How AI Enhanced My Work:**

**1. Rapid Ideation**
I now use Midjourney for initial concept exploration. In 30 minutes, I can generate 100+ visual directions that would have taken me weeks to sketch by hand.

**2. Client Presentations**
Instead of spending days creating mockups, I create AI-generated concepts in hours. Clients love seeing multiple directions quickly, and I can focus on the ones that resonate.

**3. Overcoming Creative Blocks**
When I'm stuck, I feed my brief into AI and see what unexpected directions emerge. It's like having an infinitely creative brainstorming partner.

**Real Project Example:**

*Client:* Sustainable fashion brand
*Challenge:* Create a logo that feels organic yet modern
*Old Process:* 2 weeks of sketching, research, and iterations
*New Process:* 
- Day 1: Generate 50+ AI concepts with prompts like "organic minimalist logo, flowing lines, earth tones"
- Day 2: Refine 5 promising directions manually
- Day 3: Present to client with 3 polished options

**What AI Can't Do:**
- Understand brand strategy and positioning
- Navigate client relationships and feedback
- Make aesthetic decisions based on business goals
- Iterate based on cultural context and market insights
- Present and sell ideas effectively

**My New Role:**
I've evolved from "person who makes things pretty" to "creative strategist who leverages AI." I'm now:
- AI prompt engineer for visual content
- Creative director guiding AI outputs
- Brand strategist connecting visuals to business goals
- Client relationship manager and creative consultant

**Financial Impact:**
- Increased project throughput by 200%
- Raised my rates by 40% (positioning as AI-augmented designer)
- Expanded services to include AI creative consulting
- Reduced time on mundane tasks by 60%

**Advice for Fellow Designers:**

1. **Start Experimenting Today** - Don't wait for AI to get better; get better at using AI
2. **Focus on Strategy** - Develop skills in brand strategy, user psychology, and business thinking
3. **Become Prompt-Fluent** - Learn to communicate effectively with AI tools
4. **Embrace the Change** - Position yourself as an early adopter, not a resistant traditionalist

**The Future I See:**
The designers who will thrive are those who become AI-human collaboration experts. We're moving from a world where technical execution was our differentiator to one where creative vision and strategic thinking are our superpowers.

AI has made me a better designer, not a redundant one. It handles the grunt work so I can focus on what humans do best: understand people, tell stories, and create meaningful connections through design.`,
    category: 'Discussion',
    votes: 29,
    comments: 15,
    views: 198,
    nft_id: '987654321',
    created_at: '2025-01-13T09:15:00Z',
    updated_at: '2025-01-13T09:15:00Z',
    author_email: 'alex@example.com',
    author_name: 'Alex Kim',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    user_has_voted: false,
    is_trending: true,
    reading_time: 7,
    tags: ['design', 'career', 'mindset', 'ai-adoption']
  },
  {
    id: '4',
    auth_user_id: 'user4',
    title: 'From Zero to $5K/Month: Building an AI Content Business',
    excerpt: 'How I built a profitable AI-powered content creation business with no technical background. Complete breakdown of tools, processes, and revenue...',
    content: `Three months ago, I was a struggling freelance writer making $800/month. Today, I run a content creation business generating $5K+ monthly using AI tools. Here's exactly how I did it.

**The Lightbulb Moment**
I realized that while AI can create content, most business owners don't know how to use it effectively. There's a huge opportunity in being the bridge between AI capabilities and business needs.

**My Service Stack:**

**Content Creation ($2,500/month)**
- Blog posts enhanced with AI research
- Social media content calendars
- Email marketing sequences
- Product descriptions

**AI Consulting ($1,800/month)**
- Teaching businesses to use AI tools
- Setting up AI workflows
- Prompt engineering training
- AI strategy development

**Done-for-You AI Implementation ($700/month)**
- Custom GPT creation
- Automation setup
- Process optimization

**My Tools & Costs:**
- ChatGPT Plus: $20/month
- Claude Pro: $20/month
- Jasper AI: $49/month
- Canva Pro: $15/month
- Notion: $10/month
- Buffer: $6/month
Total: $120/month

**The Process That Works:**

**1. Client Onboarding (Week 1)**
- Deep dive into their brand voice
- Analyze existing content
- Map out content goals and KPIs
- Create brand guidelines document

**2. AI Training (Week 2)**
- Develop custom prompts for their industry
- Create content templates
- Set up workflow automation
- Train their team on AI tools

**3. Content Production (Ongoing)**
- Generate 16 blog posts per month
- Create 60+ social media posts
- Develop email sequences
- Produce case studies and whitepapers

**My Secret Sauce: The 3-Layer Approach**

**Layer 1: AI Generation**
Use AI to create the first draft and generate ideas

**Layer 2: Human Enhancement**
Add industry expertise, personality, and strategic thinking

**Layer 3: Brand Alignment**
Ensure everything matches brand voice and business goals

**Client Results:**
- TechStart Inc: 300% increase in blog traffic
- Local Gym Chain: 150% boost in social engagement
- SaaS Company: 40% improvement in email open rates

**Pricing Strategy:**
- Started at $500/month per client
- Now charging $800-1,500/month
- Premium packages up to $3,000/month
- Hourly consulting at $75/hour

**Biggest Lessons:**

1. **Don't Compete on Price** - Position as AI specialist, not cheap writer
2. **Focus on Results** - Track metrics that matter to businesses
3. **Educate Your Market** - Most businesses don't understand AI capabilities
4. **Build Systems** - Create repeatable processes for everything
5. **Never Stop Learning** - AI tools evolve rapidly

**Common Mistakes I Made:**
- Underselling myself initially
- Not tracking client ROI
- Trying to serve everyone
- Not systemizing processes early

**What's Next:**
- Launching an AI writing course ($10K goal)
- Building a content creation agency
- Developing proprietary AI tools
- Speaking at marketing conferences

**The Opportunity Is NOW**
We're in the early days of the AI revolution. Businesses need help navigating this transition. If you position yourself as the guide, you can build a very profitable business.

The key is not to replace human creativity with AI, but to amplify it. AI handles the heavy lifting; you provide the strategy, creativity, and business insight that turns content into results.

Want to get started? Pick one AI tool, master it completely, then find businesses that need help with what that tool does best. The money is in implementation, not just knowledge.`,
    category: 'Business',
    votes: 52,
    comments: 31,
    views: 456,
    created_at: '2025-01-12T14:20:00Z',
    updated_at: '2025-01-12T14:20:00Z',
    author_email: 'emma@example.com',
    author_name: 'Emma Rodriguez',
    author_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    user_has_voted: false,
    is_trending: true,
    reading_time: 9,
    tags: ['business', 'entrepreneurship', 'content-creation', 'ai-consulting']
  },
  {
    id: '5',
    auth_user_id: 'user5',
    title: 'The Dark Side of AI: What They Don\'t Tell You',
    excerpt: 'After a year of AI consulting, here are the uncomfortable truths about AI adoption that nobody talks about...',
    content: `Everyone talks about AI's amazing potential, but after helping 50+ companies implement AI solutions, I've seen the dark side that no one wants to discuss.

**The Uncomfortable Truths:**

**1. Most AI Projects Fail Silently**
- 70% of AI implementations never see production
- Companies spend thousands on tools they abandon after 3 months
- Executive enthusiasm rarely translates to user adoption

**2. The Skills Gap Is Massive**
Even "AI-native" companies struggle with:
- Prompt engineering requires real skill
- Data quality issues kill most projects
- Change management is harder than the technology

**3. AI Creates New Forms of Inequality**
- Early adopters gain massive advantages
- Traditional workers are left behind
- Small businesses can't compete with AI-powered giants

**4. The Hidden Costs Add Up Fast**
- API costs can spiral out of control
- Training and implementation take months
- Maintenance and updates are ongoing expenses

**5. Quality Control Is Nearly Impossible**
- AI outputs are inconsistent
- Fact-checking becomes a full-time job
- Brand risk increases dramatically

**Real Examples of AI Gone Wrong:**

**Case 1: E-commerce Disaster**
Client implemented AI for product descriptions. AI created descriptions for products that didn't exist, invented features, and occasionally wrote in different languages mid-sentence. Cost: $15K and 3 months of cleanup.

**Case 2: Customer Service Nightmare**
AI chatbot started giving medical advice for a pet supply company. Legal team had to intervene. The bot was trained on too broad a dataset and couldn't stay in its lane.

**Case 3: Content Marketing Catastrophe**
AI-generated blog posts were getting published without review. One post accidentally plagiarized a competitor's content word-for-word. SEO rankings tanked, and they faced potential legal action.

**The Psychology Problems:**

**Over-Reliance Syndrome**
Teams stop thinking critically because "the AI said so." I've seen marketing teams approve obviously wrong campaigns because they trusted the AI output blindly.

**Skill Atrophy**
When AI does the work, humans lose the ability to do it manually. This creates dangerous dependencies.

**False Confidence**
AI tools give a feeling of expertise without actual understanding. People make bigger decisions with less knowledge.

**What Actually Works:**

**Start Small and Specific**
- Pick one very specific use case
- Test extensively before scaling
- Keep humans in the loop

**Invest in Training**
- Prompt engineering is a real skill
- Data literacy is essential
- Change management matters more than technology

**Plan for Failure**
- Always have a backup plan
- Set clear boundaries for AI use
- Regular audits and reviews

**The Uncomfortable Question:**
Are we moving too fast? The pressure to adopt AI is intense, but rushed implementations often do more harm than good.

**My Advice for Leaders:**

1. **Be Skeptical of AI Vendors** - Most oversell and under-deliver
2. **Invest in Your People** - Technology is easy; behavior change is hard
3. **Start with Workflows, Not Tools** - Understand your process before adding AI
4. **Measure Everything** - Track both benefits and risks
5. **Plan for the Long Term** - AI adoption is a journey, not a destination

**The Future I'm Worried About:**
A world where we've automated away human judgment, creativity, and critical thinking. AI should augment human capability, not replace human wisdom.

Yes, AI is powerful. Yes, it can transform businesses. But it's not magic, and it's not without risks. The companies that succeed will be those that respect both the potential and the pitfalls.

The real competitive advantage isn't in having the best AI tools—it's in having the best judgment about when and how to use them.`,
    category: 'Discussion',
    votes: 43,
    comments: 28,
    views: 367,
    created_at: '2025-01-11T16:45:00Z',
    updated_at: '2025-01-11T16:45:00Z',
    author_email: 'david@example.com',
    author_name: 'David Thompson',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    user_has_voted: false,
    reading_time: 8,
    tags: ['ai-risks', 'implementation', 'business-strategy', 'reality-check']
  },
  {
    id: '6',
    auth_user_id: 'user6',
    title: 'AI Tools That Actually Save Me 10+ Hours Per Week',
    excerpt: 'Cutting through the hype to share the AI tools that genuinely transform my daily workflow. Real usage stats and honest reviews...',
    content: `I've tested 200+ AI tools over the past year. Most are hype. Here are the 8 tools that actually save me significant time, with real usage data.

**My Setup & Stats:**
- Role: Marketing Consultant
- Team Size: 3 people
- Time Saved: 47 hours/week across the team
- ROI: 340% in first 6 months

**Tier 1: Game Changers (Use Daily)**

**1. Claude (Anthropic) - 8 hours/week saved**
*Cost: $20/month*

What I use it for:
- Strategy documents (condensing 4-hour tasks to 30 minutes)
- Client proposal writing
- Research synthesis
- Email drafting

Honest Review: Better than ChatGPT for long-form content and analysis. The reasoning is more structured, and it handles complex business contexts better.

Real Example: Client needed a 50-page marketing strategy. Claude helped me create the framework and first draft in 3 hours vs. my usual 2 days.

**2. Notion AI - 6 hours/week saved**
*Cost: $10/month*

What I use it for:
- Meeting notes summarization
- Action item extraction
- Document optimization
- Project status updates

Game Changer Feature: The "continue writing" function for reports. I write an outline, and it expands each section intelligently.

**3. Loom AI Summaries - 4 hours/week saved**
*Cost: $8/month*

What I use it for:
- Client meeting summaries
- Training video insights
- Quick briefings for team members

Real Impact: I send 2-minute AI summaries instead of 20-minute recordings. Clients love it.

**Tier 2: Solid Performers (Use Weekly)**

**4. Midjourney - 3 hours/week saved**
*Cost: $30/month*

What I use it for:
- Client presentation visuals
- Social media graphics
- Concept development

Tip: The key is learning advanced prompting. "Professional marketing slide background, clean minimalist design, corporate blue --ar 16:9 --v 6" gets much better results than "business background."

**5. Calendly AI Scheduling - 2 hours/week saved**
*Cost: $12/month*

What I use it for:
- Automatic meeting preparation
- Follow-up email generation
- Schedule optimization

Underrated Feature: AI suggests optimal meeting times based on my productivity patterns.

**6. Grammarly Business - 2 hours/week saved**
*Cost: $15/month*

What I use it for:
- Client communication polish
- Proposal enhancement
- Brand voice consistency

Why It's Essential: Tone detection saves me from sending emails that could be misinterpreted.

**Tier 3: Specific Use Cases (Use Monthly)**

**7. Speechify - 1.5 hours/week saved**
*Cost: $12/month*

What I use it for:
- Industry report consumption
- Article research while commuting
- Learning new topics

Game Changer: I "read" 3x more content by listening during dead time.

**8. Zapier AI - 1 hour/week saved**
*Cost: $20/month*

What I use it for:
- Workflow automation
- Data synchronization
- Repetitive task elimination

Best Automation: New client signup → create project in Notion → send welcome email → schedule kickoff call. All automatic.

**Tools I Tested But Don't Use:**

❌ **Jasper AI** - Too generic, lacks business context
❌ **Copy.ai** - Good for basic copy, not strategic content
❌ **Otter.ai** - Transcription is good, but summaries are weak
❌ **Tome** - Pretty presentations, but not efficient for my workflow

**My Implementation Strategy:**

**Week 1: Audit Your Time**
Track everything for one week. Identify repetitive tasks taking 30+ minutes.

**Week 2: Pick One Tool**
Start with the biggest time drain. For most people, it's writing.

**Week 3: Learn Properly**
Don't just start using it—learn advanced features and prompting.

**Week 4: Measure Results**
Track time saved and quality improvements.

**Common Mistakes:**
1. Trying too many tools at once
2. Not learning proper prompting techniques
3. Using AI for tasks humans do better
4. Not measuring actual time savings

**ROI Breakdown:**
- Tool costs: $127/month
- Time saved: 47 hours/week
- My hourly rate: $150
- Monthly value: $30,450
- ROI: 23,937%

**What's Coming Next:**
I'm testing multimodal AI for video content creation and voice AI for client calls. The landscape changes fast.

**Bottom Line:**
Don't chase shiny new tools. Find ones that solve real problems, learn them deeply, and measure results ruthlessly. The goal isn't to use AI everywhere—it's to use AI where it makes the biggest impact.

The future belongs to people who can effectively collaborate with AI, not those who can simply use AI tools.`,
    category: 'Experience',
    votes: 61,
    comments: 34,
    views: 523,
    created_at: '2025-01-10T11:30:00Z',
    updated_at: '2025-01-10T11:30:00Z',
    author_email: 'lisa@example.com',
    author_name: 'Lisa Wang',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    user_has_voted: false,
    reading_time: 10,
    tags: ['tools', 'productivity', 'reviews', 'workflow']
  }
]

const mockComments: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      author_name: 'Jake Miller',
      author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      content: 'This is incredible! I\'ve been hesitant to try Bolt.new but your post convinced me. Starting my first project tonight!',
      created_at: '2025-01-15T11:30:00Z',
      votes: 8
    },
    {
      id: 'c2',
      author_name: 'Maria Santos',
      content: 'The Gmail integration part is genius. How did you handle the authentication flow? Did Bolt.new walk you through the OAuth setup?',
      created_at: '2025-01-15T13:15:00Z',
      votes: 5
    },
    {
      id: 'c3',
      author_name: 'CodeNewbie',
      content: 'As someone who\'s struggled with traditional coding bootcamps, this gives me hope. The step-by-step breakdown is super helpful!',
      created_at: '2025-01-15T15:45:00Z',
      votes: 12
    }
  ],
  '2': [
    {
      id: 'c4',
      author_name: 'Prof. DataScience',
      author_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face',
      content: 'Excellent framework! I\'m sharing this with my students. The CLEAR method is much better than the scattered advice out there.',
      created_at: '2025-01-14T16:20:00Z',
      votes: 15
    },
    {
      id: 'c5',
      author_name: 'StartupFounder',
      content: 'The chain of thought prompting tip alone saved me hours. My investor pitches are so much better now.',
      created_at: '2025-01-14T18:10:00Z',
      votes: 9
    }
  ]
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Contribution[]>(mockContributions)
  const [selectedPost, setSelectedPost] = useState<Contribution | null>(null)
  const [postComments, setPostComments] = useState<Comment[]>([])
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
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('trending')

  // Mock user for demo mode
  const mockUser = {
    id: 'demo-user-id',
    email: 'test@example.com'
  }

  const handleVote = async (contributionId: string) => {
    setVotingStates(prev => ({ ...prev, [contributionId]: true }))

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setPosts(prev => prev.map(post => {
        if (post.id === contributionId) {
          const hasVoted = !post.user_has_voted
          const newVotes = hasVoted ? post.votes + 1 : post.votes - 1
          const updatedPost = {
            ...post,
            votes: newVotes,
            user_has_voted: hasVoted
          }

          if (newVotes >= 10 && !post.nft_id && hasVoted) {
            updatedPost.nft_id = Math.floor(Math.random() * 1000000).toString()
            toast.success(
              `🎉 NFT Minted! ${post.author_name} earned an Algorand NFT for reaching 10 votes!`,
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
      setVotingStates(prev => ({ ...prev, [contributionId]: false }))
    }
  }

  const handlePostClick = (post: Contribution) => {
    setSelectedPost(post)
    setPostComments(mockComments[post.id] || [])
    // Simulate view count increase
    setPosts(prev => prev.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    ))
    setIsPostModalOpen(true)
  }

  const handleSubmitPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in title and content')
      return
    }

    try {
      setSubmitting(true)
      
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newContribution: Contribution = {
        id: Math.random().toString(36).substr(2, 9),
        auth_user_id: mockUser.id,
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        excerpt: newPost.content.trim().substring(0, 150) + '...',
        image_url: newPost.image_url?.trim() || undefined,
        category: newPost.category,
        votes: 0,
        comments: 0,
        views: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_email: mockUser.email,
        author_name: 'You',
        user_has_voted: false,
        reading_time: Math.ceil(newPost.content.trim().split(' ').length / 200)
      }

      setPosts(prev => [newContribution, ...prev])

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

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.is_trending ? 1000 : 0) + b.votes - ((a.is_trending ? 1000 : 0) + a.votes)
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'popular':
        return b.votes - a.votes
      case 'discussed':
        return b.comments - a.comments
      default:
        return 0
    }
  })

  const categories = ['all', 'tutorial', 'experience', 'business', 'discussion']
  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Voted' },
    { value: 'discussed', label: 'Most Discussed' }
  ]

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
                Interactive Demo Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Click on any post to read the full content! Vote, comment, and create your own posts.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Sort */}
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

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

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
          </div>
        </motion.div>

        {/* Posts Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {sortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handlePostClick(post)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={post.author_avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {post.author_name?.slice(0, 2) || 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{post.author_name}</p>
                          {post.is_trending && (
                            <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                          {post.nft_id && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                              <Award className="w-3 h-3 mr-1" />
                              NFT #{post.nft_id}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{formatTimeAgo(post.created_at)}</span>
                          <span>•</span>
                          <span>{post.reading_time} min read</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <CardTitle className="text-xl mt-4 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Tags */}
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVote(post.id)
                        }}
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
                        {post.comments}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:text-purple-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {post.votes >= 10 && post.nft_id && (
                        <div className="flex items-center text-sm text-yellow-600">
                          <Sparkles className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">NFT Earned!</span>
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
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

        {/* Post Detail Modal */}
        <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedPost.author_avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {selectedPost.author_name?.slice(0, 2) || 'UN'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{selectedPost.author_name}</p>
                        {selectedPost.is_trending && (
                          <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {selectedPost.nft_id && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            <Award className="w-3 h-3 mr-1" />
                            NFT #{selectedPost.nft_id}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatTimeAgo(selectedPost.created_at)}</span>
                        <span>•</span>
                        <span>{selectedPost.reading_time} min read</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{selectedPost.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl">{selectedPost.title}</DialogTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedPost.category}</Badge>
                    {selectedPost.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </DialogHeader>
                
                <div className="mt-6">
                  {selectedPost.image_url && (
                    <img 
                      src={selectedPost.image_url} 
                      alt={selectedPost.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    {selectedPost.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h3 key={index} className="text-lg font-semibold mt-6 mb-3">
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        )
                      }
                      if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                        return (
                          <p key={index} className="italic text-gray-600 dark:text-gray-400 mb-4">
                            {paragraph.replace(/\*/g, '')}
                          </p>
                        )
                      }
                      return (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    })}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  {/* Engagement Section */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
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
                      
                      <Button variant="ghost" size="sm" className="hover:text-blue-600">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {selectedPost.comments}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="hover:text-purple-600">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="hover:text-orange-600">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  {/* Comments Section */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">
                      Comments ({postComments.length})
                    </h4>
                    <div className="space-y-4">
                      {postComments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author_avatar} />
                            <AvatarFallback className="bg-gray-400 text-white text-xs">
                              {comment.author_name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author_name}</span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {comment.votes}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {postComments.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No comments yet. Be the first to share your thoughts!
                        </p>
                      )}
                      
                      <div className="mt-6">
                        <Textarea 
                          placeholder="Add a comment..." 
                          className="mb-3"
                        />
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {sortedPosts.length === 0 && (
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