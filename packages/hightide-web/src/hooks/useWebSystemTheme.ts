import type { SystemTheme } from '@helpwave/hightide-utils/context/theme'
import { useEffect, useState } from 'react'
import { SafeGlobals } from '../utils/safeGlobals'

const detectWebSystemTheme = (): SystemTheme | undefined => {
  const win = SafeGlobals.window('useWebSystemTheme.detect')
  if (!win) return undefined
  if (win.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  if (win.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return undefined
}

export const useWebSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<SystemTheme | undefined>(undefined)

  useEffect(() => {
    const updateSystemTheme = () => {
      setSystemTheme(detectWebSystemTheme())
    }

    updateSystemTheme()

    const win = SafeGlobals.window('useWebSystemTheme')
    if (!win) return

    const darkQuery = win.matchMedia('(prefers-color-scheme: dark)')
    const lightQuery = win.matchMedia('(prefers-color-scheme: light)')
    const noPrefQuery = win.matchMedia('(prefers-color-scheme: no-preference)')

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
