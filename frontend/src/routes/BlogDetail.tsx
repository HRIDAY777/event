import { Calendar, User, Share2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function BlogDetail() {

  // Mock blog post data - in real app this would come from API
  const post = {
    id: '1',
    slug: 'future-of-event-technology-2024',
    title: 'The Future of Event Technology in 2024',
    content: `
      <p>The event industry is undergoing a remarkable transformation, driven by rapid technological advancements and changing attendee expectations. As we move into 2024, several key trends are shaping the future of event management and attendee experiences.</p>
      
      <h2>1. Artificial Intelligence and Personalization</h2>
      <p>AI is revolutionizing how we approach event planning and execution. From intelligent matchmaking that connects attendees with similar interests to personalized content recommendations, AI is making events more engaging and valuable for participants.</p>
      
      <p>Machine learning algorithms can now analyze attendee behavior patterns to optimize event schedules, suggest relevant networking opportunities, and even predict attendance rates with remarkable accuracy.</p>
      
      <h2>2. Hybrid and Virtual Event Platforms</h2>
      <p>The pandemic accelerated the adoption of virtual events, and this trend continues to evolve. Modern hybrid event platforms offer seamless integration between in-person and virtual experiences, allowing organizers to reach global audiences while maintaining the intimacy of face-to-face interactions.</p>
      
      <p>Advanced features like virtual reality (VR) networking rooms, augmented reality (AR) exhibitor booths, and real-time translation services are becoming standard offerings.</p>
      
      <h2>3. Sustainability and Green Technology</h2>
      <p>Environmental consciousness is driving innovation in event technology. Digital ticketing, paperless check-ins, and carbon footprint tracking are just the beginning. Event organizers are increasingly adopting sustainable practices supported by technology.</p>
      
      <p>Smart venue management systems optimize energy usage, while digital signage reduces waste. Mobile apps eliminate the need for printed materials, and virtual components reduce travel-related emissions.</p>
      
      <h2>4. Enhanced Data Analytics</h2>
      <p>Data-driven decision making is becoming the norm in event management. Advanced analytics platforms provide real-time insights into attendee engagement, session popularity, and overall event performance.</p>
      
      <p>These insights enable organizers to make immediate adjustments and plan future events with greater precision. Predictive analytics can forecast attendance trends and help optimize resource allocation.</p>
      
      <h2>5. Immersive Technologies</h2>
      <p>Virtual and augmented reality are creating new possibilities for event experiences. VR can transport attendees to virtual venues or provide immersive product demonstrations, while AR enhances physical spaces with digital overlays.</p>
      
      <p>These technologies are particularly valuable for product launches, training sessions, and interactive exhibitions where hands-on experience is crucial.</p>
      
      <h2>Looking Ahead</h2>
      <p>As we look to the future, the integration of these technologies will become more seamless and intuitive. The focus will shift from technology for technology's sake to creating meaningful, memorable experiences that drive engagement and deliver measurable value.</p>
      
      <p>Event organizers who embrace these trends and invest in the right technology solutions will be well-positioned to create exceptional experiences that stand out in an increasingly competitive landscape.</p>
    `,
    author: 'Sarah Johnson',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    authorTitle: 'CEO & Founder at TechCorp',
    date: '2024-01-15',
    category: 'technology',
    tags: ['technology', 'trends', 'innovation', 'ai', 'virtual-events'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    readTime: '5 min read',
    views: 1247,
    shares: 89
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const relatedPosts = [
    {
      id: '2',
      title: 'How to Create Engaging Virtual Events',
      excerpt: 'Learn the best practices for hosting successful virtual events that keep attendees engaged and connected.',
      author: 'Michael Chen',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop'
    },
    {
      id: '3',
      title: 'Building a Strong Event Community',
      excerpt: 'Explore strategies for building and nurturing a loyal community around your events and brand.',
      author: 'Emily Rodriguez',
      date: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {post.readTime}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Share and Stats */}
          <div className="flex items-center justify-between border-t border-border pt-8 mb-12">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{post.views} views</span>
              <span>{post.shares} shares</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Article
            </Button>
          </div>

          {/* Author Bio */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={post.authorImage}
                  alt={post.author}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{post.author}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{post.authorTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    Sarah is a seasoned entrepreneur and technology enthusiast with over 10 years of experience in the event industry. She founded TechCorp in 2018 and has been at the forefront of event technology innovation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{relatedPost.author}</span>
                      <span>{formatDate(relatedPost.date)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
