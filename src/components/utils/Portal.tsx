import type { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps extends PropsWithChildren {
  container?: HTMLElement,
}

export const Portal = ({ children, container }: PortalProps) => {
  return createPortal(children, container ?? document.body)
}