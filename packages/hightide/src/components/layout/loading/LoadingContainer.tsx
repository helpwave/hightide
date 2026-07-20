import { clsx } from 'clsx'

export type LoadingComponentProps = {
  className?: string,
}

export const LoadingContainer = ({ className }: LoadingComponentProps) => {
  return (
    <div className={clsx('relative overflow-hidden shimmer bg-disabled/30 rounded-md', className)}/>
  )
}