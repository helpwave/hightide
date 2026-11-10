import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { PropsUtil } from '../../../utils/propsUtil'
import { useAppPageContext } from './AppPageContext'

export type AppPageMainProps = HTMLAttributes<HTMLElement>

export const AppPageMain = forwardRef<HTMLElement, AppPageMainProps>(
  function AppPageMain({ className, ...props }, forwardedRef) {
    const { noScrolling, hasSpacer } = useAppPageContext()

    return (
      <main
        {...props}
        ref={forwardedRef}
        className={clsx('app-page-main-content', className)}
        data-outer-no-scrolling={PropsUtil.dataAttributes.bool(noScrolling)}
        data-bottom-spacer={PropsUtil.dataAttributes.bool(hasSpacer)}
      />
    )
  }
)
