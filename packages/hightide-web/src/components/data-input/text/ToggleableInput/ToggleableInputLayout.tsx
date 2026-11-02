import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { useToggleableInputContext } from './ToggleableInputContext'

export type ToggleableInputLayoutProps = HTMLAttributes<HTMLDivElement>

export const ToggleableInputLayout = forwardRef<HTMLDivElement, ToggleableInputLayoutProps>(function ToggleableInputLayout(
  props,
  forwardedRef
) {
  const { state } = useToggleableInputContext()

  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('relative flex-row-2', { 'flex-1': state.isEditing }, props.className)}
    />
  )
})
