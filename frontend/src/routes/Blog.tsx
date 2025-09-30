import { useState } from 'react'
import { Search, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

export function Blog() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock blog data
  const blogPosts = [
    {
      id: '1',
      title: 'The Future of Event Technology in 2024',
      excerpt: 'Discover the latest trends and innovations that are shaping the future of event management and attendee experiences.',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      category: 'technology',
      tags: ['technology', 'trends', 'innovation'],
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      readTime: '5 min read'
    },
    {
      id: '2',
      title: 'How to Create Engaging Virtual Events',
      excerpt: 'Learn the best practices for hosting successful virtual events that keep attendees engaged and connected.',
      author: 'Michael Chen',
      date: '2024-01-10',
      category: 'virtual-events',
      tags: ['virtual', 'engagement', 'best-practices'],
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
      readTime: '7 min read'
    },
    {
      id: '3',
      title: 'Building a Strong Event Community',
      excerpt: 'Explore strategies for building and nurturing a loyal community around your events and brand.',
      author: 'Emily Rodriguez',
      date: '2024-01-05',
      category: 'community',
      tags: ['community', 'engagement', 'branding'],
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop',
      readTime: '6 min read'
    },
    {
      id: '4',
      title: 'Event Marketing Strategies That Convert',
      excerpt: 'Discover proven marketing strategies that help you reach your target audience and drive ticket sales.',
      author: 'David Kim',
      date: '2023-12-28',
      category: 'marketing',
      tags: ['marketing', 'conversion', 'strategy'],
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=250&fit=crop',
      readTime: '8 min read'
    },
    {
      id: '5',
      title: 'The Art of Speaker Selection',
      excerpt: 'Learn how to choose the right speakers for your event to ensure maximum impact and attendee satisfaction.',
      author: 'Lisa Wang',
      date: '2023-12-20',
      category: 'speakers',
      tags: ['speakers', 'selection', 'content'],
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop',
      readTime: '4 min read'
    },
    {
      id: '6',
      title: 'Measuring Event Success: Key Metrics to Track',
      excerpt: 'Understand the essential metrics and KPIs that help you measure and improve your event performance.',
      author: 'Alex Thompson',
      date: '2023-12-15',
      category: 'analytics',
      tags: ['analytics', 'metrics', 'performance'],
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      readTime: '9 min read'
    }
  ]

  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'technology', label: 'Technology' },
    { value: 'virtual-events', label: 'Virtual Events' },
    { value: 'community', label: 'Community' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'speakers', label: 'Speakers' },
    { value: 'analytics', label: 'Analytics' }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing {filteredPosts.length} of {blogPosts.length} articles
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('blog.readMore')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No articles found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
