import type {
  UIEvent,
  ReactNode
} from 'react'
import {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback
} from 'react'
import clsx from 'clsx'
import { range } from '@/src/utils/array'
import { Button } from '../user-interaction/Button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Visibility } from './Visibility'

export interface InfiniteScrollProps {
  itemCount: number,
  /** How many items to keep in the DOM at once (default: 30) */
  bufferSize?: number,
  /** How many items to add tp the DOM when reaching one end at once (default: 7) */
  stepSize?: number,
  /** Pixels from edge to trigger a fetch/shift (default: 30) */
  scrollThreshold?: number,
  /** Initial index to center on or start at (optional) */
  initialIndex?: number,
  /** Render prop for each item */
  children: (index: number) => ReactNode,
  /** Optional classname for the scroll container */
  className?: string,
  /** Optional style for the container */
  style?: React.CSSProperties,
}

export function InfiniteScroll({
  children,
  itemCount,
  bufferSize = 30,
  scrollThreshold = 30,
  stepSize = 7,
  initialIndex = 0,
  className,
  style,
}: InfiniteScrollProps) {
  if (stepSize > bufferSize) {
    throw new Error('InfiniteScroll: stepSize <= bufferSize must hold')
  }
  if (itemCount < 1) {
    throw new Error('InfiniteScroll: itemCount > 0 must hold')
  }
  const items = useMemo(() => range(itemCount), [itemCount])
  const containerRef = useRef<HTMLDivElement>(null)
  const snapshotRef = useRef({ scrollHeight: 0, scrollTop: 0, fromTop: false })

  const [windowState, setWindowState] = useState(() => {
    let index = initialIndex
    if (index < 0) {
      index = 0
    }

    const halfBuffer = Math.floor(bufferSize / 2)
    const safeStart = Math.max(0, initialIndex - halfBuffer)

    return {
      start: safeStart,
      end: Math.min(items.length, safeStart + bufferSize)
    }
  })

  const addToStart = useCallback((amount = stepSize) => {
    setWindowState(prev => {
      const newStart = Math.max(0, prev.start - amount)
      const newEnd = Math.min(items.length, newStart + bufferSize)
      return { start: newStart, end: newEnd }
    })
  }, [bufferSize, items.length, stepSize])

  const addToEnd = useCallback((amount = stepSize) => {
    setWindowState(prev => {
      const newEnd = Math.min(items.length, prev.end + amount)
      const newStart = Math.max(0, newEnd - bufferSize)
      return { start: newStart, end: newEnd }
    })
  }, [bufferSize, items.length, stepSize])

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

    if (scrollTop < scrollThreshold && windowState.start > 0) {
      snapshotRef.current = { scrollHeight, scrollTop, fromTop: true }
      addToStart()
    }
    else if (scrollTop + clientHeight > scrollHeight - scrollThreshold && windowState.end < items.length) {
      snapshotRef.current = { scrollHeight, scrollTop, fromTop: false }
      addToEnd()
    }
  }

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !snapshotRef.current.fromTop) return

    const heightDifference = container.scrollHeight - snapshotRef.current.scrollHeight

    if (heightDifference > 0) {
      container.scrollTop = snapshotRef.current.scrollTop + heightDifference
    }
    snapshotRef.current.fromTop = false
  }, [windowState])

  const visibleItems = useMemo(() =>
    items.slice(windowState.start, windowState.end),
  [items, windowState])

  const isUsingInfiteScroll = itemCount > bufferSize

  return (
    <div
      ref={containerRef}
      onScroll={isUsingInfiteScroll ? handleScroll : undefined}
      className={clsx('overflow-y-auto', className)}
      style={style}
    >
      <Visibility isVisible={windowState.start > 0}>
        <Button color="neutral" onClick={() => addToStart()}>
          <ChevronUp/>
        </Button>
      </Visibility>
      {visibleItems.map((index) => children(index))}
      <Visibility isVisible={windowState.end < itemCount - 1}>
        <Button color="neutral" onClick={() => addToEnd()}>
          <ChevronDown/>
        </Button>
      </Visibility>
    </div>
  )
}