import type { SystemTheme } from '@helpwave/hightide-utils/context/theme'
import { useEffect, useState } from 'react'

const detectWebSystemTheme = (): SystemTheme | undefined => {
  if (typeof window === 'undefined') return undefined
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return undefined
}

export const useWebSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<SystemTheme | undefined>(
    () => (detectWebSystemTheme())
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateSystemTheme = () => {
      setSystemTheme(detectWebSystemTheme())
    }

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)')
    const noPrefQuery = window.matchMedia('(prefers-color-scheme: no-preference)')

    darkQuery.addEventListener('change', updateSystemTheme)
    lightQuery.addEventListener('change', updateSystemTheme)
    noPrefQuery.addEventListener('change', updateSystemTheme)

    return () => {
      darkQuery.removeEventListener('change', updateSystemTheme)
      lightQuery.removeEventListener('change', updateSystemTheme)
      noPrefQuery.removeEventListener('change', updateSystemTheme)
    }
  }, [])

  return systemTheme
}