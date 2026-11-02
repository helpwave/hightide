import clsx from 'clsx'
import type { LabelHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useInsideLabelInputContext } from './InsideLabelInputContext'

export type InsideLabelInputLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  label: ReactNode,
}

export const InsideLabelInputLabel = forwardRef<HTMLLabelElement, InsideLabelInputLabelProps>(function InsideLabelInputLabel({
  label,
  ...props
}, forwardedRef) {
  const { state } = useInsideLabelInputContext()
  const isRaised = state.isFocused || !!state.value

  return (
    <label
      {...props}
      ref={forwardedRef}
      aria-hidden={true}
      data-display={isRaised ? 'small' : 'full'}
      className={clsx(
        'absolute left-4 ml-0.5 top-2 transition-all delay-25 pointer-events-none touch-none',
        'data-[display=small]:top-2 data-[display=small]:h-force-4.5 data-[display=small]:typography-caption-sm data-[display=small]:overflow-y-hidden',
        'data-[display=full]:top-1/2 data-[display=full]:-translate-y-1/2 data-[display=full]:typography-body-md',
        props.className
      )}
    >
      {label}
    </label>
  )
})
