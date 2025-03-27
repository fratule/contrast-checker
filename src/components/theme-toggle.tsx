'use client'

import { useTheme } from './theme-provider'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const getIcon = () => {
    return theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
  }

  const getLabel = () => {
    return theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
      title={getLabel()}
      aria-label={getLabel()}
    >
      {getIcon()}
    </Button>
  )
}