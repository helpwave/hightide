import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type ColorInputLayoutProps = HTMLAttributes<HTMLDivElement>

export const ColorInputLayout = forwardRef<HTMLDivElement, ColorInputLayoutProps>(function ColorInputLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('color-input-container', props.className)}
    />
  )
})
