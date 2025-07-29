import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useIsMounted } from '@/src/hooks/focus/useIsMounted'
import { useFocusGuards } from '@/src/hooks/focus/useFocusGuards'

export type UseFocusTrapProps = {
  container: MutableRefObject<HTMLElement>,
  active?: boolean,
  initialFocus?: MutableRefObject<HTMLElement>,
}

export const useFocusTrap = ({
                               container,
                               active = true,
                               initialFocus
                             }: UseFocusTrapProps) => {
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const isMounted = useIsMounted()

  useFocusGuards()

  useEffect(() => {
    if (active && isMounted) {
      function onFocusIn(event: FocusEvent) {
        console.log('active')
        if (!container.current?.contains(event.target as HTMLElement)) {
          if (initialFocus?.current) {
            initialFocus.current.focus()
          } else {
            const elements = container.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
            if (elements && elements.length > 0) {
              const first = elements.item(0) as HTMLElement
              const last = elements.item(elements.length - 1) as HTMLElement
              first.focus()
            }
          }
        }
      }

      document.addEventListener('focusin', onFocusIn)
      return () => document.removeEventListener('focusin', onFocusIn)
    }
  }, [active, container, initialFocus, isMounted])
}