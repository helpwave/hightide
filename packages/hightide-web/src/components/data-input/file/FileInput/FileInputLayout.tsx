import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type FileInputLayoutProps = HTMLAttributes<HTMLDivElement>

export const FileInputLayout = forwardRef<HTMLDivElement, FileInputLayoutProps>(function FileInputLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('file-input', props.className)}
    />
  )
})
