import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type InsideLabelInputLayoutProps = HTMLAttributes<HTMLDivElement>

export const InsideLabelInputLayout = forwardRef<HTMLDivElement, InsideLabelInputLayoutProps>(function InsideLabelInputLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('relative', props.className)}
    />
  )
})
