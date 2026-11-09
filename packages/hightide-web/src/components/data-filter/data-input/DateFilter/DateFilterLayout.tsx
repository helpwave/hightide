import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type DateFilterLayoutProps = HTMLAttributes<HTMLDivElement>

export const DateFilterLayout = forwardRef<HTMLDivElement, DateFilterLayoutProps>(function DateFilterLayout(
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
