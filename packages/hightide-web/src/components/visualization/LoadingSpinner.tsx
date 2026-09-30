import { LoaderCircle } from 'lucide-react'
import clsx from 'clsx'
import type { IconSize } from './Icon'
import { Icon } from './Icon'

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
