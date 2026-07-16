import type { RefObject } from 'react'
import React, { useEffect } from 'react'

export const useFocusOnceVisible = (
  ref: RefObject<HTMLElement>,
  disable: boolean = false
) => {
  const [hasUsedFocus, setHasUsedFocus] = React.useState(false)

  useEffect(() => {
    if (disable || hasUsedFocus) {
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasUsedFocus) {
        ref.current?.focus()
        setHasUsedFocus(hasUsedFocus)
      }
    }, {
      threshold: 0.1,
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [disable, hasUsedFocus, ref])
}