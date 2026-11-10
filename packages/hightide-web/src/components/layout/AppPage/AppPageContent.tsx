import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { PropsUtil } from '../../../utils/propsUtil'
import { useAppPageContext } from './AppPageContext'

export type AppPageContentProps = HTMLAttributes<HTMLDivElement>

export const AppPageContent = forwardRef<HTMLDivElement, AppPageContentProps>(
  function AppPageContent({ className, ...props }, forwardedRef) {
    const { noScrolling } = useAppPageContext()

    return (
      <div
        {...props}
        ref={forwardedRef}
        className={clsx('app-page-content', className)}
        data-no-scrolling={PropsUtil.dataAttributes.bool(noScrolling)}
      />
    )
  }
)
