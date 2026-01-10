import type { RefObject } from 'react'
import { useEffect } from 'react'

export type UseOutsideClickProps = {
  refs: RefObject<HTMLElement>[],
  handler: () => void,
  active?: boolean,
}
export const useOutsideClick = ({ refs, handler, active = true }: UseOutsideClickProps) => {
  useEffect(() => {
    if (!active) return

    const listener = (event: MouseEvent | TouchEvent) => {
      // returning means not "not clicking outside"

      // if no target exists, return
      if (event.target === null) return

      // if the target is a ref's element or descendent thereof, return
      if (refs.some((ref) => ref.current && ref.current.contains(event.target as Node))) {
        return
      }

      handler()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    document.addEventListener('pointerdown', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
      document.removeEventListener('pointerdown', listener)
    }
  }, [refs, handler, active])
}
