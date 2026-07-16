import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

export type ElementHandle = Record<string, HTMLElement | null>

export function useHandleRefs<T extends ElementHandle>(
  handleRef: RefObject<T>
): RefObject<HTMLElement | null>[] {
  const refs = useRef<RefObject<HTMLElement | null>[]>([])

  useEffect(() => {
    refs.current = Object.keys(handleRef?.current ?? {}).map(
      () => ({ current: null })
    )
    const values = Object.values(handleRef?.current ?? {})
    values.forEach((el, i) => {
      refs.current[i].current = el
    })
  })

  return refs.current
}
