import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { PropsUtil } from '../../../utils/propsUtil'
import { useSwitchContext } from './SwitchContext'

export type SwitchThumbProps = HTMLAttributes<HTMLDivElement>

export const SwitchThumb = forwardRef<HTMLDivElement, SwitchThumbProps>(function SwitchThumb(
  props,
  forwardedRef
) {
  const { state } = useSwitchContext()

  return (
    <div
      {...props}
      ref={forwardedRef}
      data-active={PropsUtil.dataAttributes.bool(state.value)}
      className={clsx('switch-thumb', props.className)}
    />
  )
})
