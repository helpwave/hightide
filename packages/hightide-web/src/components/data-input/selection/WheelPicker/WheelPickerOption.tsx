import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { createContext, useContext, useLayoutEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'

import { useWheelPickerContext, useWheelPickerListContext } from './WheelPickerContext'

const WheelPickerPreviewContext = createContext(false)

export function WheelPickerPreviewScope({ children }: { children: ReactNode }) {
  return (
    <WheelPickerPreviewContext.Provider value={true}>
      {children}
    </WheelPickerPreviewContext.Provider>
  )
}

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
  const isPreview = useContext(WheelPickerPreviewContext)
  const { state, config } = useWheelPickerContext<T>()
  const { registerOption, selectValue } = useWheelPickerListContext<T>()
  const isLocked = config.isDisabled || config.isReadOnly
  const ref = useRef<HTMLDivElement>(null)
  const identity = useMemo(() => toIdentity(value, valueId), [value, valueId])
  const isSelected = !isPreview && Object.is(state.value, value)

  useLayoutEffect(() => {
    if (isPreview) {
      return
    }
    const element = ref.current
    if (!element) {
      return
    }
    return registerOption({ id: identity.id, value, element })
  }, [identity, isPreview, registerOption, value])

  return (
    <div
      {...props}
      ref={ref}
      id={isPreview ? undefined : identity.id}
      role={isPreview ? undefined : 'option'}
      aria-selected={isPreview ? undefined : isSelected}
      data-selected={isSelected ? '' : undefined}
      className={clsx('wheel-picker-option', className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || isLocked) {
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
