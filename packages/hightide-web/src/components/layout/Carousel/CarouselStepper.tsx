import type { KeyboardEvent } from 'react'
import { useRef } from 'react'
import clsx from 'clsx'
import { range } from '@helpwave/hightide-utils/utils'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { useCarouselContext } from './CarouselContext'

export type CarouselStepperProps = {
  className?: string,
}

export function CarouselStepper({ className }: CarouselStepperProps) {
  const translation = useHightideTranslation()
  const { id, slideCount, currentIndex, isLooping, goTo } = useCarouselContext()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (index: number, direction: 1 | -1) => {
    const next = isLooping
      ? (index + direction + slideCount) % slideCount
      : Math.min(Math.max(index + direction, 0), slideCount - 1)
    goTo(next)
    tabRefs.current[next]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(index, 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(index, -1)
    }
  }

  return (
    <div
      className={clsx('carousel-stepper', className)}
      role="tablist"
      aria-label={translation('slideNavigation')}
      id={`${id}-tablist`}
    >
      {range(slideCount).map((index) => {
        const isSelected = currentIndex === index
        return (
          <button
            id={`${id}-tab-${index}`}
            key={index}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            onClick={() => goTo(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="carousel-stepper-tab"
            data-selected={isSelected || undefined}
            type="button"
            role="tab"
            tabIndex={isSelected ? 0 : -1}
            aria-label={translation('showSlide', { index: index + 1 })}
            aria-selected={isSelected}
            aria-controls={`${id}-slide-${index}`}
            aria-disabled={isSelected}
          />
        )
      })}
    </div>
  )
}
