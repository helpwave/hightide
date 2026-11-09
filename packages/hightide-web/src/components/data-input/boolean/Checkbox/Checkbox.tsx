import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { CheckboxIcon, type CheckboxIconProps } from './CheckboxIcon'
import { CheckboxStateManager } from './CheckboxStateManager'
import { CheckboxTrigger, type CheckboxSize, type CheckboxTriggerProps } from './CheckboxTrigger'
import { type CheckboxEvent, type CheckboxState } from './CheckboxState'

export type CheckboxProps = ControllableDOMInputProps<boolean, CheckboxEvent>
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
  id,
  indeterminate = false,
  size = 'md',
  alwaysShowCheckIcon = false,
  isRounded = false,
  triggerRef,
  triggerProps,
  iconRef,
  iconProps,
}: CheckboxProps) => {
  const store = useStateStore<CheckboxState>({
    value: value ?? initialValue ?? false,
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })

  return (
    <CheckboxStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
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
