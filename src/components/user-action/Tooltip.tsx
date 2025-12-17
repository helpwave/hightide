import type { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { useZIndexRegister } from '@/src/hooks/useZIndexRegister'
import { Visibility } from '@/src/components/layout/Visibility'

type Position = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = PropsWithChildren<{
  tooltip: ReactNode,
  /**
   * Number of milliseconds until the tooltip appears
   *
   * defaults to 400ms
   */
  appearDelay?: number,
  /**
   * Number of milliseconds until the tooltip disappears
   *
   * defaults to 50ms
   */
  disappearDelay?: number,
  /**
   * Class names of additional styling properties for the tooltip
   */
  tooltipClassName?: string,
  /**
   * Class names of additional styling properties for the container from which the tooltip will be created
   */
  containerClassName?: string,
  position?: Position,
}>

type TooltipState = {
  isShown: boolean,
  timer: NodeJS.Timeout | null,
}

/**
 * A Component for showing a tooltip when hovering over Content
 * @param tooltip The tooltip to show can be a text or any ReactNode
 * @param children The Content for which the tooltip should be created
 * @param animationDelay The delay before the tooltip appears
 * @param tooltipClassName Additional ClassNames for the Container of the tooltip
 * @param containerClassName Additional ClassNames for the Container holding the content
 * @param position The direction of the tooltip relative to the Container
 * @constructor
 */
export const Tooltip = ({
                          tooltip,
                          children,
                          appearDelay = 400,
                          disappearDelay = 50,
                          tooltipClassName = '',
                          containerClassName = '',
                          position = 'bottom',
                        }: TooltipProps) => {
  const [state, setState] = useState<TooltipState>({
    isShown: false,
    timer: null,
  })
  const { isShown } = state

  const positionClasses = {
    top: `bottom-full left-1/2 -translate-x-1/2 mb-[6px]`,
    bottom: `top-full left-1/2 -translate-x-1/2 mt-[6px]`,
    left: `right-full top-1/2 -translate-y-1/2 mr-[6px]`,
    right: `left-full top-1/2 -translate-y-1/2 ml-[6px]`
  }

  const triangleSize = 6
  const triangleClasses = {
    top: `top-full left-1/2 -translate-x-1/2 border-t-tooltip-background border-l-transparent border-r-transparent`,
    bottom: `bottom-full left-1/2 -translate-x-1/2 border-b-tooltip-background border-l-transparent border-r-transparent`,
    left: `left-full top-1/2 -translate-y-1/2 border-l-tooltip-background border-t-transparent border-b-transparent`,
    right: `right-full top-1/2 -translate-y-1/2 border-r-tooltip-background border-t-transparent border-b-transparent`
  }

  const triangleStyle: Record<Position, CSSProperties> = {
    top: { borderWidth: `${triangleSize}px ${triangleSize}px 0 ${triangleSize}px` },
    bottom: { borderWidth: `0 ${triangleSize}px ${triangleSize}px ${triangleSize}px` },
    left: { borderWidth: `${triangleSize}px 0 ${triangleSize}px ${triangleSize}px` },
    right: { borderWidth: `${triangleSize}px ${triangleSize}px ${triangleSize}px 0` }
  }

  const zIndex = useZIndexRegister(isShown)

  return (
    <div
      className={clsx('relative inline-block', containerClassName)}
      onMouseEnter={() => setState(prevState => {
        clearTimeout(prevState.timer)
        return {
          ...prevState,
          timer: setTimeout(() => {
            setState(prevState => {
              clearTimeout(prevState.timer)
              return { isShown: true, timer: null }
            })
          }, appearDelay)
        }
      })}
      onMouseLeave={() => setState(prevState => {
        clearTimeout(prevState.timer)
        return {
          ...prevState,
          timer: setTimeout(() => {
            setState(prevState => {
              clearTimeout(prevState.timer)
              return { isShown: false, timer: null }
            })
          }, disappearDelay)
        }
      })}
    >
      {children}
      <Visibility isVisible={isShown}>
        <div
          className={clsx(
            `opacity-0 absolute text-xs font-semibold text-tooltip-text px-2 py-1 rounded whitespace-nowrap
           animate-tooltip-fade-in shadow-around-md bg-tooltip-background`,
            positionClasses[position], tooltipClassName
          )}
          style={{ zIndex, animationDelay: appearDelay + 'ms' }}
        >
          {tooltip}
          <div
            className={clsx(`absolute w-0 h-0`, triangleClasses[position])}
            style={{ ...triangleStyle[position], zIndex: zIndex + 1 }}
          />
        </div>
      </Visibility>
    </div>
  )
}
