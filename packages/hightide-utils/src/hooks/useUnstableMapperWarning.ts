import { useEffect, useRef } from 'react'

const UNSTABLE_MAPPER_MS = 1000

export const useUnstableMapperWarning = (
  hookName: string,
  mapperName: string,
  mapper: unknown,
  disabled: boolean = false
): void => {
  const lastChangedAtRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (disabled) {
      return
    }

    const now = Date.now()
    const lastChangedAt = lastChangedAtRef.current

    if (lastChangedAt !== undefined && now - lastChangedAt < UNSTABLE_MAPPER_MS) {
      console.warn(
        `[${hookName}] "${mapperName}" changed within ${UNSTABLE_MAPPER_MS}ms. ` +
        'Stabilize mapping functions with useCallback or move them outside the component.'
      )
    }

    lastChangedAtRef.current = now
  }, [disabled, hookName, mapperName, mapper])
}
