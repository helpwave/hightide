import clsx from 'clsx'
import type { ElementType } from 'react'
import { forwardRef } from 'react'
import { ColoringUtils } from '../../../../utils/coloring'
import {
  type BreadCrumbLinkElementProps,
  useBreadCrumbsContext
} from './BreadCrumbsContext'

export type { BreadCrumbLinkElementProps }

export type BreadCrumbsLinkProps = BreadCrumbLinkElementProps & {
  LinkElement?: ElementType<BreadCrumbLinkElementProps>,
}

export const BreadCrumbsLink = forwardRef<HTMLAnchorElement, BreadCrumbsLinkProps>(
  function BreadCrumbsLink({ LinkElement, className, ...props }, forwardedRef) {
    const { LinkElement: contextLinkElement } = useBreadCrumbsContext()
    const Element = LinkElement ?? contextLinkElement ?? 'a'

    return (
      <Element
        {...props}
        ref={forwardedRef}
        {...ColoringUtils.build({ color: 'surface-inverse', mode: 'interactive', coloringStyle: 'foreground' })}
        className={clsx('breadcrumb-link', className)}
      />
    )
  }
)
