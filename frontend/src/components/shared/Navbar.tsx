import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { LangToggle } from './LangToggle'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()
  const { isAuthenticated, user, logout } = useAuth()

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/events', label: t('nav.events') },
    { href: '/wedding', label: t('nav.wedding') },
    { href: '/speakers', label: t('nav.speakers') },
    { href: '/schedule', label: t('nav.schedule') },
    { href: '/tickets', label: t('nav.tickets') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/admin', label: t('nav.admin') },
  ]

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-xl text-foreground">Uservice</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <LangToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.firstName}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <LangToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-primary hover:bg-accent ${
                    location.pathname === item.href
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
                             <div className="pt-4">
                 {isAuthenticated ? (
                   <div className="space-y-2">
                     <div className="text-sm text-muted-foreground text-center">
                       Welcome, {user?.firstName}
                     </div>
                     <Button 
                       variant="outline" 
                       className="w-full"
                       onClick={logout}
                     >
                       <LogOut className="w-4 h-4 mr-2" />
                       Logout
                     </Button>
                   </div>
                 ) : (
                   <div className="space-y-2">
                     <Link to="/login">
                       <Button variant="outline" className="w-full">Sign In</Button>
                     </Link>
                     <Link to="/register">
                       <Button className="w-full">Get Started</Button>
                     </Link>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
