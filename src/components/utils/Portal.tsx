import { createPortal } from 'react-dom'

export type PortalProps = {
  children: React.ReactNode,
  container?: HTMLElement,
}

export const Portal = ({ children, container }: PortalProps) => {
  return createPortal(children, container ?? document.body)
}