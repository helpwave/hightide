import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type TabSwitcherLayoutProps = HTMLAttributes<HTMLDivElement>

export const TabSwitcherLayout = forwardRef<HTMLDivElement, TabSwitcherLayoutProps>(function TabSwitcherLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('tab-view', props.className)}
    />
  )
})
