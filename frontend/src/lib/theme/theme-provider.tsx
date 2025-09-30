import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'pink' | 'indigo' | 'emerald' | 'amber' | 'violet' | 'ocean' | 'ruby' | 'slate' | 'conference' | 'party' | 'corporate' | 'minimal'
export type Mode = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  mode: Mode
  setTheme: (theme: Theme) => void
  setMode: (mode: Mode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('pink')
  const [mode, setModeState] = useState<Mode>('auto')

  // Get theme from URL params, localStorage, or default
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlTheme = urlParams.get('theme') as Theme
    const urlMode = urlParams.get('mode') as Mode
    
    const storedTheme = localStorage.getItem('uservice-theme') as Theme
    const storedMode = localStorage.getItem('uservice-mode') as Mode
    
    const defaultTheme = import.meta.env.VITE_DEFAULT_THEME as Theme || 'pink'
    const defaultMode = import.meta.env.VITE_DEFAULT_MODE as Mode || 'auto'
    
    // Priority: URL > localStorage > API > env default
    const finalTheme = urlTheme || storedTheme || defaultTheme
    const finalMode = urlMode || storedMode || defaultMode
    
    setThemeState(finalTheme)
    setModeState(finalMode)
  }, [])

  // Apply theme and mode to HTML element
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-theme', theme)
    
    // Handle auto mode
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          html.classList.add('dark')
          html.classList.remove('light')
        } else {
          html.classList.add('light')
          html.classList.remove('dark')
        }
      }
      
      if (mediaQuery.matches) {
        html.classList.add('dark')
        html.classList.remove('light')
      } else {
        html.classList.add('light')
        html.classList.remove('dark')
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      if (mode === 'dark') {
        html.classList.add('dark')
        html.classList.remove('light')
      } else {
        html.classList.add('light')
        html.classList.remove('dark')
      }
    }
  }, [theme, mode])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('uservice-theme', newTheme)
  }

  const setMode = (newMode: Mode) => {
    setModeState(newMode)
    localStorage.setItem('uservice-mode', newMode)
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
