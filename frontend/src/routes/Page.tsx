import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

export function Page() {
  const { slug } = useParams()

  // Mock CMS page data - in real app this would come from API
  const pages: Record<string, any> = {
    'privacy': {
      title: 'Privacy Policy',
      content: `
        <h1>Privacy Policy</h1>
        <p>Last updated: January 15, 2024</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, register for an event, or contact us for support.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        
        <h2>3. Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.</p>
        
        <h2>6. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@uservice.com.</p>
      `
    },
    'terms': {
      title: 'Terms of Service',
      content: `
        <h1>Terms of Service</h1>
        <p>Last updated: January 15, 2024</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using Uservice, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials on Uservice for personal, non-commercial transitory viewing only.</p>
        
        <h2>3. Disclaimer</h2>
        <p>The materials on Uservice are provided on an 'as is' basis. Uservice makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        
        <h2>4. Limitations</h2>
        <p>In no event shall Uservice or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Uservice.</p>
        
        <h2>5. Revisions and Errata</h2>
        <p>The materials appearing on Uservice could include technical, typographical, or photographic errors. Uservice does not warrant that any of the materials on its website are accurate, complete or current.</p>
        
        <h2>6. Links</h2>
        <p>Uservice has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Uservice of the site.</p>
        
        <h2>7. Modifications</h2>
        <p>Uservice may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.</p>
      `
    },
    'support': {
      title: 'Support Center',
      content: `
        <h1>Support Center</h1>
        <p>We're here to help you get the most out of Uservice.</p>
        
        <h2>Getting Started</h2>
        <p>New to Uservice? Check out our getting started guide to learn the basics of creating and managing events.</p>
        
        <h2>Common Questions</h2>
        <h3>How do I create my first event?</h3>
        <p>Creating an event is easy! Simply click the "Create Event" button in your dashboard and follow the step-by-step wizard.</p>
        
        <h3>Can I customize the theme of my event?</h3>
        <p>Yes! Uservice offers multiple themes and customization options. You can choose from our pre-built themes or create a custom one.</p>
        
        <h3>How do I manage ticket sales?</h3>
        <p>Our ticket management system allows you to create different ticket types, set pricing, and track sales in real-time.</p>
        
        <h2>Contact Support</h2>
        <p>Can't find what you're looking for? Our support team is available 24/7 to help you.</p>
        <ul>
          <li>Email: support@uservice.com</li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>Live Chat: Available in your dashboard</li>
        </ul>
        
        <h2>Documentation</h2>
        <p>For detailed guides and API documentation, visit our <a href="/docs">documentation portal</a>.</p>
      `
    }
  }

  const page = pages[slug || '']

  if (!page) {
    return (
      <div className="min-h-screen py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-6">Page Not Found</h1>
            <p className="text-lg text-muted-foreground">
              The page you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
