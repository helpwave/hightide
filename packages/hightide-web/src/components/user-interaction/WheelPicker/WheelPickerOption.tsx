import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { useLayoutEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'

import { useWheelPickerContext } from './WheelPickerContext'

export type WheelPickerOptionProps<T = string> = (
  T extends string
    ? {
        valueId?: undefined,
        value: T,
      }
    : {
        valueId: string,
        value: T,
      }
) & Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'valueId'> & {
  children?: ReactNode,
}

type WheelPickerOptionComponent = <T = string>(props: WheelPickerOptionProps<T>) => ReactElement | null

function toIdentity<T>(value: T, valueId: string | undefined) {
  if (valueId === undefined) {
    return { value, id: value as string }
  }
  return { value, id: valueId }
}

function WheelPickerOptionImpl<T>({
  value,
  valueId,
  className,
  children,
  onClick,
  ...props
}: WheelPickerOptionProps<T>) {
  const { disabled: rootDisabled, value: selected, registerOption, selectValue } = useWheelPickerContext<T>()
  const ref = useRef<HTMLDivElement>(null)
  const identity = useMemo(() => toIdentity(value, valueId), [value, valueId])
  const isSelected = Object.is(selected, value)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }
    return registerOption({ id: identity.id, value, element })
  }, [identity, registerOption, value])

  return (
    <div
      {...props}
      ref={ref}
      id={identity.id}
      role="option"
      aria-selected={isSelected}
      data-selected={isSelected ? '' : undefined}
      className={clsx('wheel-picker-option', className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || rootDisabled) {
          return
        }
        selectValue(value)
      }}
    >
      {children ?? (valueId === undefined ? value as string : null)}
    </div>
  )
}

const WheelPickerOption = WheelPickerOptionImpl as WheelPickerOptionComponent

export { WheelPickerOption }
