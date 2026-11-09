import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type TextFilterLayoutProps = HTMLAttributes<HTMLDivElement>

export const TextFilterLayout = forwardRef<HTMLDivElement, TextFilterLayoutProps>(function TextFilterLayout(
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
