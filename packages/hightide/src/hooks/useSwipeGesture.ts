'use client'

import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

export type SwipeInputMode = 'touch' | 'mouse' | 'both'

export type SwipeDirection =
  | 'leftToRight'
  | 'rightToLeft'
  | 'topToBottom'
  | 'bottomToTop'

export interface SwipeEventData {
  direction: SwipeDirection,
}

export interface SwipeStartRegion {
  minX?: number,
  maxX?: number,
  minY?: number,
  maxY?: number,
}

interface GesturePoint {
  x: number,
  y: number,
  scrollY: number,
  time: number,
}

interface UseSwipeGestureOptions {
  elementRef?: RefObject<HTMLElement | null>,
  inputMode?: SwipeInputMode,
  onSwipe?: (data: SwipeEventData) => void,
  startRegion?: SwipeStartRegion,
  threshold?: number,
  crossAxisThreshold?: number,
  maxSwipeTime?: number,
}

export const useSwipeGesture = ({
  elementRef,
  inputMode = 'touch',
  onSwipe,
  startRegion,
  threshold = 50,
  crossAxisThreshold = 100,
  maxSwipeTime = 100,
}: UseSwipeGestureOptions) => {
  const onSwipeRef = useRef(onSwipe)
  const startRegionRef = useRef(startRegion)
  const thresholdRef = useRef(threshold)
  const crossAxisThresholdRef = useRef(crossAxisThreshold)
  const maxSwipeTimeRef = useRef(maxSwipeTime)
  const gestureStartRef = useRef<GesturePoint | null>(null)
  const gestureEndRef = useRef<GesturePoint | null>(null)
  const isScrollingRef = useRef(false)
  const isMouseDownRef = useRef(false)

  useEffect(() => {
    onSwipeRef.current = onSwipe
    startRegionRef.current = startRegion
    thresholdRef.current = threshold
    crossAxisThresholdRef.current = crossAxisThreshold
    maxSwipeTimeRef.current = maxSwipeTime
  }, [onSwipe, startRegion, threshold, crossAxisThreshold, maxSwipeTime])

  const isWithinStartRegion = (x: number, y: number): boolean => {
    const region = startRegionRef.current
    if (!region) return true
    if (region.minX !== undefined && x < region.minX) return false
    if (region.maxX !== undefined && x > region.maxX) return false
    if (region.minY !== undefined && y < region.minY) return false
    if (region.maxY !== undefined && y > region.maxY) return false
    return true
  }

  const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
    if (!element) return null

    const table = element.closest('table') || element.closest('[role="table"]')
    if (table) {
      let parent = table.parentElement
      while (parent) {
        const style = window.getComputedStyle(parent)
        if (style.overflow === 'auto' || style.overflow === 'scroll' ||
            style.overflowY === 'auto' || style.overflowY === 'scroll' ||
            style.overflowX === 'auto' || style.overflowX === 'scroll') {
          return parent
        }
        parent = parent.parentElement
      }
      return table as HTMLElement
    }

    let current: HTMLElement | null = element
    while (current) {
      const style = window.getComputedStyle(current)
      if (style.overflow === 'auto' || style.overflow === 'scroll' ||
          style.overflowY === 'auto' || style.overflowY === 'scroll' ||
          style.overflowX === 'auto' || style.overflowX === 'scroll') {
        return current
      }
      current = current.parentElement
    }

    return null
  }

  useEffect(() => {
    const element = elementRef?.current ?? null
    const target: HTMLElement | Window = element ?? window
    const listenTouch = inputMode === 'touch' || inputMode === 'both'
    const listenMouse = inputMode === 'mouse' || inputMode === 'both'

    const onGestureStart = (x: number, y: number, eventTarget: HTMLElement) => {
      if (!isWithinStartRegion(x, y)) return

      const scrollableParent = findScrollableParent(eventTarget)

      gestureEndRef.current = null
      gestureStartRef.current = {
        x,
        y,
        scrollY: scrollableParent?.scrollTop ?? window.scrollY,
        time: performance.now(),
      }
      isScrollingRef.current = !!scrollableParent
    }

    const onGestureMove = (x: number, y: number, eventTarget: HTMLElement) => {
      const scrollableParent = findScrollableParent(eventTarget)
      const currentScrollY = scrollableParent?.scrollTop ?? window.scrollY

      gestureEndRef.current = {
        x,
        y,
        scrollY: currentScrollY,
        time: performance.now(),
      }

      if (gestureStartRef.current && Math.abs(currentScrollY - gestureStartRef.current.scrollY) > 5) {
        isScrollingRef.current = true
      }
    }

    const resolveSwipeDirection = (start: GesturePoint, end: GesturePoint): SwipeDirection | null => {
      const deltaX = end.x - start.x
      const deltaY = end.y - start.y
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      const minDistance = thresholdRef.current
      const maxCrossAxis = crossAxisThresholdRef.current

      if (absX < minDistance && absY < minDistance) {
        return null
      }

      if (absX >= absY && absX >= minDistance && absY <= maxCrossAxis) {
        return deltaX > 0 ? 'leftToRight' : 'rightToLeft'
      }

      if (absY > absX && absY >= minDistance && absX <= maxCrossAxis) {
        return deltaY > 0 ? 'topToBottom' : 'bottomToTop'
      }

      return null
    }

    const onGestureEnd = () => {
      const start = gestureStartRef.current
      const end = gestureEndRef.current

      if (!start || !end) {
        gestureStartRef.current = null
        gestureEndRef.current = null
        isScrollingRef.current = false
        return
      }

      if (isScrollingRef.current || Math.abs(start.scrollY - end.scrollY) > 5) {
        gestureStartRef.current = null
        gestureEndRef.current = null
        isScrollingRef.current = false
        return
      }

      const maxSwipeTime = maxSwipeTimeRef.current
      if (maxSwipeTime !== undefined && end.time - start.time > maxSwipeTime) {
        gestureStartRef.current = null
        gestureEndRef.current = null
        isScrollingRef.current = false
        return
      }

      const direction = resolveSwipeDirection(start, end)

      if (direction && onSwipeRef.current) {
        onSwipeRef.current({ direction })
      }

      gestureStartRef.current = null
      gestureEndRef.current = null
      isScrollingRef.current = false
    }

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return
      onGestureStart(e.touches[0].clientX, e.touches[0].clientY, e.target as HTMLElement)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return
      onGestureMove(e.touches[0].clientX, e.touches[0].clientY, e.target as HTMLElement)
    }

    const onTouchEnd = () => {
      onGestureEnd()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return
      onGestureMove(e.clientX, e.clientY, e.target as HTMLElement)
    }

    const onMouseUp = () => {
      if (!isMouseDownRef.current) return
      isMouseDownRef.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      onGestureEnd()
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      if (!isWithinStartRegion(e.clientX, e.clientY)) return
      isMouseDownRef.current = true
      onGestureStart(e.clientX, e.clientY, e.target as HTMLElement)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    }

    const passiveOptions: AddEventListenerOptions = { passive: true }

    if (listenTouch) {
      target.addEventListener('touchstart', onTouchStart, passiveOptions)
      target.addEventListener('touchmove', onTouchMove, passiveOptions)
      target.addEventListener('touchend', onTouchEnd, passiveOptions)
    }

    if (listenMouse) {
      target.addEventListener('mousedown', onMouseDown)
    }

    return () => {
      if (listenTouch) {
        target.removeEventListener('touchstart', onTouchStart)
        target.removeEventListener('touchmove', onTouchMove)
        target.removeEventListener('touchend', onTouchEnd)
      }

      if (listenMouse) {
        target.removeEventListener('mousedown', onMouseDown)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }
    }
  }, [elementRef, inputMode])

  return elementRef
}
