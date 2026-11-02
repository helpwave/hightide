import type { AnchorHTMLAttributes, ElementType } from 'react'
import { createContext, useContext } from 'react'

export type BreadCrumbLinkElementProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export type BreadCrumbsContextValue = {
  LinkElement?: ElementType<BreadCrumbLinkElementProps>,
}

export const BreadCrumbsContext = createContext<BreadCrumbsContextValue | null>(null)

export function useBreadCrumbsContext(): BreadCrumbsContextValue {
  const context = useContext(BreadCrumbsContext)
  if (!context) {
    throw new Error('useBreadCrumbsContext must be used inside a BreadCrumbs')
  }
  return context
}
