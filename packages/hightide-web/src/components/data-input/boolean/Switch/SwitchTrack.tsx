import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type SwitchTrackProps = HTMLAttributes<HTMLDivElement>

export const SwitchTrack = forwardRef<HTMLDivElement, SwitchTrackProps>(function SwitchTrack({
  children,
  ...props
}, forwardedRef) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('switch-track', props.className)}
    >
      {children}
    </div>
  )
})
