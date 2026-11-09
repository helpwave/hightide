import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type MultiTagsFilterLayoutProps = HTMLAttributes<HTMLDivElement>

export const MultiTagsFilterLayout = forwardRef<HTMLDivElement, MultiTagsFilterLayoutProps>(function MultiTagsFilterLayout(
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
