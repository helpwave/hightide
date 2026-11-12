import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { CheckboxContext } from './CheckboxContext'
import { CheckboxIcon, type CheckboxIconProps } from './CheckboxIcon'
import { CheckboxStateManager, type CheckboxStateManagerProps } from './CheckboxStateManager'
import { CheckboxTrigger, type CheckboxSize, type CheckboxTriggerProps } from './CheckboxTrigger'

export type CheckboxProps = Omit<CheckboxStateManagerProps, 'children'>
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
  ...props
}: CheckboxProps) => {
  return (
    <CheckboxStateManager {...props}>
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
  Context: CheckboxContext,
  Provider: CheckboxContext.Provider,
  Consumer: CheckboxContext.Consumer,
})
