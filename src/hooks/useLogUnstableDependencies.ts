import React from 'react'

export function useLogUnstableDependencies<T extends Record<string, unknown>>(name: string, value: T) {
  const prev = React.useRef<T | null>(null)

  React.useEffect(() => {
    if (!prev.current) {
      prev.current = value
      return
    }

    const changes: Record<string, { prev: unknown, next: unknown }> = {}

    for (const key of Object.keys(value)) {
      if (prev.current[key] !== value[key]) {
        changes[key] = {
          prev: prev.current[key],
          next: value[key],
        }
      }
    }

    if (Object.keys(changes).length > 0) {
      console.log(`[${name}] changed`, changes)
    }

    prev.current = value
  })
}
