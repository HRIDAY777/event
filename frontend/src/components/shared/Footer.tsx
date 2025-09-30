import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/hooks/useTranslation'

export function Footer() {
  const { t } = useTranslation()

  const footerLinks = [
    { href: '/about', label: t('footer.links.about') },
    { href: '/privacy', label: t('footer.links.privacy') },
    { href: '/terms', label: t('footer.links.terms') },
    { href: '/support', label: t('footer.links.support') },
  ]

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">U</span>
              </div>
              <span className="font-bold text-xl text-foreground">Uservice</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              The ultimate multi-theme event and service platform. Create, manage, and host amazing events with our comprehensive suite of tools.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t('footer.newsletter.title')}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('footer.newsletter.subtitle')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  className="flex-1"
                />
                <Button size="sm">
                  {t('footer.newsletter.subscribe')}
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: hello@uservice.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Event Street, City, Country</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Uservice. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
