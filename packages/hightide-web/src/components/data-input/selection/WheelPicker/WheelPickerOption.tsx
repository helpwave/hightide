import type { HTMLAttributes, ReactElement, Ref } from 'react'
import clsx from 'clsx'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

import type { SelectionOptionData } from '../option'
import { useWheelPickerContext } from './WheelPickerContext'

export type WheelPickerOptionProps<T = string> = Omit<HTMLAttributes<HTMLDivElement>, 'value'> & {
  option: SelectionOptionData<T>,
}

type WheelPickerOptionComponent = <T = string>(
  props: WheelPickerOptionProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null

function WheelPickerOptionImpl<T>({
  option,
  className,
  onClick,
  ref,
  ...props
}: WheelPickerOptionProps<T> & { ref?: Ref<HTMLDivElement> }) {
  const { state, config, isPreview, optionElementsRef, actionsRef } = useWheelPickerContext<T>()
  const isLocked = config.isDisabled || config.isReadOnly || Boolean(option.disabled)
  const isSelected = !isPreview && Object.is(state.value, option.value)

  return (
    <div
      {...props}
      ref={ReactUtils.assingRefsBuilder([
        ref,
        (element) => {
          if (isPreview) {
            return
          }
          optionElementsRef.current[option.id] = element
        },
      ])}
      id={isPreview ? undefined : option.id}
      role={isPreview ? undefined : 'option'}
      aria-selected={isPreview ? undefined : isSelected}
      data-selected={isSelected ? '' : undefined}
      className={clsx('wheel-picker-option', className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || isLocked) {
          return
        }
        actionsRef.current.selectValue(option.value)
      }}
    >
      {option.visual?.content ?? option.label}
    </div>
  )
}

const WheelPickerOption = WheelPickerOptionImpl as WheelPickerOptionComponent

export { WheelPickerOption }
