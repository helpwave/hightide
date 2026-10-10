import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { CheckboxIcon, type CheckboxIconProps } from './CheckboxIcon'
import { CheckboxStateManager } from './CheckboxStateManager'
import { CheckboxTrigger, type CheckboxSize, type CheckboxTriggerProps } from './CheckboxTrigger'
import type { CheckboxEvent, CheckboxState } from './CheckboxState'

export type CheckboxProps = ControllableInputProps<boolean, CheckboxEvent>
  & {
    indeterminate?: boolean,
    size?: CheckboxSize,
    alwaysShowCheckIcon?: boolean,
    isRounded?: boolean,
    triggerRef?: Ref<ComponentRef<typeof CheckboxTrigger>>,
    triggerProps?: CheckboxTriggerProps,
    iconRef?: Ref<ComponentRef<typeof CheckboxIcon>>,
    iconProps?: CheckboxIconProps,
  }

const CheckboxComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  indeterminate = false,
  size = 'md',
  alwaysShowCheckIcon = false,
  isRounded = false,
  triggerRef,
  triggerProps,
  iconRef,
  iconProps,
}: CheckboxProps) => {
  const [state, setState] = useControlledState<CheckboxState>({
    defaultValue: { value: initialValue ?? false },
  })
  const valueBinding = useStateMachineBinding<CheckboxState, boolean>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: boolean) => ({ value: next }), []),
    get: useCallback((current: CheckboxState) => current.value, []),
  })

  return (
    <CheckboxStateManager
      state={valueBinding.state}
      onStateChange={valueBinding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      <CheckboxTrigger
        ref={ReactUtils.assingRefsBuilder([triggerRef])}
        indeterminate={indeterminate}
        size={size}
        isRounded={isRounded}
        {...triggerProps}
      >
        <CheckboxIcon
          ref={ReactUtils.assingRefsBuilder([iconRef])}
          indeterminate={indeterminate}
          size={size}
          alwaysShowCheckIcon={alwaysShowCheckIcon}
          {...iconProps}
        />
      </CheckboxTrigger>
    </CheckboxStateManager>
  )
}

export const Checkbox = Object.assign(CheckboxComponent, {
  StateManager: CheckboxStateManager,
  Trigger: CheckboxTrigger,
  Icon: CheckboxIcon,
})
