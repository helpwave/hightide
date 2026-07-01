'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'
const useIsomorphicEffect = isClient ? useLayoutEffect : useEffect

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false)

  useIsomorphicEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])
  return isMounted
}