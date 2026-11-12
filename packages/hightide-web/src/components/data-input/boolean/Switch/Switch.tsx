import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { SwitchStateManager, type SwitchStateManagerProps } from './SwitchStateManager'
import { SwitchThumb, type SwitchThumbProps } from './SwitchThumb'
import { SwitchTrack, type SwitchTrackProps } from './SwitchTrack'
import { SwitchTrigger, type SwitchTriggerProps } from './SwitchTrigger'
export type SwitchProps = Omit<SwitchStateManagerProps, 'children'>
  & {
    triggerRef?: Ref<ComponentRef<typeof SwitchTrigger>>,
    triggerProps?: SwitchTriggerProps,
    trackRef?: Ref<ComponentRef<typeof SwitchTrack>>,
    trackProps?: SwitchTrackProps,
    thumbRef?: Ref<ComponentRef<typeof SwitchThumb>>,
    thumbProps?: SwitchThumbProps,
  }

const SwitchComponent = ({
  triggerRef,
  triggerProps,
  trackRef,
  trackProps,
  thumbRef,
  thumbProps,
  ...props
}: SwitchProps) => {
  return (
    <SwitchStateManager {...props}>
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
