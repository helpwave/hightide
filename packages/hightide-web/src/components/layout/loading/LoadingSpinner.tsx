import { LoaderCircle } from 'lucide-react'
import clsx from 'clsx'
import { Icon } from '../../display-and-visualization/Icon'

export type LoadingSpinnerProps = {
  className?: string,
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <Icon
      icon={LoaderCircle}
      size="xs"
      className={clsx('animate-spin', className)}
      aria-hidden
    />
  )
}
