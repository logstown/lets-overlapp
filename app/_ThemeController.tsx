'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeController() {
  const [theme, setTheme] = useState<string>('light')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    setMounted(true)
  }, [])

  // Update theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Prevent flash of incorrect theme
  if (!mounted) {
    return (
      <label className='swap swap-rotate'>
        <input
          type='checkbox'
          className='theme-controller'
          checked={false}
          disabled
        />
        <SunIcon className='swap-on h-7 w-7' strokeWidth={1.5} />
        <MoonIcon className='swap-off h-7 w-7' strokeWidth={1.5} />
      </label>
    )
  }

  return (
    <label className='swap swap-rotate'>
      {/* this hidden checkbox controls the state */}
      <input
        type='checkbox'
        className='theme-controller'
        value='dark'
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />

      {/* sun icon */}
      <SunIcon className='swap-on h-7 w-7' strokeWidth={1.5} />

      {/* moon icon */}
      <MoonIcon className='swap-off h-7 w-7' strokeWidth={1.5} />
    </label>
  )
}
