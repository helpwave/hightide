import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type NumberFilterLayoutProps = HTMLAttributes<HTMLDivElement>

export const NumberFilterLayout = forwardRef<HTMLDivElement, NumberFilterLayoutProps>(function NumberFilterLayout(
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
