import clsx from 'clsx'
import { Check, Minus } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { IconSize } from '../../visualization/Icon'
import { Icon } from '../../visualization/Icon'
import { useCheckboxContext } from './CheckboxContext'
import type { CheckboxSize } from './CheckboxTrigger'

export type CheckboxIconProps = HTMLAttributes<HTMLSpanElement> & {
  indeterminate?: boolean,
  size?: CheckboxSize,
  alwaysShowCheckIcon?: boolean,
}

const indicatorSizeFor = (size: CheckboxSize): IconSize => {
  if (size === 'lg') {
    return 'md'
  }
  return 'sm'
}

export const CheckboxIcon = forwardRef<HTMLSpanElement, CheckboxIconProps>(function CheckboxIcon({
  indeterminate = false,
  size = 'md',
  alwaysShowCheckIcon = false,
  ...props
}, forwardedRef) {
  const { state } = useCheckboxContext()
  const showsIndeterminate = indeterminate
  const showsCheck = !indeterminate && (alwaysShowCheckIcon || state.value)

  if (!showsIndeterminate && !showsCheck) {
    return null
  }

  return (
    <span
      {...props}
      ref={forwardedRef}
      className={clsx('contents', props.className)}
    >
      <Icon
        icon={showsIndeterminate ? Minus : Check}
        size={indicatorSizeFor(size)}
        className="checkbox-indicator"
        aria-hidden={true}
      />
    </span>
  )
})
