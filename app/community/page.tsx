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
import { Users, Plus, ThumbsUp, Award, Sparkles, MessageCircle, Share2, Loader2, Coins, Clock, Eye, TrendingUp, Bookmark, MoreHorizontal, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

// Enhanced mock data for demo mode
interface Contribution {
  id: string
  auth_user_id: string
  title: string
  content: string
  full_content: string
  image_url?: string
  category: string
  votes: number
  nft_id?: string
  created_at: string
  updated_at: string
  author_email?: string
  user_has_voted?: boolean
  views: number
  reading_time: number
  trending: boolean
  tags: string[]
  comments: Comment[]
}

interface Comment {
  id: string
  author: string
  content: string
  created_at: string
  likes: number
  replies?: Comment[]
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
    content: 'Starting with zero AI experience, I used Bolt.new to create an amazing application that now helps me manage my daily tasks. The journey was incredible and taught me so much about the power of modern AI tools...',
    full_content: `# How I Built My First AI App with Bolt.new in 24 Hours

## The Challenge
I decided to challenge myself: could I build a functional AI application in just 24 hours with no prior AI development experience? Armed with determination and Bolt.new, I embarked on this journey.

## Hour 1-4: Planning and Setup
- **Research Phase**: I spent the first 2 hours understanding what I wanted to build - a personal productivity assistant
- **Tool Discovery**: Found Bolt.new and was amazed by its AI-powered development capabilities
- **Initial Setup**: Got my development environment ready and created my first project

## Hour 5-12: Core Development
The magic happened here. Bolt.new's AI assistant helped me:
- Design the application architecture
- Write clean, functional code
- Implement user authentication
- Create a responsive UI with modern design principles

## Hour 13-20: Advanced Features
- **AI Integration**: Added natural language processing for task management
- **Smart Suggestions**: Implemented an algorithm that learns from user behavior
- **Data Visualization**: Created charts to show productivity trends
- **Mobile Responsiveness**: Ensured the app works perfectly on all devices

## Hour 21-24: Testing and Deployment
- **Bug Fixes**: Resolved minor issues with AI assistance
- **Performance Optimization**: Improved load times and user experience
- **Deployment**: Published the app and shared it with friends

## Key Learnings
1. **AI-Assisted Development is Revolutionary**: Bolt.new accelerated my development speed by 10x
2. **Focus on User Experience**: Even with AI help, human creativity in UX design is irreplaceable
3. **Iterative Development**: Quick prototyping and testing led to better results
4. **Community Support**: The Bolt.new community provided incredible help and feedback

## The Results
By the end of 24 hours, I had:
- A fully functional productivity app
- Over 500 lines of clean, documented code
- Responsive design that works on desktop and mobile
- AI-powered features that actually add value
- Deployment pipeline set up for future updates

## What's Next?
This experience has opened my eyes to the possibilities of AI-assisted development. I'm now working on more complex projects and helping others learn these powerful tools.

**Pro Tip**: Don't be afraid to experiment with AI development tools. They're more accessible than you think, and the learning curve is surprisingly gentle when you have the right guidance.

*If you're interested in seeing the app or learning more about my development process, feel free to ask questions in the comments below!*`,
    category: 'Experience',
    votes: 24,
    nft_id: '123456',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    author_email: 'sarah@example.com',
    user_has_voted: false,
    views: 342,
    reading_time: 8,
    trending: true,
    tags: ['bolt.new', 'ai-development', 'productivity', '24-hour-challenge'],
    comments: [
      {
        id: 'c1',
        author: 'Alex Chen',
        content: 'This is incredible! I\'ve been hesitant to try AI development tools, but your experience makes it sound so accessible. What was the most challenging part?',
        created_at: '2025-01-15T12:30:00Z',
        likes: 5,
        replies: [
          {
            id: 'c1r1',
            author: 'Sarah Mitchell',
            content: 'Great question! The most challenging part was actually deciding what to build rather than the technical implementation. Bolt.new handled most of the heavy lifting.',
            created_at: '2025-01-15T13:45:00Z',
            likes: 2
          }
        ]
      },
      {
        id: 'c2',
        author: 'Marcus Rodriguez',
        content: 'Love the systematic approach you took. Breaking it down into 4-hour chunks seems like a great strategy for any development project.',
        created_at: '2025-01-15T14:20:00Z',
        likes: 8
      }
    ]
  },
  {
    id: '2',
    auth_user_id: 'user2',
    title: 'Complete Guide to Prompt Engineering for Non-Techies',
    content: 'Prompt engineering isn\'t just for developers - it\'s a skill everyone can learn to get better results from AI tools. Here\'s my comprehensive framework that anyone can follow...',
    full_content: `# Complete Guide to Prompt Engineering for Non-Techies

Prompt engineering is the art and science of communicating effectively with AI systems. Whether you're using ChatGPT, Claude, or any other AI tool, knowing how to craft effective prompts can dramatically improve your results.

## What is Prompt Engineering?
Think of prompt engineering as learning how to ask better questions. Just like how asking a librarian "Where are the books?" gets you different results than "I'm researching sustainable energy solutions for small businesses - what resources do you recommend?", the way you phrase requests to AI matters enormously.

## The CLEAR Framework
I've developed a simple framework that anyone can use:

**C** - Context: Give the AI background information
**L** - Length: Specify how long you want the response
**E** - Examples: Provide examples of what you're looking for
**A** - Action: Clearly state what you want the AI to do
**R** - Role: Tell the AI what role it should play

## Practical Examples

### Bad Prompt:
"Write something about marketing"

### Good Prompt:
"You are an experienced digital marketing consultant. I'm launching a small bakery in Seattle and need a 3-month social media strategy. Focus on Instagram and Facebook, with a budget under $500/month. Include specific content ideas, posting schedules, and engagement tactics. Use a friendly, community-focused tone that reflects our artisanal approach."

See the difference? The second prompt gives the AI everything it needs to provide a useful, actionable response.

## Advanced Techniques

### 1. Chain of Thought Prompting
Instead of asking for a final answer, ask the AI to work through the problem step by step:
"Explain your reasoning step by step before providing the final recommendation."

### 2. Role-Based Prompting
Give the AI a specific expertise:
- "As a senior financial advisor..."
- "From the perspective of a busy parent..."
- "Acting as a creative writing coach..."

### 3. Constraint Setting
Set boundaries to get more focused results:
- "In exactly 100 words..."
- "Using only free tools..."
- "Suitable for a beginner audience..."

## Common Mistakes to Avoid

1. **Being Too Vague**: "Help me with business" vs "Help me create a pricing strategy for my consulting business"
2. **Asking Multiple Questions**: Break complex requests into separate prompts
3. **Ignoring Context**: Each conversation builds on previous messages
4. **Not Iterating**: Refine your prompts based on the responses you get

## Tools and Resources
- **ChatGPT**: Great for creative and analytical tasks
- **Claude**: Excellent for detailed analysis and writing
- **Bing Chat**: Best for current information and research
- **Midjourney**: Specialized for image generation
- **Copy.ai**: Focused on marketing copy

## Practice Exercises
Try these prompts with your favorite AI tool:

1. "You are a professional editor. Review this email for tone, clarity, and professionalism: [insert your email]"
2. "As a personal trainer, create a 4-week workout plan for someone who works from home and has 30 minutes per day to exercise."
3. "Acting as a meal planning expert, suggest 5 healthy lunch ideas that take less than 15 minutes to prepare."

## Measuring Success
Good prompts produce responses that are:
- Relevant to your specific situation
- Actionable and practical
- Appropriately detailed
- In the right tone for your audience

## Conclusion
Prompt engineering is a superpower in the AI age. It's not about memorizing complex formulas - it's about thinking clearly about what you need and communicating it effectively. Start with the CLEAR framework, practice regularly, and don't be afraid to iterate and improve your prompts.

The future belongs to those who can effectively collaborate with AI tools, and that collaboration starts with great prompts.`,
    category: 'Tutorial',
    votes: 18,
    created_at: '2025-01-14T15:30:00Z',
    updated_at: '2025-01-14T15:30:00Z',
    author_email: 'mike@example.com',
    user_has_voted: true,
    views: 567,
    reading_time: 12,
    trending: false,
    tags: ['prompt-engineering', 'ai-tools', 'productivity', 'tutorial'],
    comments: [
      {
        id: 'c3',
        author: 'Emma Wilson',
        content: 'The CLEAR framework is genius! I\'ve been struggling with getting good results from AI tools, but this systematic approach makes so much sense.',
        created_at: '2025-01-14T16:45:00Z',
        likes: 12
      },
      {
        id: 'c4',
        author: 'David Park',
        content: 'I work in HR and just used your role-based prompting technique to create job descriptions. The results were amazing - saved me hours of work!',
        created_at: '2025-01-14T18:20:00Z',
        likes: 7
      }
    ]
  },
  {
    id: '3',
    auth_user_id: 'user3',
    title: 'Why I\'m Not Afraid of AI Taking My Job as a Designer',
    content: 'There\'s a lot of fear around AI replacing creative jobs, but I believe it\'s actually making us more creative and strategic. Here\'s why I\'m optimistic about the future of design...',
    full_content: `# Why I'm Not Afraid of AI Taking My Job as a Designer

As a graphic designer with 8 years of experience, I've watched AI tools evolve from curiosities to legitimate creative partners. While many of my colleagues express fear about job displacement, I've taken a different approach: I've embraced AI as a creative multiplier.

## The Reality Check
Let's be honest - AI can now create logos, generate images, and even design entire websites. DALL-E, Midjourney, and other tools produce stunning visuals in seconds. But here's what I've learned after a year of working alongside AI tools: they're making me a better designer, not replacing me.

## What AI Does Well
- **Rapid Iteration**: Generate 50 logo concepts in minutes
- **Style Exploration**: Experiment with visual directions quickly
- **Asset Creation**: Produce custom illustrations and graphics
- **Technical Execution**: Handle repetitive design tasks efficiently

## What AI Struggles With
- **Understanding Context**: AI doesn't grasp brand nuance or cultural sensitivity
- **Client Communication**: Can't interpret feedback or manage relationships
- **Strategic Thinking**: Lacks understanding of business goals and user psychology
- **Quality Control**: Needs human oversight for consistency and appropriateness

## My AI-Enhanced Workflow

### Before AI:
1. Client brief → 2. Research → 3. Sketching → 4. Digital creation → 5. Revisions → 6. Final delivery
**Timeline**: 2-3 weeks for a complete brand identity

### With AI:
1. Client brief → 2. AI-assisted research → 3. AI concept generation → 4. Human curation and refinement → 5. Strategic presentation → 6. Final delivery
**Timeline**: 1 week for the same project

## Real Project Examples

### Logo Design for Tech Startup
- **Traditional approach**: 40 hours of work, 3 concepts
- **AI-enhanced approach**: 12 hours of work, 15 refined concepts
- **Result**: Client was thrilled with options, chose a concept I never would have considered

### Website Redesign for Non-Profit
- **AI generated**: Initial wireframes and visual concepts
- **Human added**: Accessibility considerations, donor psychology, storytelling elements
- **Outcome**: 300% increase in online donations after launch

## Skills I'm Developing
Instead of competing with AI, I'm developing complementary skills:

1. **AI Tool Mastery**: Learning prompt engineering and tool optimization
2. **Strategic Design Thinking**: Focusing on brand strategy and user psychology
3. **Client Consultation**: Becoming a design advisor, not just a creator
4. **Quality Curation**: Developing an eye for AI-generated content quality
5. **Technical Integration**: Understanding how AI fits into design workflows

## The Economic Reality
My income hasn't decreased - it's increased by 40% this year. Here's why:
- **Faster Delivery**: Complete more projects in less time
- **Higher Value Services**: Focus on strategy and consultation
- **New Revenue Streams**: Offer AI integration consulting to other agencies
- **Premium Positioning**: Market myself as an "AI-enhanced designer"

## Advice for Fellow Designers

### Don't Fight It - Use It
AI isn't going away. The designers who succeed will be those who learn to collaborate with AI tools effectively.

### Focus on Uniquely Human Skills
- Empathy and emotional intelligence
- Strategic thinking and problem-solving
- Client relationship management
- Cultural sensitivity and context understanding

### Experiment Constantly
Try new AI tools monthly. Understand their capabilities and limitations. Find ways to integrate them into your workflow.

### Communicate Your Value
Help clients understand the difference between AI-generated content and AI-enhanced design that includes human strategy, oversight, and refinement.

## The Future I See
In 5 years, I predict:
- All designers will use AI tools (just like we all use Photoshop now)
- Design education will include AI collaboration as a core skill
- Premium design services will emphasize strategy and human insight
- New design roles will emerge around AI direction and curation

## Conclusion
AI isn't the enemy of creativity - it's a powerful tool that can amplify human creativity. Instead of fearing obsolescence, I'm excited about a future where I can focus on the strategic, emotional, and uniquely human aspects of design while AI handles the time-consuming technical execution.

The question isn't whether AI will change design - it already has. The question is whether you'll adapt and thrive, or resist and struggle. I choose to thrive.`,
    category: 'Discussion',
    votes: 12,
    nft_id: '789012',
    created_at: '2025-01-13T09:15:00Z',
    updated_at: '2025-01-13T09:15:00Z',
    author_email: 'alex@example.com',
    user_has_voted: false,
    views: 289,
    reading_time: 15,
    trending: false,
    tags: ['design', 'ai-collaboration', 'career-advice', 'future-of-work'],
    comments: [
      {
        id: 'c5',
        author: 'Lisa Thompson',
        content: 'Thank you for sharing such an honest and optimistic perspective! As someone just starting in design, this gives me hope that AI can be a tool rather than a threat.',
        created_at: '2025-01-13T11:30:00Z',
        likes: 9
      }
    ]
  },
  {
    id: '4',
    auth_user_id: 'user4',
    title: 'From Zero to $5K/Month: Building an AI Content Business',
    content: 'I started a content creation business using AI tools and it\'s now generating $5k/month. Here\'s exactly how I did it and what tools I used...',
    full_content: `# From Zero to $5K/Month: Building an AI Content Business

Six months ago, I was struggling to make ends meet as a freelance writer, competing with countless others on platforms like Upwork and Fiverr. Today, I run a content creation business that consistently generates $5,000+ per month. The game-changer? Learning to leverage AI tools strategically.

## The Breaking Point
After months of writing blog posts for $20 each and spending hours on research, I realized I was trapped in a race to the bottom. I needed to find a way to:
- Increase my output without sacrificing quality
- Offer services that commanded higher prices
- Build systems that could scale beyond my personal time

That's when I discovered the power of AI-assisted content creation.

## Month 1: Foundation and Learning
**Revenue: $0**
**Focus: Tool mastery and process development**

### Tools I Invested In:
- ChatGPT Plus ($20/month) - For content ideation and drafting
- Claude Pro ($20/month) - For research and analysis
- Jasper AI ($49/month) - For marketing copy
- Grammarly Premium ($30/month) - For editing and quality control

### Skills Developed:
- Prompt engineering for content creation
- AI output editing and humanization
- Content strategy and planning
- Quality control processes

## Month 2: First Clients
**Revenue: $800**
**Focus: Service development and client acquisition**

### Services Offered:
1. **Blog Content Packages**: 4 posts/month for $600
2. **Social Media Content**: 20 posts/month for $400
3. **Email Newsletter Series**: 8 emails for $500

### Client Acquisition Strategy:
- Reached out to 50 small businesses per week
- Offered free content audits to demonstrate value
- Created case studies showing before/after improvements
- Used AI to personalize outreach messages at scale

## Month 3-4: Scaling and Systematizing
**Revenue: $2,400**
**Focus: Process optimization and team building**

### Process Improvements:
- Created content templates for different industries
- Developed quality checklists for AI-generated content
- Built a content calendar system
- Established revision workflows

### Team Expansion:
- Hired a part-time VA for research and admin ($400/month)
- Partnered with a graphic designer for visual content
- Created standard operating procedures for all processes

## Month 5-6: Premium Services and Expansion
**Revenue: $5,200**
**Focus: High-value services and market positioning**

### New Premium Services:
1. **Content Strategy Consulting**: $150/hour
2. **AI Training Workshops**: $2,000 for 2-day sessions
3. **Done-With-You Content Systems**: $3,000/month retainers
4. **Industry-Specific Content Packages**: $1,500-$3,000/month

### Marketing Evolution:
- Launched a weekly newsletter about AI and content creation
- Started speaking at marketing conferences
- Created free resources and lead magnets
- Built partnerships with marketing agencies

## The AI-Enhanced Workflow

### Traditional Content Creation:
1. Research topic (2 hours)
2. Create outline (30 minutes)
3. Write first draft (3 hours)
4. Edit and revise (1 hour)
5. Final proofread (30 minutes)
**Total: 7 hours per article**

### AI-Enhanced Process:
1. AI-assisted research and outline (30 minutes)
2. AI generates first draft with specific prompts (15 minutes)
3. Human editing for voice, accuracy, and strategy (1.5 hours)
4. AI-assisted optimization for SEO and readability (15 minutes)
5. Final human review and polish (30 minutes)
**Total: 3 hours per article**

## Key Success Factors

### 1. Quality Control Systems
- Never publish AI content without human review
- Fact-check all claims and statistics
- Ensure brand voice consistency
- Test content performance and iterate

### 2. Strategic Positioning
- Position as "AI-enhanced content creation," not "AI-generated content"
- Emphasize the human strategy and oversight
- Focus on results and ROI for clients
- Build trust through transparency about processes

### 3. Continuous Learning
- Stay updated on new AI tools and techniques
- Join AI and marketing communities
- Experiment with new approaches monthly
- Share learnings to build thought leadership

### 4. Client Education
- Help clients understand the value of AI-enhanced content
- Provide training on content strategy and best practices
- Share performance data and case studies
- Build long-term partnerships, not just transactions

## Financial Breakdown (Month 6)

### Revenue Streams:
- Content retainer clients: $3,200
- One-time projects: $1,200
- Consulting and training: $800
**Total Revenue: $5,200**

### Expenses:
- AI tools: $119
- VA and contractor payments: $600
- Marketing and tools: $200
- Business expenses: $150
**Total Expenses: $1,069**

**Net Profit: $4,131 (79% margin)**

## Lessons Learned

### What Worked:
- Focusing on results, not tools
- Building systems before scaling
- Investing in relationships, not just transactions
- Continuous experimentation and improvement

### What Didn't Work:
- Competing on price in the beginning
- Over-relying on AI without human oversight
- Trying to serve everyone instead of niching down
- Underestimating the importance of quality control

## Next Steps
I'm now working toward $10K/month by:
- Launching an online course about AI content creation
- Building a SaaS tool for content planning and creation
- Expanding into video content creation
- Developing industry-specific content solutions

## Advice for Others

### Start Small
Don't quit your day job immediately. Build your AI skills and client base gradually.

### Focus on Value
Position yourself as a strategic partner who uses AI to deliver better results faster, not as someone who just uses AI to cut corners.

### Invest in Quality
The money is in premium services that combine AI efficiency with human strategy and oversight.

### Build Systems
Document everything so you can scale beyond your personal capacity.

### Stay Ethical
Be transparent about your use of AI tools and always prioritize client results over ease of production.

## Conclusion
AI didn't replace me as a content creator - it made me a more effective business owner. By combining the efficiency of AI tools with human strategy, creativity, and quality control, I've built a sustainable business that serves clients better while providing me with the freedom and income I always wanted.

The future of content creation isn't human vs. AI - it's humans and AI working together to create better outcomes for everyone.`,
    category: 'Business',
    votes: 31,
    created_at: '2025-01-12T14:20:00Z',
    updated_at: '2025-01-12T14:20:00Z',
    author_email: 'emma@example.com',
    user_has_voted: false,
    views: 923,
    reading_time: 18,
    trending: true,
    tags: ['business', 'ai-tools', 'content-creation', 'entrepreneurship'],
    comments: [
      {
        id: 'c6',
        author: 'Chris Johnson',
        content: 'This is exactly the roadmap I needed! I\'ve been hesitant to start a content business, but your systematic approach makes it feel achievable. Thanks for being so transparent with the numbers.',
        created_at: '2025-01-12T16:30:00Z',
        likes: 15
      },
      {
        id: 'c7',
        author: 'Rachel Green',
        content: 'The quality control section is gold. I made the mistake of publishing AI content without proper human review and learned the hard way. Your workflow is spot on.',
        created_at: '2025-01-12T19:45:00Z',
        likes: 11
      }
    ]
  },
  {
    id: '5',
    auth_user_id: 'user5',
    title: 'The Dark Side of AI: What They Don\'t Tell You',
    content: 'While everyone celebrates AI breakthroughs, we need to talk about the real risks, ethical concerns, and unintended consequences that are often overlooked...',
    full_content: `# The Dark Side of AI: What They Don't Tell You

While the tech world celebrates each new AI breakthrough, I've spent the last year researching the darker implications of our rapid AI adoption. As someone who has implemented AI systems in healthcare, finance, and education, I feel compelled to share what I've learned about the risks we're not discussing enough.

## The Bias Problem is Worse Than You Think

### Real-World Examples:
- **Healthcare AI**: A diagnostic AI system I worked with showed 23% higher error rates for patients with darker skin tones
- **Hiring Algorithms**: Resume screening tools consistently ranked female candidates lower, even with identical qualifications
- **Financial Services**: Credit scoring algorithms denied loans to qualified minority applicants at disproportionate rates

### Why This Happens:
AI systems learn from historical data, which contains centuries of human bias. When we train AI on biased data, we don't just replicate these biases - we amplify and systematize them.

## The Surveillance State is Already Here

### Corporate Surveillance:
- Your smartphone apps use AI to analyze your voice patterns, predicting mental health states and purchasing behavior
- Retail stores track your gaze patterns and emotional responses to products
- Social media platforms know you better than your closest friends, predicting your actions days in advance

### Government Applications:
- Facial recognition systems can track your location and associations in real-time
- Predictive policing algorithms create feedback loops that reinforce existing inequalities
- Social credit systems (not just in China) are being tested globally

## The Economic Disruption is Happening Faster Than Predicted

### Jobs at Risk (Sooner Than Expected):
- **Radiologists**: AI can now detect cancer more accurately than humans
- **Lawyers**: Document review and contract analysis are becoming automated
- **Accountants**: Tax preparation and financial analysis are being replaced
- **Teachers**: Personalized AI tutors are outperforming human instruction in many subjects

### The Inequality Amplifier:
- Those with access to AI tools gain massive advantages
- Small businesses without AI capabilities can't compete
- The gap between AI-literate and AI-illiterate workers widens daily
- Geographic regions without AI infrastructure fall further behind

## Environmental Costs Nobody Mentions

### The Hidden Energy Consumption:
- Training GPT-3 consumed 1,287 MWh of electricity (equivalent to 120 homes for a year)
- ChatGPT's daily operations require the electricity of 33,000 homes
- Bitcoin mining is nothing compared to the energy requirements of large AI systems
- Data centers supporting AI now consume 3% of global electricity (and growing rapidly)

### Resource Extraction:
- AI chips require rare earth minerals mined under often exploitative conditions
- Water usage for cooling data centers is depleting local water supplies
- Electronic waste from outdated AI hardware creates massive environmental problems

## The Mental Health Crisis

### Addiction by Design:
- AI-powered algorithms on social platforms are designed to maximize engagement, often through triggering negative emotions
- Personalized content feeds create echo chambers that radicalize users
- AI chatbots and virtual companions are replacing human relationships, especially among young people

### The Comparison Trap:
- AI-generated "perfect" images on social media create unrealistic beauty standards
- Deepfakes and AI-enhanced content make it impossible to distinguish reality from fiction
- AI tutors and assistants make people feel inadequate about their natural abilities

## Security Vulnerabilities

### AI as a Weapon:
- Autonomous weapons systems are being developed by multiple nations
- AI-powered cyberattacks can adapt in real-time to defenses
- Deepfake technology can impersonate anyone, undermining trust in all media
- AI can generate sophisticated phishing and social engineering attacks

### The Fragility Problem:
- AI systems fail in unpredictable ways when encountering unexpected inputs
- Adversarial attacks can fool AI systems with tiny, invisible modifications
- Over-reliance on AI creates single points of failure in critical systems

## Loss of Human Agency

### Decision Outsourcing:
- People increasingly defer to AI recommendations without understanding the reasoning
- Algorithm-driven decisions in healthcare, law enforcement, and education remove human judgment
- The illusion of objectivity masks subjective programming choices

### Skill Atrophy:
- GPS has weakened our navigation abilities
- Calculators reduced mathematical intuition
- AI writing tools are diminishing our communication skills
- AI is making us intellectually dependent

## What We Can Do

### Individual Actions:
1. **Demand Transparency**: Ask how AI systems work before trusting them
2. **Maintain Skills**: Keep developing human capabilities that AI can't replace
3. **Diversify Sources**: Don't rely solely on AI for information or decisions
4. **Support Ethical AI**: Choose companies that prioritize responsible AI development

### Systemic Changes Needed:
1. **Regulation**: Comprehensive AI governance frameworks
2. **Education**: AI literacy should be taught alongside traditional subjects
3. **Accountability**: Clear liability for AI decisions and failures
4. **Equity**: Ensure AI benefits are distributed fairly across society

### For Businesses:
1. **Ethical Guidelines**: Implement AI ethics committees and review processes
2. **Bias Testing**: Regularly audit AI systems for discriminatory outcomes
3. **Human Oversight**: Maintain human decision-making authority for critical choices
4. **Transparency**: Be honest about AI use with customers and employees

## The Path Forward

I'm not advocating for abandoning AI - that ship has sailed. Instead, we need:

### Honest Conversations:
- Acknowledge AI's limitations and risks alongside its benefits
- Include diverse voices in AI development and governance
- Prioritize long-term societal impact over short-term profits

### Responsible Development:
- Slower, more thoughtful AI deployment in critical sectors
- Investment in AI safety research proportional to AI capabilities research
- International cooperation on AI governance and standards

### Human-Centered AI:
- AI should augment human capabilities, not replace human judgment
- Preserve human agency and decision-making authority
- Design AI systems that enhance rather than diminish human potential

## Conclusion

AI will likely be the most transformative technology in human history. But transformation isn't inherently positive. The same technology that could solve climate change could also create unprecedented surveillance states. The AI that could democratize education could also increase inequality.

The choices we make today about AI development, deployment, and governance will shape the next century of human civilization. We need to have these difficult conversations now, while we still have agency in determining our AI-enhanced future.

The dark side of AI isn't science fiction - it's happening right now. Recognizing these challenges is the first step toward addressing them responsibly.`,
    category: 'Discussion',
    votes: 7,
    created_at: '2025-01-11T16:45:00Z',
    updated_at: '2025-01-11T16:45:00Z',
    author_email: 'jordan@example.com',
    user_has_voted: false,
    views: 445,
    reading_time: 20,
    trending: false,
    tags: ['ai-ethics', 'technology-risks', 'critical-analysis', 'society'],
    comments: [
      {
        id: 'c8',
        author: 'Dr. Patricia Wong',
        content: 'As an AI researcher, I appreciate this balanced perspective. We need more voices highlighting these issues before they become irreversible systemic problems.',
        created_at: '2025-01-11T18:20:00Z',
        likes: 13
      }
    ]
  },
  {
    id: '6',
    auth_user_id: 'user6',
    title: 'AI Tools That Actually Save Me 10+ Hours Per Week',
    content: 'After testing 50+ AI tools over the past year, here are the ones that have genuinely transformed my productivity and saved me significant time...',
    full_content: `# AI Tools That Actually Save Me 10+ Hours Per Week

I've been obsessed with productivity optimization for years, but 2024 was the year AI tools finally delivered on their promise. After testing over 50 different AI applications, I've identified the tools that provide real, measurable time savings in my daily workflow.

## My Testing Methodology

Before diving into the tools, here's how I measured their effectiveness:
- **Time Tracking**: Used RescueTime to measure actual time saved
- **Quality Assessment**: Compared AI output quality to my previous manual work
- **Cost-Benefit Analysis**: Calculated ROI based on time saved vs. subscription costs
- **Learning Curve**: Measured time to proficiency for each tool

## The Winners: Tools That Actually Save Time

### 1. Claude (Writing and Analysis) - 4 hours/week saved
**Cost**: $20/month
**Use Cases**: 
- Email drafting and responses (80% faster)
- Research summarization (90% faster)
- Document analysis and extraction
- Code review and debugging assistance

**Real Example**: 
I used to spend 2 hours weekly writing detailed client proposals. Claude now helps me create first drafts in 20 minutes, which I then customize. The quality is often better than my original writing because Claude catches details I miss.

### 2. Notion AI (Content Creation) - 2.5 hours/week saved
**Cost**: $10/month (part of Notion subscription)
**Use Cases**:
- Meeting notes summarization
- Project documentation creation
- Content ideation and outlining
- Database content generation

**Real Example**:
Weekly team meeting notes that took 45 minutes to write and format now take 10 minutes with Notion AI's summarization and structuring features.

### 3. Midjourney (Visual Content) - 2 hours/week saved
**Cost**: $30/month
**Use Cases**:
- Social media graphics creation
- Presentation illustrations
- Website mockups and concepts
- Marketing material visuals

**Real Example**:
Creating custom illustrations for blog posts used to require hiring a designer ($200-500 per piece) or spending hours in Canva. Midjourney generates professional-quality visuals in minutes.

### 4. GitHub Copilot (Coding) - 1.5 hours/week saved
**Cost**: $10/month
**Use Cases**:
- Code completion and suggestions
- Function and component generation
- Bug fixing assistance
- Documentation writing

**Real Example**:
Writing boilerplate code for API endpoints that previously took 30 minutes now takes 5 minutes with Copilot's intelligent suggestions.

### 5. Otter.ai (Meeting Transcription) - 1 hour/week saved
**Cost**: $17/month
**Use Cases**:
- Automatic meeting transcription
- Action item extraction
- Key point summarization
- Interview transcription

**Real Example**:
I attend 5-6 hours of meetings weekly. Otter.ai eliminates the need for manual note-taking and provides searchable transcripts for reference.

## Workflow Integration Examples

### Morning Routine (15 minutes saved daily)
**Before AI**: 
- Read and summarize 10 industry articles (45 minutes)
- Write daily task list and priorities (15 minutes)

**With AI**:
- Claude summarizes key articles and trends (10 minutes)
- Notion AI creates optimized task lists based on calendar and previous patterns (5 minutes)

### Content Creation (3 hours saved per blog post)
**Before AI**:
1. Research topic (2 hours)
2. Create outline (30 minutes)
3. Write first draft (4 hours)
4. Create visuals (1.5 hours)
5. Edit and optimize (1 hour)
**Total**: 9 hours

**With AI**:
1. Claude research and outline (30 minutes)
2. AI-assisted first draft (1.5 hours)
3. Midjourney visuals (20 minutes)
4. Human editing and optimization (1 hour)
**Total**: 3 hours, 20 minutes

## Tools That Didn't Make the Cut

### Overhyped Tools:
- **Jasper AI**: Too expensive for the value provided
- **Copy.ai**: Output quality inconsistent, required too much editing
- **Loom AI**: Transcription accuracy poor, summary features limited
- **Calendly AI**: Scheduling assistance didn't save meaningful time

### Why They Failed:
- High cost with marginal time savings
- Poor integration with existing workflows
- Steep learning curve without proportional benefits
- Inconsistent output quality requiring extensive human oversight

## ROI Analysis

### Time Saved: 11 hours/week = 572 hours/year
### Total Tool Costs: $87/month = $1,044/year
### Value of Time Saved: 572 hours × $75/hour = $42,900
### Net Value: $41,856/year

**ROI: 4,008%**

## Implementation Tips

### Start Small
Don't try to implement all tools at once. I recommend this order:
1. Start with Claude for writing tasks
2. Add Midjourney for visual content
3. Integrate Notion AI for documentation
4. Include specialized tools like Copilot or Otter.ai based on your needs

### Set Quality Standards
- Define minimum quality thresholds for AI output
- Always review and edit AI-generated content
- Develop templates and prompts for consistent results

### Track Your Results
- Use time tracking to measure actual savings
- Monitor output quality over time
- Calculate ROI regularly to justify expenses

### Stay Updated
- AI tools improve rapidly - reassess monthly
- Join communities where users share tips and tricks
- Experiment with new tools but be disciplined about adoption

## Surprising Lessons Learned

### 1. Specificity Matters
Generic prompts produce generic results. The more specific and detailed your inputs, the better the AI output.

### 2. Human Oversight is Essential
AI tools amplify your capabilities but don't replace judgment. Always maintain final review and approval processes.

### 3. Integration is Key
Tools that work well with your existing systems provide more value than standalone solutions with better features.

### 4. The Learning Curve is Real
Budget 2-4 weeks to become proficient with each new AI tool. The productivity gains come after this initial investment.

## Future Predictions

### Tools to Watch:
- **Video AI**: Runway and Pika for video content creation
- **Voice AI**: ElevenLabs for voice synthesis and translation
- **Workflow AI**: Zapier AI for complex automation
- **Research AI**: Perplexity for real-time information gathering

### Trends to Monitor:
- Integration between AI tools (creating AI-powered workflows)
- Specialized AI for specific industries and roles
- Local AI models that work offline
- AI agents that can complete multi-step tasks independently

## Conclusion

The key to AI productivity isn't using every available tool - it's finding the ones that genuinely solve problems in your specific workflow. These six tools save me over 10 hours weekly, but your mileage may vary based on your work type and current processes.

Start with one tool, master it, measure the results, then gradually expand your AI toolkit. The goal isn't to use AI for everything - it's to use AI for the things that provide genuine value while maintaining the quality and creativity that only humans can provide.

The AI productivity revolution is real, but it requires intentionality, measurement, and continuous refinement to achieve meaningful results.`,
    category: 'Tutorial',
    votes: 19,
    created_at: '2025-01-10T11:30:00Z',
    updated_at: '2025-01-10T11:30:00Z',
    author_email: 'taylor@example.com',
    user_has_voted: false,
    views: 678,
    reading_time: 16,
    trending: true,
    tags: ['productivity', 'ai-tools', 'workflow-optimization', 'roi-analysis'],
    comments: [
      {
        id: 'c9',
        author: 'Michael Brown',
        content: 'The ROI analysis is incredibly helpful! I\'ve been hesitant to pay for AI tools, but your breakdown shows the math clearly. Starting with Claude based on your recommendation.',
        created_at: '2025-01-10T13:15:00Z',
        likes: 8
      },
      {
        id: 'c10',
        author: 'Nina Patel',
        content: 'Love the workflow integration examples. I\'ve been using these tools individually but hadn\'t thought about chaining them together for maximum efficiency.',
        created_at: '2025-01-10T15:45:00Z',
        likes: 6
      }
    ]
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
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'votes' | 'discussed'>('trending')
  const [selectedPost, setSelectedPost] = useState<Contribution | null>(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null)

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
        full_content: newPost.content.trim(),
        image_url: newPost.image_url?.trim() || undefined,
        category: newPost.category,
        votes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_email: mockUser.email,
        user_has_voted: false,
        views: 0,
        reading_time: Math.ceil(newPost.content.length / 200),
        trending: false,
        tags: [],
        comments: []
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

  const handleSubmitComment = async (postId: string) => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment')
      return
    }

    try {
      setCommentingPostId(postId)
      
      // Simulate comment submission
      await new Promise(resolve => setTimeout(resolve, 500))

      // Create new comment
      const newComment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        author: 'You',
        content: commentText.trim(),
        created_at: new Date().toISOString(),
        likes: 0
      }

      // Update the post with the new comment
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          }
        }
        return post
      }))

      // Update selected post if it's currently open
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? {
          ...prev,
          comments: [...prev.comments, newComment]
        } : null)
      }

      setCommentText('')
      toast.success('Comment posted successfully!')
      
    } catch (error) {
      console.error('Comment error:', error)
      toast.error('Failed to post comment')
    } finally {
      setCommentingPostId(null)
    }
  }

  const openPostModal = (post: Contribution) => {
    setSelectedPost(post)
    setIsPostModalOpen(true)
    
    // Simulate view count increment
    setPosts(prev => prev.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    ))
  }

  const sortPosts = (posts: Contribution[]) => {
    switch (sortBy) {
      case 'trending':
        return [...posts].sort((a, b) => {
          const aScore = a.votes * 2 + a.views * 0.1 + a.comments.length * 3 + (a.trending ? 50 : 0)
          const bScore = b.votes * 2 + b.views * 0.1 + b.comments.length * 3 + (b.trending ? 50 : 0)
          return bScore - aScore
        })
      case 'newest':
        return [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case 'votes':
        return [...posts].sort((a, b) => b.votes - a.votes)
      case 'discussed':
        return [...posts].sort((a, b) => b.comments.length - a.comments.length)
      default:
        return posts
    }
  }

  const filteredPosts = filter === 'all' 
    ? sortPosts(posts)
    : sortPosts(posts.filter(post => post.category.toLowerCase() === filter))

  const categories = ['all', 'tutorial', 'experience', 'business', 'discussion']
  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'votes', label: 'Most Voted' },
    { value: 'discussed', label: 'Most Discussed' }
  ]

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

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8"
        >
          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
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
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
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
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => openPostModal(post)}>
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
                          {post.trending && (
                            <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
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
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{formatTimeAgo(post.created_at)}</span>
                          <span>•</span>
                          <span>{post.reading_time} min read</span>
                          <span>•</span>
                          <span>{post.views} views</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4 group-hover:text-blue-600 transition-colors">{post.title}</CardTitle>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
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
                        {post.comments.length}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="hover:text-purple-600">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>

                      <Button variant="ghost" size="sm" className="hover:text-yellow-600">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save
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
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {getAuthorInitials(selectedPost.author_email || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">{selectedPost.author_email?.split('@')[0] || 'Unknown User'}</p>
                        {selectedPost.trending && (
                          <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
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
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{formatTimeAgo(selectedPost.created_at)}</span>
                        <span>•</span>
                        <span>{selectedPost.reading_time} min read</span>
                        <span>•</span>
                        <span>{selectedPost.views} views</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{selectedPost.category}</Badge>
                </div>
                <DialogTitle className="text-2xl mt-4">{selectedPost.title}</DialogTitle>
                {selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedPost.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </DialogHeader>

              <div className="py-6 space-y-6">
                {/* Post Content */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
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
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {selectedPost.full_content || selectedPost.content}
                  </div>
                </div>

                {/* Engagement Actions */}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
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
                      {selectedPost.votes} votes
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="hover:text-blue-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {selectedPost.comments.length} comments
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="hover:text-purple-600">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>

                    <Button variant="ghost" size="sm" className="hover:text-yellow-600">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  
                  {selectedPost.votes >= 10 && selectedPost.nft_id && (
                    <div className="flex items-center text-sm text-yellow-600">
                      <Sparkles className="w-4 h-4 mr-1" />
                      <span>Algorand NFT Earned!</span>
                    </div>
                  )}
                </div>

                {/* NFT Details in Modal */}
                {selectedPost.nft_id && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-700 dark:text-yellow-300">
                        Algorand NFT Minted
                      </span>
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                      <div>Asset ID: {selectedPost.nft_id}</div>
                      <div>Blockchain: Algorand Testnet</div>
                      <div>Type: Community Contributor NFT</div>
                      <div>Awarded for: Reaching 10+ votes on community contribution</div>
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Comments ({selectedPost.comments.length})
                  </h3>

                  {/* Comment Input */}
                  <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
                          TU
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
                          <span className="text-xs text-gray-500">
                            Be respectful and constructive
                          </span>
                          <Button 
                            size="sm" 
                            onClick={() => handleSubmitComment(selectedPost.id)}
                            disabled={commentingPostId === selectedPost.id || !commentText.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {commentingPostId === selectedPost.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Posting...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Post Comment
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            {comment.author.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="text-xs hover:text-blue-600">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs hover:text-purple-600">
                              Reply
                            </Button>
                          </div>
                          
                          {/* Replies */}
                          {comment.replies && comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3 mt-3 ml-6">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xs">
                                  {reply.author.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{reply.author}</span>
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button variant="ghost" size="sm" className="text-xs hover:text-blue-600">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}