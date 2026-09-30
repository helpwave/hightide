import type { HTMLAttributes, PointerEvent, ReactElement, ReactNode } from 'react'
import { Children, cloneElement, isValidElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { createLoopingListWithIndex } from '@helpwave/hightide-utils/utils'

import { useCarouselContext } from './CarouselContext'
import type { CarouselSlideProps } from './CarouselSlide'
import { CarouselSlide } from './CarouselSlide'

const loopPadding = 3

export type CarouselContainerProps = HTMLAttributes<HTMLDivElement> & {
  slideClassName?: string,
}

function isCarouselSlide(node: ReactNode): node is ReactElement<CarouselSlideProps> {
  return isValidElement(node) && node.type === CarouselSlide
}

export function CarouselContainer({
  children,
  slideClassName,
  ...props
}: CarouselContainerProps) {
  const {
    currentIndex,
    hintNext,
    isLooping,
    setSlideCount,
    setIsDragging,
    goTo,
    goPrevious,
    goNext,
    transitionDuration,
  } = useCarouselContext()
  const [drag, setDrag] = useState<{ startX: number, offsetX: number }>()
  const suppressClickRef = useRef(false)

  const slides: ReactElement<CarouselSlideProps>[] = []
  const overlays: ReactNode[] = []
  Children.forEach(children, (child) => {
    if (isCarouselSlide(child)) {
      slides.push(child)
    } else {
      overlays.push(child)
    }
  })

  useLayoutEffect(() => {
    setSlideCount(slides.length)
  }, [setSlideCount, slides.length])

  useEffect(() => {
    setIsDragging(drag !== undefined)
  }, [drag, setIsDragging])

  const handlePointerDown = (event: PointerEvent) => {
    setDrag({
      startX: event.clientX,
      offsetX: 0,
    })
  }

  const handlePointerMove = (event: PointerEvent) => {
    setDrag((previous) => {
      if (!previous) {
        return previous
      }
      return {
        startX: previous.startX,
        offsetX: event.clientX - previous.startX,
      }
    })
  }

  const handlePointerUp = () => {
    if (!drag) {
      return
    }
    if (drag.offsetX > 50) {
      goPrevious()
    } else if (drag.offsetX < -50) {
      goNext()
    }
    suppressClickRef.current = Math.abs(drag.offsetX) > 5
    setDrag(undefined)
  }

  const positionedSlides = () => {
    const padding = isLooping ? loopPadding : 0
    let entries = slides.map((element, index) => ({
      index,
      element,
      isClone: false,
      key: `slide-${index}`,
    }))
    if (isLooping && slides.length > 0) {
      const before = createLoopingListWithIndex(slides, slides.length - 1, loopPadding, false)
        .reverse()
        .map(([index, element], listIndex) => ({
          index,
          element,
          isClone: true,
          key: `before-${listIndex}`,
        }))
      const after = createLoopingListWithIndex(slides, 0, loopPadding)
        .map(([index, element], listIndex) => ({
          index,
          element,
          isClone: true,
          key: `after-${listIndex}`,
        }))
      entries = [...before, ...entries, ...after]
    }

    return entries.map((entry, listIndex) => {
      const visualIndex = listIndex - padding
      const offset = -50 + (visualIndex - currentIndex) * 100
      const dragOffset = drag ? drag.offsetX : 0
      return cloneElement(entry.element, {
        key: entry.key,
        index: entry.index,
        isSelected: !entry.isClone && entry.index === currentIndex,
        isClone: entry.isClone,
        className: clsx(slideClassName, entry.element.props.className),
        style: {
          ...entry.element.props.style,
          translate: `calc(${offset}% + ${dragOffset}px)`,
          transitionDuration: drag ? '0ms' : `${transitionDuration}ms`,
        },
        onClick: (event) => {
          entry.element.props.onClick?.(event)
          if (suppressClickRef.current) {
            suppressClickRef.current = false
            return
          }
          goTo(entry.index)
        },
      })
    })
  }

  const currentSlide = slides[currentIndex]
  const framedSlide = currentSlide && cloneElement(currentSlide, {
    index: currentIndex,
    isSelected: true,
  })

  return (
    <div
      {...props}
      className={clsx('carousel-container', props.className)}
      data-hint-next={hintNext || undefined}
      data-dragging={drag !== undefined || undefined}
    >
      {hintNext ? (
        <div
          className="carousel-track"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="carousel-track-inner">
            {positionedSlides()}
          </div>
        </div>
      ) : (
        <div className="carousel-slide-frame">
          {framedSlide}
        </div>
      )}
      {overlays}
    </div>
  )
}
