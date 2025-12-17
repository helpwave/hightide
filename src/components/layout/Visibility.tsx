import type { PropsWithChildren } from 'react'

export type VisibilityProps = PropsWithChildren & {
  isVisible?: boolean,
}

export function Visibility({ children, isVisible }: VisibilityProps) {
  return (<>{isVisible && children}</>)
}