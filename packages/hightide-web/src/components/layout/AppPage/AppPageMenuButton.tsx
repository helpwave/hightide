import clsx from 'clsx'
import { forwardRef } from 'react'
import {
  FullScreenVerticalNavigation,
  type FullScreenVerticalNavigationTriggerProps
} from '../../interaction/navigation/FullScreenVerticalNavigation'

export type AppPageMenuButtonProps = FullScreenVerticalNavigationTriggerProps

export const AppPageMenuButton = forwardRef<HTMLButtonElement, AppPageMenuButtonProps>(
  function AppPageMenuButton({ className, ...props }, forwardedRef) {
    return (
      <FullScreenVerticalNavigation.Trigger
        {...props}
        ref={forwardedRef}
        className={clsx('app-page-menu-button', className)}
      />
    )
  }
)
