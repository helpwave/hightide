import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SafeGlobals } from '../../utils/safeGlobals'

export interface PortalProps extends PropsWithChildren {
  container?: HTMLElement,
}

export const Portal = ({ children, container }: PortalProps): ReactNode => {
  const [fallback, setFallback] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (container) return
    setFallback(SafeGlobals.document('Portal')?.body ?? null)
  }, [container])

  const target = container ?? fallback
  if (!target) return null
  return createPortal(children, target)
}
