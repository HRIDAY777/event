import { Moon, Sun, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme/use-theme'

export function ThemeToggle() {
  const { mode, setMode } = useTheme()

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark')
    } else if (mode === 'dark') {
      setMode('auto')
    } else {
      setMode('light')
    }
  }

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'auto':
        return <Palette className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMode}
      className="p-2"
      title={`Current mode: ${mode}`}
    >
      {getIcon()}
    </Button>
  )
}
