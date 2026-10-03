import type { HTMLAttributes } from 'react'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { useEventCallbackStabilizer, useLogOnce } from '@helpwave/hightide-utils/hooks'

import { CarouselContextProvider } from './CarouselContext'

export type CarouselRootProps = HTMLAttributes<HTMLDivElement> & {
  animationTime?: number,
  isLooping?: boolean,
  isAutoPlaying?: boolean,
  autoLoopingTimeOut?: number,
  autoLoopAnimationTime?: number,
  hintNext?: boolean,
  onSlideChanged?: (index: number) => void,
}

export function CarouselRoot({
  children,
  animationTime = 200,
  isLooping = false,
  isAutoPlaying = false,
  autoLoopingTimeOut = 5000,
  autoLoopAnimationTime = 1000,
  hintNext = false,
  onSlideChanged,
  ...props
}: CarouselRootProps) {
  const translation = useHightideTranslation()
  const onSlideChangedStable = useEventCallbackStabilizer(onSlideChanged)
  const generatedId = useId()
  const id = props.id ?? `carousel-${generatedId}`
  const loops = isAutoPlaying || isLooping
  const stepDuration = Math.max(100, animationTime)
  const autoDuration = Math.max(200, autoLoopAnimationTime)
  const autoDelay = Math.max(0, autoLoopingTimeOut)

  useLogOnce(
    'Carousel: isAutoPlaying requires isLooping',
    isAutoPlaying && !isLooping,
    { type: 'error' }
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideCount, setSlideCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const goTo = useCallback((index: number) => {
    setCurrentIndex((previous) => {
      if (slideCount <= 0) {
        return previous
      }
      if (loops) {
        return (index % slideCount + slideCount) % slideCount
      }
      return Math.min(Math.max(index, 0), slideCount - 1)
    })
  }, [loops, slideCount])

  const canGoPrevious = loops || currentIndex !== 0
  const canGoNext = slideCount > 0 && (loops || currentIndex !== slideCount - 1)

  const goPrevious = useCallback(() => {
    setCurrentIndex((previous) => {
      if (slideCount <= 0) {
        return previous
      }
      if (!loops && previous === 0) {
        return previous
      }
      return (previous - 1 + slideCount) % slideCount
    })
  }, [loops, slideCount])

  const goNext = useCallback(() => {
    setCurrentIndex((previous) => {
      if (slideCount <= 0) {
        return previous
      }
      if (!loops && previous === slideCount - 1) {
        return previous
      }
      return (previous + 1) % slideCount
    })
  }, [loops, slideCount])

  useEffect(() => {
    if (slideCount <= 0) {
      return
    }
    if (currentIndex > slideCount - 1) {
      setCurrentIndex(slideCount - 1)
    }
  }, [currentIndex, slideCount])

  useEffect(() => {
    onSlideChangedStable(currentIndex)
  }, [currentIndex, onSlideChangedStable])

  useEffect(() => {
    if (!isAutoPlaying || isPaused || isDragging || slideCount <= 0) {
      return
    }
    const timeout = setTimeout(() => {
      goNext()
    }, autoDelay)
    return () => clearTimeout(timeout)
  }, [autoDelay, goNext, isAutoPlaying, isDragging, isPaused, slideCount])

  const transitionDuration = isAutoPlaying && !isPaused ? autoDuration : stepDuration

  const contextValue = useMemo(() => ({
    id,
    currentIndex,
    slideCount,
    setSlideCount,
    isLooping: loops,
    hintNext,
    transitionDuration,
    isDragging,
    setIsDragging,
    goTo,
    goPrevious,
    goNext,
    canGoPrevious,
    canGoNext,
  }), [
    canGoNext,
    canGoPrevious,
    currentIndex,
    goNext,
    goPrevious,
    goTo,
    hintNext,
    id,
    isDragging,
    loops,
    slideCount,
    transitionDuration,
  ])

  return (
    <CarouselContextProvider value={contextValue}>
      <div
        {...props}
        id={id}
        className={clsx('carousel', props.className)}
        data-looping={loops || undefined}
        data-auto-playing={isAutoPlaying || undefined}
        data-paused={isPaused || undefined}
        data-hint-next={hintNext || undefined}
        role="region"
        aria-roledescription={translation('slide')}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {children}
      </div>
    </CarouselContextProvider>
  )
}
