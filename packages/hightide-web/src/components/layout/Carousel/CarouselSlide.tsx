import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { useCarouselContext } from './CarouselContext'

export type CarouselSlideProps = HTMLAttributes<HTMLDivElement> & {
  index?: number,
  isSelected?: boolean,
  isClone?: boolean,
}

export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(function CarouselSlide({
  index = 0,
  isSelected = false,
  isClone = false,
  ...props
}, ref) {
  const translation = useHightideTranslation()
  const { id, slideCount } = useCarouselContext()

  return (
    <div
      {...props}
      ref={ref}
      id={isClone ? undefined : props.id ?? `${id}-slide-${index}`}
      className={clsx('carousel-slide group/slide', props.className)}
      data-selected={isSelected || undefined}
      data-clone={isClone || undefined}
      tabIndex={isSelected ? 0 : undefined}
      role="group"
      aria-roledescription={translation('slide')}
      aria-label={translation('slideOf', {
        index: index + 1,
        length: slideCount,
      })}
      aria-hidden={isSelected ? undefined : true}
    />
  )
})
