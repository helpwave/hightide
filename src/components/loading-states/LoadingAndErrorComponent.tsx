import type { PropsWithChildren, ReactNode } from 'react'
import { useState } from 'react'
import { LoadingContainer } from './LoadingContainer'
import { clsx } from 'clsx'

export type LoadingAndErrorComponentProps = PropsWithChildren<{
  isLoading?: boolean,
  hasError?: boolean,
  loadingComponent?: ReactNode,
  errorComponent?: ReactNode,
  /**
   * in milliseconds
   */
  minimumLoadingDuration?: number,
  className?: string,
}>

/**
 * A Component that shows the Error and Loading animation, when appropriate and the children otherwise
 */
export const LoadingAndErrorComponent = ({
                                           children,
                                           isLoading = false,
                                           hasError = false,
                                           loadingComponent,
                                           errorComponent,
                                           minimumLoadingDuration = 200,
                                           className
                                         }: LoadingAndErrorComponentProps) => {
  const [isInMinimumLoading, setIsInMinimumLoading] = useState(false)
  const [hasUsedMinimumLoading, setHasUsedMinimumLoading] = useState(false)
  if (minimumLoadingDuration && !isInMinimumLoading && !hasUsedMinimumLoading) {
    setIsInMinimumLoading(true)
    setTimeout(() => {
      setIsInMinimumLoading(false)
      setHasUsedMinimumLoading(true)
    }, minimumLoadingDuration)
  }

  if (isLoading || (minimumLoadingDuration && isInMinimumLoading)) {
    return (loadingComponent ?? <LoadingContainer className={clsx(className)}/>)
  }
  if (hasError) {
    return (errorComponent ?? <LoadingContainer className={clsx('bg-negative', className)}/>)
  }
  return children
}
