import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type CarouselFadeLayoverProps = HTMLAttributes<HTMLDivElement>

export function CarouselFadeLayover({
  className,
  ...props
}: CarouselFadeLayoverProps) {
  return (
    <>
      <div
        {...props}
        data-side="start"
        className={clsx('carousel-fade-layover', className)}
      />
      <div
        {...props}
        data-side="end"
        className={clsx('carousel-fade-layover', className)}
      />
    </>
  )
}
