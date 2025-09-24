import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createLoopingListWithIndex, range } from '@/src/utils/array'
import { clamp } from '@/src/utils/math'
import { EaseFunctions } from '@/src/utils/easeFunctions'
import type { Direction } from '@/src/utils/loopingArray'
import { LoopingArrayCalculator } from '@/src/utils/loopingArray'
import { IconButton } from '../user-action/Button'
import type { Translation } from '@/src/localization/useTranslation'
import { useTranslation } from '@/src/localization/useTranslation'

//
// CarouselTab
//
type CarouselTabTranslationType = {
  showSlide: string,
  slideNavigation: string,
}

const defaultCarouselTabTranslationType: Translation<CarouselTabTranslationType> = {
  en: {
    showSlide: `Show Slide {{index}}`,
    slideNavigation: 'Slide navigation'
  },
  de: {
    showSlide: 'Zeige Slide {{index}}',
    slideNavigation: 'Slide Navigation',
  }
}

type CarouselTabsProps = {
  itemCount: number,
  currentIndex: number,
  onChange: (index: number) => void,
}

export default function CarouselTabs({
                                       itemCount,
                                       currentIndex,
                                       onChange,
                                     }: CarouselTabsProps) {
  const translation = useTranslation<CarouselTabTranslationType>([
    defaultCarouselTabTranslationType,
  ])

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index
    if (event.key === 'ArrowRight') {
      newIndex = (index + 1) % itemCount
    } else if (event.key === 'ArrowLeft') {
      newIndex = (index - 1 + itemCount) % itemCount
    } else {
      return
    }
    event.preventDefault()
    onChange(newIndex)
    tabRefs.current[newIndex]?.focus()
  }

  return (
    <div
      className="flex-row-1 items-center justify-center w-full my-2"
      role="tablist"
      aria-label={translation('slideNavigation')}
    >
      {range(itemCount).map((index) => {
        const isSelected = currentIndex === index
        return (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`carousel-slide-${index}`}
            id={`carousel-tab-${index}`}
            tabIndex={isSelected ? 0 : -1}
            aria-label={translation('showSlide', { replacements: { index: (index + 1).toString() } })}
            className={clsx(
              'w-8 min-w-8 h-3 min-h-3 first:rounded-l-md last:rounded-r-md',
              {
                'bg-carousel-dot-disabled hover:bg-carousel-dot-active': currentIndex !== index,
                'bg-carousel-dot-active hover:brightness-90': currentIndex === index,
              }
            )}
            onClick={() => onChange(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        )
      })}
    </div>
  )
}

//
// CarouselSlide
//
type CarouselSlideTranslationType = {
  slide: string,
  slideOf: string,
}

const defaultCarouselSlideTranslationType: Translation<CarouselSlideTranslationType> = {
  en: {
    slide: 'Slide',
    slideOf: `Slide {{index}} of {{length}} slides`,
  },
  de: {
    slide: 'Slide',
    slideOf: `Slide {{index}} von {{length}} slides`,
  }
}

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  index: number,
  itemCount: number,
  isSelected?: boolean,
}

export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(
  function CarouselSlide({
                           index,
                           itemCount,
                           isSelected = false,
                           ...props
                         }, ref) {
    const translation = useTranslation<CarouselSlideTranslationType>([defaultCarouselSlideTranslationType])

    return (
      <div
        {...props}
        ref={ref}
        tabIndex={isSelected ? 0 : undefined}
        role="group"
        aria-roledescription={translation('slide')}
        aria-label={translation('slideOf', {
          replacements: {
            index: (index + 1).toString(),
            length: (itemCount).toString(),
          },
        })}
        aria-hidden={isSelected || undefined}
      />
    )
  }
)

//
// Carousel
//
type CarouselTranslationType = {
  slide: string,
  carousel: string,
  slideOf: string,
  chooseSlide: string,
}

const defaultCarouselTranslationType: Translation<CarouselTranslationType> = {
  en: {
    slide: 'Slide',
    carousel: 'Carousel',
    slideOf: `Slide {{index}} of {{length}} slides`,
    chooseSlide: 'Choose slide to display'
  },
  de: {
    slide: 'Slide',
    carousel: 'Karussell',
    slideOf: `Slide {{index}} von {{length}} slides`,
    chooseSlide: 'Wähle die angezeigte Slide aus'
  }
}

type ItemType = {
  item: ReactNode,
  index: number,
}

type CarouselAnimationState = {
  targetPosition: number,
  /**
   * Value of either 1 or -1, 1 is forwards -1 is backwards
   */
  direction: Direction,
  startPosition: number,
  startTime?: number,
  lastUpdateTime?: number,
  isAutoPlaying: boolean,
}

type DragState = {
  startX: number,
  startTime: number,
  lastX: number,
  startIndex: number,
}

type CarouselInformation = {
  currentPosition: number,
  dragState?: DragState,
  animationState?: CarouselAnimationState,
}

export type CarouselProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode[],
  animationTime?: number,
  isLooping?: boolean,
  isAutoPlaying?: boolean,
  autoLoopingTimeOut?: number,
  autoLoopAnimationTime?: number,
  hintNext?: boolean,
  arrows?: boolean,
  dots?: boolean,
  /**
   * Percentage that is allowed to be scrolled further
   */
  overScrollThreshold?: number,
  blurColor?: string,
  heightClassName?: string,
  widthClassName?: string,
  slideContainerProps?: HTMLAttributes<HTMLDivElement>,
}

export const Carousel = ({
                           children,
                           animationTime = 200,
                           isLooping = false,
                           isAutoPlaying = false,
                           autoLoopingTimeOut = 5000,
                           autoLoopAnimationTime = 500,
                           hintNext = false,
                           arrows = false,
                           dots = true,
                           overScrollThreshold = 0.1,
                           blurColor = 'from-background',
                           heightClassName = 'h-96',
                           widthClassName = 'w-[70%] desktop:w-1/2',
                           slideContainerProps,
                           ...props
                         }: CarouselProps) => {
  const translation = useTranslation([defaultCarouselTranslationType])
  const slideRefs = useRef<HTMLDivElement[]>([])
  const [hasFocus, setHasFocus] = useState(false)
  const isPaused = hasFocus
  const carouselContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carousel = carouselContainerRef.current

    if (carousel) {
      function onFocus() {
        setHasFocus(true)
      }

      function onBlur() {
        setHasFocus(false)
      }


      carousel?.addEventListener('focusin', onFocus)
      carousel?.addEventListener('focusout', onBlur)
      return () => {
        carousel?.removeEventListener('focusin', onFocus)
        carousel?.removeEventListener('focusin', onFocus)
      }
    }
  }, [])

  if (isAutoPlaying && !isLooping) {
    console.error('When isAutoLooping is true, isLooping should also be true')
    isLooping = true
  }

  const [{
    currentPosition,
    dragState,
    animationState,
  }, setCarouselInformation] = useState<CarouselInformation>({
    currentPosition: 0,
  })
  const animationId = useRef<number | undefined>(undefined)
  const timeOut = useRef<NodeJS.Timeout | undefined>(undefined)
  autoLoopingTimeOut = Math.max(0, autoLoopingTimeOut)

  const length = children.length
  const paddingItemCount = 3 // The number of items to append left and right of the list to allow for clean transition when looping

  const util = useMemo(() => new LoopingArrayCalculator(length, isLooping, overScrollThreshold), [length, isLooping, overScrollThreshold])
  const currentIndex = util.getCorrectedPosition(LoopingArrayCalculator.withoutOffset(currentPosition))
  animationTime = Math.max(200, animationTime) // in ms, must be > 0
  autoLoopAnimationTime = Math.max(200, autoLoopAnimationTime)

  const getStyleOffset = (index: number) => {
    const baseOffset = -50 + (index - currentPosition) * 100
    return `${baseOffset}%`
  }

  const animation = useCallback((time: number) => {
    let keepAnimating: boolean = true

    // Other calculation in the setState call to avoid updating the useCallback to often
    setCarouselInformation((state) => {
      const {
        animationState,
        dragState
      } = state
      if (animationState === undefined || dragState !== undefined) {
        keepAnimating = false
        return state
      }
      if (!animationState.startTime || !animationState.lastUpdateTime) {
        return {
          ...state,
          animationState: {
            ...animationState,
            startTime: time,
            lastUpdateTime: time
          }
        }
      }
      const useAnimationTime = animationState.isAutoPlaying ? autoLoopAnimationTime : animationTime
      const progress = clamp((time - animationState.startTime) / useAnimationTime) // progress
      const easedProgress = EaseFunctions.easeInEaseOut(progress)
      const distance = util.getDistanceDirectional(animationState.startPosition, animationState.targetPosition, animationState.direction)
      const newPosition = util.getCorrectedPosition(easedProgress * distance * animationState.direction + animationState.startPosition)

      if (animationState.targetPosition === newPosition || progress === 1) {
        keepAnimating = false
        return ({
          currentPosition: LoopingArrayCalculator.withoutOffset(newPosition),
          animationState: undefined
        })
      }
      return ({
        currentPosition: newPosition,
        animationState: {
          ...animationState!,
          lastUpdateTime: time
        }
      })
    })
    if (keepAnimating) {
      animationId.current = requestAnimationFrame(time1 => animation(time1))
    }
  }, [animationTime, autoLoopAnimationTime, util])

  useEffect(() => {
    if (animationState) {
      animationId.current = requestAnimationFrame(animation)
    }
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
        animationId.current = 0
      }
    }
  }, [animationState]) // eslint-disable-line react-hooks/exhaustive-deps

  const startAutoLoop = () => setCarouselInformation(prevState => ({
    ...prevState,
    dragState: prevState.dragState,
    animationState: prevState.animationState || prevState.dragState ? prevState.animationState : {
      startPosition: currentPosition,
      targetPosition: (currentPosition + 1) % length,
      direction: 1, // always move forward
      isAutoPlaying: true
    }
  }))

  useEffect(() => {
    if (!animationId.current && !animationState && !dragState && !timeOut.current && !isPaused) {
      if (autoLoopingTimeOut > 0) {
        timeOut.current = setTimeout(() => {
          startAutoLoop()
          timeOut.current = undefined
        }, autoLoopingTimeOut)
      } else {
        startAutoLoop()
      }
    }
    if (isPaused && timeOut.current) {
      clearTimeout(timeOut.current)
    }
  }, [animationState, dragState, animationId.current, timeOut.current]) // eslint-disable-line react-hooks/exhaustive-deps

  const startAnimation = (targetPosition?: number) => {
    if (targetPosition === undefined) {
      targetPosition = LoopingArrayCalculator.withoutOffset(currentPosition)
    }
    if (targetPosition === currentPosition) {
      return // we are exactly where we want to be
    }

    // find target index and fastest path to it
    const direction = util.getBestDirection(currentPosition, targetPosition)
    clearTimeout(timeOut.current)
    timeOut.current = undefined
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
      animationId.current = undefined
    }

    setCarouselInformation(prevState => ({
      ...prevState,
      dragState: undefined,
      animationState: {
        targetPosition: targetPosition!,
        direction,
        startPosition: currentPosition,
        isAutoPlaying: false
      },
      timeOut: undefined
    }))
  }

  const canGoLeft = () => {
    return isLooping || currentPosition !== 0
  }

  const canGoRight = () => {
    return isLooping || currentPosition !== length - 1
  }

  const left = () => {
    if (canGoLeft()) {
      startAnimation(currentPosition === 0 ? length - 1 : LoopingArrayCalculator.withoutOffset(currentPosition - 1))
    }
  }

  const right = () => {
    if (canGoRight()) {
      startAnimation(LoopingArrayCalculator.withoutOffset((currentPosition + 1) % length))
    }
  }

  const items: ItemType[] = children.map((item, index) => ({
    index,
    item
  }))
  const before = createLoopingListWithIndex(children, length - 1, paddingItemCount, false).reverse().map(([index, item]) => ({
    index,
    item
  }))
  const after = createLoopingListWithIndex(children, 0, paddingItemCount).map(([index, item]) => ({
    index,
    item
  }))

  const onDragStart = (x: number) => setCarouselInformation(prevState => ({
    ...prevState,
    dragState: {
      lastX: x,
      startX: x,
      startTime: Date.now(),
      startIndex: currentPosition,
    },
    animationState: undefined // cancel animation
  }))

  const onDrag = (x: number, width: number) => {
    // For some weird reason the clientX is 0 on the last dragUpdate before drag end causing issues
    if (!dragState || x === 0) {
      return
    }
    const offsetUpdate = (dragState.lastX - x) / width
    const newPosition = util.getCorrectedPosition(currentPosition + offsetUpdate)

    setCarouselInformation(prevState => ({
      ...prevState,
      currentPosition: newPosition,
      dragState: {
        ...dragState,
        lastX: x
      },
    }))
  }

  const onDragEnd = (x: number, width: number) => {
    if (!dragState) {
      return
    }
    const distance = dragState.startX - x
    const relativeDistance = distance / width
    const duration = (Date.now() - dragState.startTime) // in milliseconds
    const velocity = distance / (Date.now() - dragState.startTime)

    const isSlide = Math.abs(velocity) > 2 || (duration < 200 && (Math.abs(relativeDistance) > 0.2 || Math.abs(distance) > 50))
    if (isSlide) {
      if (distance > 0 && canGoRight()) {
        right()
        return
      } else if (distance < 0 && canGoLeft()) {
        left()
        return
      }
    }
    startAnimation()
  }

  const dragHandlers = {
    draggable: true,
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => {
      onDragStart(event.clientX)
      event.dataTransfer.setDragImage(document.createElement('div'), 0, 0)
    },
    onDrag: (event: React.DragEvent<HTMLDivElement>) => onDrag(event.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
    onDragEnd: (event: React.DragEvent<HTMLDivElement>) => onDragEnd(event.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
    onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => onDragStart(event.touches[0]!.clientX),
    onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => onDrag(event.touches[0]!.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
    onTouchEnd: (event: React.TouchEvent<HTMLDivElement>) => onDragEnd(event.changedTouches[0]!.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
    onTouchCancel: (event: React.TouchEvent<HTMLDivElement>) => onDragEnd(event.changedTouches[0]!.clientX, (event.target as HTMLDivElement).getBoundingClientRect().width),
  }

  console.log(isPaused)

  return (
    <div
      ref={carouselContainerRef}
      {...props}
      className={clsx('flex-col-2 items-center w-full', props.className)}
      role="region"
      aria-roledescription={translation('slide')}
    >
      <div
        {...slideContainerProps}
        className={clsx(`relative w-full overflow-hidden`, heightClassName, slideContainerProps?.className)}
      >
        {hintNext ? (
          <div className={clsx(`flex-row-2 relative h-full`, heightClassName)}>
            <div className="flex-row-2 relative h-full w-full px-2 overflow-hidden">
              {before.map(({
                            item,
                            index
                          }, listIndex) => (
                <CarouselSlide
                  key={'before'+index}
                  index={index}
                  itemCount={length}
                  {...dragHandlers}
                  onClick={() => startAnimation(index)}
                  className={clsx(
                    `absolute left-[50%] h-full overflow-hidden`,
                    widthClassName,
                    { '!cursor-grabbing': !!dragState }
                  )}
                  style={{ translate: getStyleOffset(listIndex - (isLooping ? paddingItemCount : 0)) }}
                >
                  {item}
                </CarouselSlide>
              ))}
              {items.map(({
                            item,
                            index
                          }, listIndex) => (
                <CarouselSlide
                  ref={slideRefs[index]}
                  key={listIndex}
                  index={index}
                  itemCount={length}
                  isSelected={currentIndex === index}
                  {...dragHandlers}
                  onClick={() => startAnimation(index)}
                  className={clsx(
                    `absolute left-[50%] h-full overflow-hidden`,
                    widthClassName,
                    { '!cursor-grabbing': !!dragState }
                  )}
                  style={{ translate: getStyleOffset(before.length + listIndex - (isLooping ? paddingItemCount : 0)) }}
                >
                  {item}
                </CarouselSlide>
              ))}
              {after.map(({
                             item,
                             index
                           }, listIndex) => (
                <CarouselSlide
                  key={'after'+index}
                  index={index}
                  itemCount={length}
                  {...dragHandlers}
                  onClick={() => startAnimation(index)}
                  className={clsx(
                    `absolute left-[50%] h-full overflow-hidden`,
                    widthClassName,
                    { '!cursor-grabbing': !!dragState }
                  )}
                  style={{ translate: getStyleOffset(before.length + items.length + listIndex - (isLooping ? paddingItemCount : 0)) }}
                >
                  {item}
                </CarouselSlide>
              ))}
            </div>
            <div
              className={clsx(`hidden desktop:block pointer-events-none absolute left-0 h-full w-[20%] bg-gradient-to-r to-transparent`, blurColor)}
            />
            <div
              className={clsx(`hidden desktop:block pointer-events-none absolute right-0 h-full w-[20%] bg-gradient-to-l to-transparent`, blurColor)}
            />
          </div>
        ) : (
          <div
            ref={slideRefs[currentIndex]}
            {...dragHandlers}
            className={clsx('px-16 h-full', { '!cursor-grabbing': !!dragState })}

            tabIndex={0}
            role="group"
            aria-roledescription={translation('slide')}
            aria-label={translation('slideOf', {
              replacements: {
                index: (currentIndex + 1).toString(),
                length: items.length.toString()
              }
            })}
          >
            {children[currentIndex]}
          </div>
        )}
        {arrows && (
          <>
            <IconButton
              color="neutral"
              className={clsx('absolute z-10 left-2 top-1/2 -translate-y-1/2 shadow-md', { hidden: !canGoLeft() })}
              disabled={!canGoLeft()}
              onClick={() => left()}
            >
              <ChevronLeft size={24}/>
            </IconButton>
            <IconButton
              color="neutral"
              className={clsx('absolute z-10 right-2 top-1/2 -translate-y-1/2 shadow-md', { hidden: !canGoRight() })}
              disabled={!canGoRight()}
              onClick={() => right()}
            >
              <ChevronRight size={24}/>
            </IconButton>
          </>
        )}
      </div>
      {dots && (<CarouselTabs itemCount={length} currentIndex={currentIndex} onChange={startAnimation}/>)}
    </div>
  )
}
