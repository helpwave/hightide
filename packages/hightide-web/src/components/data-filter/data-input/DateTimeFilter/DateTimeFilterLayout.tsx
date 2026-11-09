import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type DateTimeFilterLayoutProps = HTMLAttributes<HTMLDivElement>

export const DateTimeFilterLayout = forwardRef<HTMLDivElement, DateTimeFilterLayoutProps>(function DateTimeFilterLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('flex-col-3', props.className)}
    />
  )
})
