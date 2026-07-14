import { useCallback, useEffect, useRef, useState } from 'react'


export interface UsePresenceRefProps {
  isOpen?: boolean,
}

export const usePresenceRef = <T extends HTMLElement>({
  isOpen = true,
}: UsePresenceRefProps) => {
  const [isPresent, setIsPresent] = useState(false)
  const ref = useRef<T>(null)

  const refAssignment = useCallback((node: T | null) => {
    ref.current = node
    setIsPresent(prev => prev || !!node)
  }, [])


  useEffect(() => {
    if(!isOpen) {
      setIsPresent(false)
    }
  }, [isOpen])

  return {
    isPresent,
    ref,
    refAssignment,
  }
}