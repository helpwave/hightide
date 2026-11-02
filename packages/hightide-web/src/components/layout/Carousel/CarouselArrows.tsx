import type { HTMLAttributes } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { IconButton } from '../../interaction/IconButton'
import { useCarouselContext } from './CarouselContext'

export type CarouselArrowsProps = HTMLAttributes<HTMLDivElement>

export function CarouselArrows(_props: CarouselArrowsProps) {
  const translation = useHightideTranslation()
  const { goPrevious, goNext, canGoPrevious, canGoNext } = useCarouselContext()

  return (
    <>
      <IconButton
        tooltip={translation('previous')}
        color="neutral"
        className="carousel-arrow"
        data-direction="previous"
        data-hidden={canGoPrevious ? undefined : true}
        disabled={!canGoPrevious}
        onClick={goPrevious}
        icon={ChevronLeft}
      />
      <IconButton
        tooltip={translation('next')}
        color="neutral"
        className="carousel-arrow"
        data-direction="next"
        data-hidden={canGoNext ? undefined : true}
        disabled={!canGoNext}
        onClick={goNext}
        icon={ChevronRight}
      />
    </>
  )
}
