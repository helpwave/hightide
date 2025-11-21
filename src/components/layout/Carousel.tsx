import type { HTMLAttributes, ReactNode } from 'react'
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createLoopingListWithIndex, range } from '@/src/utils/array'
import { IconButton } from '../user-action/Button'
import { useTranslation } from '@/src/i18n/useTranslation'

//
// CarouselContext
//
type CarouselContextType = {
  id: string,
  currentIndex: number,
  slideCount: number,
  isLooping: boolean,
}

const CarouselContext = createContext<CarouselContextType | null>(null)

const useCarouselContext = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    console.error('useCarouselContext must be used within CarouselContext')
  }
  return context
}

//
// CarouselTab
//
type CarouselTabsProps = {
  onChange: (index: number) => void,
}

export default function CarouselTabs({
                                       onChange,
                                     }: CarouselTabsProps) {
  const translation = useTranslation()
  const { id, slideCount, currentIndex, isLooping } = useCarouselContext()

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index
    if (event.key === 'ArrowRight') {
      newIndex = isLooping ? (index + 1) % slideCount : Math.max(index + 1, slideCount - 1)
    } else if (event.key === 'ArrowLeft') {
      newIndex = isLooping ? (index - 1 + slideCount) % slideCount : Math.max(index - 1, 0)
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
      id={`${id}-tablist`}
    >
      {range(slideCount).map((index) => {
        const isSelected = currentIndex === index
        return (
          <button
            id={`${id}-tab-${index}`}
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}

            onClick={() => onChange(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}

            className={clsx(
              'w-8 min-w-8 h-3 min-h-3 first:rounded-l-md last:rounded-r-md',
              {
                'bg-carousel-dot-disabled hover:bg-carousel-dot-active': currentIndex !== index,
                'bg-carousel-dot-active hover:brightness-90': currentIndex === index,
              }
            )}

            role="tab"
            tabIndex={isSelected ? 0 : -1}
            aria-label={translation('showSlide', { index: (index + 1) })}
            aria-selected={isSelected}
            aria-controls={`slide-${index}`}
            aria-disabled={isSelected}
          />
        )
      })}
    </div>
  )
}

//
// CarouselSlide
//
export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  isSelected: boolean,
  index: number,
}

export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(
  function CarouselSlide({
                           index,
                           isSelected,
                           ...props
                         }, ref) {
    const translation = useTranslation()
    const { id, slideCount } = useCarouselContext()

    return (
      <div
        {...props}
        ref={ref}
        id={`${id}-slide-${index}`}

        className={clsx('focus-style-none group/slide', props.className)}

        tabIndex={isSelected ? 0 : undefined}
        role="group"
        aria-roledescription={translation('slide')}
        aria-label={translation('slideOf', {
          index: (index + 1),
          length: (slideCount),
        })}
        aria-hidden={isSelected ? undefined : true}
      />
    )
  }
)

//
// Carousel
//
type DragState = {
  dragStartX: number,
  dragOffsetX: number,
}

type ItemType = {
  item: ReactNode,
  index: number,
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
  slideClassName?: string,
  slideContainerProps?: HTMLAttributes<HTMLDivElement>,
  onSlideChanged?: (index: number) => void,
}

export const Carousel = ({
                           children,
                           animationTime = 200,
                           isLooping = false,
                           isAutoPlaying = false,
                           autoLoopingTimeOut = 5000,
                           autoLoopAnimationTime = 1000,
                           hintNext = false,
                           arrows = false,
                           dots = true,
                           blurColor = 'from-background',
                           heightClassName = 'h-96',
                           slideClassName = 'w-[70%] desktop:w-1/2',
                           slideContainerProps,
                           onSlideChanged,
                           ...props
                         }: CarouselProps) => {
  const translation = useTranslation()
  const slideRefs = useRef<HTMLDivElement[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [hasFocus, setHasFocus] = useState(false)
  const [dragState, setDragState] = useState<DragState>()
  const isPaused = hasFocus
  const carouselContainerRef = useRef<HTMLDivElement>(null)
  const [disableClick, setDisableClick] = useState(false)

  const timeOut = useRef<NodeJS.Timeout | undefined>(undefined)

  const length = useMemo(() => children.length, [children])
  const paddingItemCount = 3 // The number of items to append left and right of the list to allow for clean transition when looping

  const generatedId = 'carousel' + useId()
  const id = props.id ?? generatedId

  // Validation
  if (isAutoPlaying && !isLooping) {
    console.error('When isAutoLooping is true, isLooping should also be true')
    isLooping = true
  }
  autoLoopingTimeOut = Math.max(0, autoLoopingTimeOut) // time between transitions
  animationTime = Math.max(100, animationTime) // in ms, must be > 0
  autoLoopAnimationTime = Math.max(200, autoLoopAnimationTime)

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

  const getStyleOffset = (index: number) => {
    const baseOffset = -50 + (index - currentIndex) * 100
    return `${baseOffset}%`
  }

  const canGoLeft = () => {
    return isLooping || currentIndex !== 0
  }

  const canGoRight = useCallback(() => {
    return isLooping || currentIndex !== length - 1
  }, [currentIndex, isLooping, length])

  const left = () => {
    if (canGoLeft()) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const right = useCallback(() => {
    if (canGoRight()) {
      setCurrentIndex((currentIndex + length + 1) % length)
    }
  }, [canGoRight, currentIndex, length])

  useEffect(() => {
    if (!timeOut.current && !isPaused) {
      if (autoLoopingTimeOut > 0) {
        timeOut.current = setTimeout(() => {
          right()
          timeOut.current = undefined
        }, autoLoopingTimeOut)
      } else {
        right()
      }
    }
    if ((isPaused || !!dragState) && timeOut.current) {
      clearTimeout(timeOut.current)
      timeOut.current = undefined
    }
  }, [right, isPaused, autoLoopingTimeOut, dragState])


  let items: ItemType[] = children.map((item, index) => ({
    index,
    item
  }))
  let before: ItemType[] = []
  let after: ItemType[] = []
  if (isLooping) {
    before = createLoopingListWithIndex(children, length - 1, paddingItemCount, false).reverse().map(([index, item]) => ({
      index,
      item
    }))
    after = createLoopingListWithIndex(children, 0, paddingItemCount).map(([index, item]) => ({
      index,
      item
    }))

    items = [...before, ...items, ...after]
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragState({
      dragOffsetX: 0,
      dragStartX: e.clientX,
    })
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return
    setDragState(prevState => ({ dragStartX: prevState.dragStartX, dragOffsetX: e.clientX - prevState.dragStartX }))
  }

  const handlePointerUp = () => {
    if (!dragState) return
    if (dragState.dragOffsetX > 50) {
      left()
    } else if (dragState.dragOffsetX < -50) {
      right()
    }
    setDragState(undefined)
  }

  useEffect(() => {
    setDisableClick(!dragState)
  }, [dragState])

  useEffect(() => {
    onSlideChanged?.(currentIndex)
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CarouselContext.Provider value={{ id, currentIndex, slideCount: length, isLooping }}>
      <div
        ref={carouselContainerRef}
        {...props}
        className={clsx('flex-col-2 items-center w-full', props.className)}

        id={id}
        role="region"
        aria-roledescription={translation('slide')}
      >
        <div
          {...slideContainerProps}
          className={clsx(`relative w-full overflow-hidden`, heightClassName, slideContainerProps?.className)}
        >
          {hintNext ? (
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={clsx(`flex-row-2 relative h-full`, heightClassName)}
            >
              <div className="flex-row-2 relative h-full w-full px-2 overflow-hidden">
                {items.map(({
                              item,
                              index
                            }, listIndex) => {
                  const isInItems = before.length <= listIndex && listIndex < items.length - after.length

                  return (
                    <CarouselSlide
                      ref={isInItems ? slideRefs[index] : undefined}
                      key={listIndex}
                      index={index}
                      isSelected={isInItems && currentIndex === index}
                      className={clsx(
                        `absolute left-[50%] h-full overflow-hidden transition-transform ease-in-out`,
                        slideClassName
                      )}
                      onClick={() => !disableClick && setCurrentIndex(index)}
                      style={{
                        translate: `calc(${getStyleOffset(listIndex - (isLooping ? paddingItemCount : 0))} + ${dragState ? dragState.dragOffsetX : 0}px)`,
                        transitionDuration: dragState ? '0ms' : ((isAutoPlaying && !isPaused ? autoLoopAnimationTime : animationTime) + 'ms'),
                      }}
                    >
                      {item}
                    </CarouselSlide>
                  )
                })}
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
              className={clsx('px-16 h-full')}

              tabIndex={0}
              role="group"
              aria-roledescription={translation('slide')}
              aria-label={translation('slideOf', {
                index: (currentIndex + 1),
                length: items.length
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
        {dots && (<CarouselTabs onChange={setCurrentIndex}/>)}
      </div>
    </CarouselContext.Provider>
  )
}
