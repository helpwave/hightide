import type { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Visibility } from '@/src/components/layout/Visibility'
import { useFloatingElement } from '@/src/hooks/useFloatingElement'
import { createPortal } from 'react-dom'
import type { TooltipConfig } from '@/src/contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/contexts/HightideConfigContext'
import { DataAttributesUtil } from '@/src/utils/dataAttribute'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'

type TooltipState = {
  isShown: boolean,
  timer: NodeJS.Timeout | null,
}

type Position = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = PropsWithChildren & Partial<TooltipConfig> & {
  tooltip: ReactNode,
  /**
   * Class names of additional styling properties for the tooltip
   */
  tooltipClassName?: string,
  /**
   * Class names of additional styling properties for the container from which the tooltip will be created
   */
  containerClassName?: string,
  position?: Position,
  disabled?: boolean,
}

/**
 * A Component for showing a tooltip when hovering over Content
 * @param tooltip The tooltip to show can be a text or any ReactNode
 * @param children The Content for which the tooltip should be created
 * @param tooltipClassName Additional ClassNames for the Container of the tooltip
 * @param containerClassName Additional ClassNames for the Container holding the content
 * @param position The direction of the tooltip relative to the Container
 * @constructor
 */
export const Tooltip = ({
  tooltip,
  children,
  appearDelay: appearDelayOverwrite,
  disappearDelay: disappearDelayOverwrite,
  tooltipClassName = '',
  containerClassName = '',
  position = 'bottom',
  disabled = false,
}: TooltipProps) => {
  const [state, setState] = useState<TooltipState>({
    isShown: false,
    timer: null,
  })
  const { config } = useHightideConfig()
  const appearDelay = useMemo(
    () => appearDelayOverwrite ?? config.tooltip.appearDelay,
    [config.tooltip.appearDelay, appearDelayOverwrite]
  )
  const disappearDelay = useMemo(
    () => disappearDelayOverwrite ?? config.tooltip.disappearDelay,
    [config.tooltip.disappearDelay, disappearDelayOverwrite]
  )
  const { isShown } = state
  const anchorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triangleRef = useRef<HTMLDivElement>(null)

  const triangleSize = 0.375
  const triangleClasses = {
    top: `border-t-tooltip-background border-l-transparent border-r-transparent`,
    bottom: `border-b-tooltip-background border-l-transparent border-r-transparent`,
    left: `border-l-tooltip-background border-t-transparent border-b-transparent`,
    right: `border-r-tooltip-background border-t-transparent border-b-transparent`
  }

  const triangleStyle: Record<Position, CSSProperties> = {
    top: {
      borderWidth: `${triangleSize}rem ${triangleSize}rem 0 ${triangleSize}rem`,
      transform: `translate(0,${triangleSize}rem)`
    },
    bottom: {
      borderWidth: `0 ${triangleSize}rem ${triangleSize}rem ${triangleSize}rem`,
      transform: `translate(0,-${triangleSize}rem)`
    },
    left: {
      borderWidth: `${triangleSize}rem 0 ${triangleSize}rem ${triangleSize}rem`,
      transform: `translate(${triangleSize}rem,0)`
    },
    right: {
      borderWidth: `${triangleSize}rem ${triangleSize}rem ${triangleSize}rem 0`,
      transform: `translate(-${triangleSize}rem,0)`
    }
  }

  const isActive = !disabled && isShown

  const css = useFloatingElement({
    active: isActive,
    anchorRef: anchorRef,
    containerRef,
    horizontalAlignment: position === 'left' ? 'beforeStart' : position === 'right' ? 'afterEnd' : 'center',
    verticalAlignment: position === 'top' ? 'beforeStart' : position === 'bottom' ? 'afterEnd' : 'center',
  })

  const cssTriangle = useFloatingElement({
    active: isActive,
    anchorRef: anchorRef,
    containerRef: triangleRef,
    horizontalAlignment: position === 'left' ? 'beforeStart' : position === 'right' ? 'afterEnd' : 'center',
    verticalAlignment: position === 'top' ? 'beforeStart' : position === 'bottom' ? 'afterEnd' : 'center',
  })

  const { zIndex } = useOverlayRegistry({ isActive })
  const { zIndex: zIndexTriangle } = useOverlayRegistry({ isActive })

  return (
    <div
      ref={anchorRef}
      className={clsx('relative inline-block', containerClassName)}
      onPointerEnter={() => setState(prevState => {
        if (prevState.isShown) {
          clearTimeout(state.timer)
          return {
            ...prevState,
            timer: null
          }
        }
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
      onPointerLeave={() => setState(prevState => {
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
      <Visibility isVisible={isActive}>
        {createPortal(
          <div
            ref={containerRef}

            onPointerEnter={() => setState(prevState => {
              if (prevState.isShown) {
                clearTimeout(state.timer)
                return {
                  ...prevState,
                  timer: null
                }
              }
            })}

            data-name={DataAttributesUtil.name('tooltip')}

            className={tooltipClassName}
            style={{ ...css, zIndex, animationDelay: appearDelay + 'ms' }}
          >
            {tooltip}
          </div>
          , document.body
        )}
        {createPortal(
          <div
            ref={triangleRef}
            className={clsx(`absolute w-0 h-0 opacity-0 animate-tooltip-fade-in`, triangleClasses[position])}
            style={{
              ...cssTriangle,
              ...triangleStyle[position],
              zIndex: zIndexTriangle,
              animationDelay: appearDelay + 'ms'
            }}
          />
          , document.body
        )}
      </Visibility>
    </div>
  )
}
