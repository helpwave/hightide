import type { ComponentRef, Ref } from 'react'
import type { ControllableStateInputProps } from '@helpwave/hightide-utils/interfaces'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { CheckboxIcon, type CheckboxIconProps } from './CheckboxIcon'
import { CheckboxStateManager } from './CheckboxStateManager'
import { CheckboxTrigger, type CheckboxSize, type CheckboxTriggerProps } from './CheckboxTrigger'
import type { CheckboxEvent, CheckboxState } from './CheckboxState'

export type CheckboxProps = ControllableStateInputProps<CheckboxState, CheckboxEvent>
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
  indeterminate = false,
  size = 'md',
  alwaysShowCheckIcon = false,
  isRounded = false,
  triggerRef,
  triggerProps,
  iconRef,
  iconProps,
  ...stateManagerProps
}: CheckboxProps) => {
  return (
    <CheckboxStateManager {...stateManagerProps}>
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
