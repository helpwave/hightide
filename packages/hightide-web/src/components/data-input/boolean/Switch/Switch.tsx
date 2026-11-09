import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useControllableStateStore, useStateStoreBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { SwitchStateManager } from './SwitchStateManager'
import { SwitchThumb, type SwitchThumbProps } from './SwitchThumb'
import { SwitchTrack, type SwitchTrackProps } from './SwitchTrack'
import { SwitchTrigger, type SwitchTriggerProps } from './SwitchTrigger'
import type { SwitchEvent, SwitchState } from './SwitchState'

export type SwitchProps = ControllableDOMInputProps<boolean, SwitchEvent>
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
  id,
  triggerRef,
  triggerProps,
  trackRef,
  trackProps,
  thumbRef,
  thumbProps,
}: SwitchProps) => {
  const { store, onStateChange } = useControllableStateStore<SwitchState>({
    initialState: { value: initialValue ?? false },
  })
  useStateStoreBinding({
    store,
    key: 'value',
    value,
    onValueChange,
  })

  return (
    <SwitchStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
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
