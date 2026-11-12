import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { forwardRef, useId } from 'react'
import clsx from 'clsx'

import { useWheelPickerContext } from './WheelPickerContext'
import { visibleRowSpan } from './wheelPickerMotion'

export type WheelPickerLayoutProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>

export const WheelPickerLayout = forwardRef(function WheelPickerLayout({
  className,
  children,
  onKeyDown,
  style,
  ...props
}: WheelPickerLayoutProps, forwardedRef: Ref<HTMLDivElement>) {
  const { state, config, options, actionsRef } = useWheelPickerContext<unknown>()
  const generatedId = useId()
  const listboxId = config.id ?? generatedId
  const isLocked = config.isDisabled || config.isReadOnly
  const rowSpan = visibleRowSpan(config.visibleRows)
  const activeId = options.find((option) => Object.is(option.value, state.value))?.id
  const pickerStyle = {
    ...style,
    '--wheel-picker-visible-span': rowSpan,
  } as CSSProperties

  return (
    <div
      {...props}
      ref={forwardedRef}
      id={listboxId}
      role="listbox"
      tabIndex={config.isDisabled ? -1 : 0}
      aria-disabled={config.isDisabled || undefined}
      aria-invalid={config.isInvalid || undefined}
      aria-readonly={config.isReadOnly || undefined}
      aria-required={config.isRequired || undefined}
      aria-orientation="vertical"
      aria-activedescendant={activeId}
      data-disabled={config.isDisabled ? '' : undefined}
      data-invalid={config.isInvalid ? '' : undefined}
      data-readonly={config.isReadOnly ? '' : undefined}
      data-required={config.isRequired ? '' : undefined}
      data-looping={config.isLooping ? '' : undefined}
      className={clsx('wheel-picker-root', className)}
      style={pickerStyle}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || isLocked) {
          return
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          actionsRef.current.stepBy(1)
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          actionsRef.current.stepBy(-1)
        } else if (event.key === 'Home') {
          event.preventDefault()
          actionsRef.current.moveSelection('start')
        } else if (event.key === 'End') {
          event.preventDefault()
          actionsRef.current.moveSelection('end')
        }
      }}
    >
      {children}
    </div>
  )
})
