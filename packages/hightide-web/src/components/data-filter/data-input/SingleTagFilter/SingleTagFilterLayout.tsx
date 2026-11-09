import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type SingleTagFilterLayoutProps = HTMLAttributes<HTMLDivElement>

export const SingleTagFilterLayout = forwardRef<HTMLDivElement, SingleTagFilterLayoutProps>(function SingleTagFilterLayout(
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
