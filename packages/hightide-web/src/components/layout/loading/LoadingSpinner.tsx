import { LoaderCircle } from 'lucide-react'
import clsx from 'clsx'
import type { IconSize } from '../../display-and-visualization/Icon'
import { Icon } from '../../display-and-visualization/Icon'

export type LoadingSpinnerProps = {
  className?: string,
  size?: IconSize,
}

export const LoadingSpinner = ({ className, size = 'xs' }: LoadingSpinnerProps) => {
  return (
    <Icon
      icon={LoaderCircle}
      size={size}
      className={clsx('animate-spin', className)}
      aria-hidden
    />
  )
}
