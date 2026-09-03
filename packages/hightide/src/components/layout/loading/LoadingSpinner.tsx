import { LoaderCircle } from 'lucide-react'
import clsx from 'clsx'

export type LoadingSpinnerProps = {
  className?: string,
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <LoaderCircle className={clsx('size-4 animate-spin', className)} aria-hidden />
  )
}
