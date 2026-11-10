import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type AppPageBodyProps = HTMLAttributes<HTMLDivElement>

export const AppPageBody = forwardRef<HTMLDivElement, AppPageBodyProps>(
  function AppPageBody({ className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        ref={forwardedRef}
        className={clsx('app-page-body', className)}
      />
    )
  }
)
