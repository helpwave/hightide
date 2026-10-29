import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { SwitchStateManager } from './SwitchStateManager'
import { SwitchThumb, type SwitchThumbProps } from './SwitchThumb'
import { SwitchTrack, type SwitchTrackProps } from './SwitchTrack'
import { SwitchTrigger, type SwitchTriggerProps } from './SwitchTrigger'
import type { SwitchEvent, SwitchState } from './SwitchState'

export type SwitchProps = ControllableInputProps<boolean, SwitchEvent>
  & {
    triggerRef?: Ref<ComponentRef<typeof SwitchTrigger>>,
    triggerProps?: SwitchTriggerProps,
    trackRef?: Ref<ComponentRef<typeof SwitchTrack>>,
    trackProps?: SwitchTrackProps,
    thumbRef?: Ref<ComponentRef<typeof SwitchThumb>>,
    thumbProps?: SwitchThumbProps,
  }

const SwitchComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  triggerRef,
  triggerProps,
  trackRef,
  trackProps,
  thumbRef,
  thumbProps,
}: SwitchProps) => {
  const [state, setState] = useControlledState<SwitchState>({
    defaultValue: { value: initialValue ?? false },
  })
  const valueBinding = useStateMachineBinding<SwitchState, boolean>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: boolean) => ({ value: next }), []),
    get: useCallback((current: SwitchState) => current.value, []),
  })

  return (
    <SwitchStateManager
      state={valueBinding.state}
      onStateChange={valueBinding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      <SwitchTrigger
        ref={ReactUtils.assingRefsBuilder([triggerRef])}
        {...triggerProps}
      >
        <SwitchTrack
          ref={ReactUtils.assingRefsBuilder([trackRef])}
          {...trackProps}
        >
          <SwitchThumb
            ref={ReactUtils.assingRefsBuilder([thumbRef])}
            {...thumbProps}
          />
        </SwitchTrack>
      </SwitchTrigger>
    </SwitchStateManager>
  )
}

export const Switch = Object.assign(SwitchComponent, {
  StateManager: SwitchStateManager,
  Trigger: SwitchTrigger,
  Track: SwitchTrack,
  Thumb: SwitchThumb,
})
