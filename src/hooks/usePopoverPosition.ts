import type { CSSProperties } from 'react'

export type PopoverHorizontalAlignment = 'leftOutside' | 'leftInside' | 'rightOutside' | 'rightInside' | 'center'
export type PopoverVerticalAlignment = 'topOutside' | 'topInside' | 'bottomOutside' | 'bottomInside' | 'center'

type PopoverPositionOptionsResolved = {
  edgePadding: number,
  outerGap: number,
  verticalAlignment: PopoverVerticalAlignment,
  horizontalAlignment: PopoverHorizontalAlignment,
  disabled: boolean,
}

type PopoverPositionOptions = Partial<PopoverPositionOptionsResolved>

const defaultPopoverPositionOptions: PopoverPositionOptionsResolved = {
  edgePadding: 16,
  outerGap: 4,
  horizontalAlignment: 'leftInside',
  verticalAlignment: 'bottomOutside',
  disabled: false,
}

export const usePopoverPosition = (trigger?: DOMRect, options?: PopoverPositionOptions): CSSProperties => {
  const {
    edgePadding,
    outerGap,
    verticalAlignment,
    horizontalAlignment,
    disabled
  }: PopoverPositionOptionsResolved = { ...defaultPopoverPositionOptions, ...options }

  if (disabled || !trigger) {
    return {}
  }

  const left: number = {
    leftOutside: trigger.left - outerGap,
    leftInside: trigger.left,
    rightOutside: trigger.right + outerGap,
    rightInside: trigger.right,
    center: trigger.left + trigger.width / 2,
  }[horizontalAlignment]

  const top: number = {
    topOutside: trigger.top - outerGap,
    topInside: trigger.top,
    bottomOutside: trigger.bottom + outerGap,
    bottomInside: trigger.bottom,
    center: trigger.top + trigger.height / 2,
  }[verticalAlignment]

  const translateX: string | undefined = {
    leftOutside: '-100%',
    leftInside: undefined,
    rightOutside: undefined,
    rightInside: '-100%',
    center: '-50%',
  }[horizontalAlignment]

  const translateY: string | undefined = {
    topOutside: '-100%',
    topInside: undefined,
    bottomOutside: undefined,
    bottomInside: '-100%',
    center: '-50%',
  }[verticalAlignment]

  return {
    left: Math.max(left, edgePadding),
    top: Math.max(top, edgePadding),
    translate: [translateX ?? '0', translateY ?? '0'].join(' ')
  }
}