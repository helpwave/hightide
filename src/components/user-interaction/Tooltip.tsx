import type { PropsWithChildren, ReactNode } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Visibility } from '@/src/components/layout/Visibility'
import type { FloatingElementAlignment } from '@/src/hooks/useFloatingElement'
import { useFloatingElement } from '@/src/hooks/useFloatingElement'
import { createPortal } from 'react-dom'
import type { TooltipConfig } from '@/src/contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/contexts/HightideConfigContext'
import type { UseOverlayRegistryProps } from '@/src/hooks/useOverlayRegistry'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import { PropsUtil } from '@/src/utils/propsUtil'

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
  tooltipClassName,
  containerClassName,
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
  const anchorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triangleRef = useRef<HTMLDivElement>(null)

  const isActive = !disabled && state.isShown

  const { isVisible, transitionState, callbacks } = useTransitionState(
    useMemo(() => ({ isOpen: isActive }), [isActive])
  )

  const verticalAlignment: FloatingElementAlignment = useMemo(() =>
    position === 'top' ? 'beforeStart' : position === 'bottom' ? 'afterEnd' : 'center',
    [position])

  const horizontalAlignment: FloatingElementAlignment = useMemo(() =>
    position === 'left' ? 'beforeStart' : position === 'right' ? 'afterEnd' : 'center',
    [position])

  const css = useFloatingElement(useMemo(() => ({
    active: isActive || isVisible,
    anchorRef: anchorRef,
    containerRef,
    horizontalAlignment,
    verticalAlignment,
  }), [horizontalAlignment, isActive, isVisible, verticalAlignment]))

  const cssTriangle = useFloatingElement(useMemo(() => ({
    active: isActive || isVisible,
    anchorRef: anchorRef,
    containerRef: triangleRef,
    horizontalAlignment,
    verticalAlignment,
  }), [horizontalAlignment, isActive, isVisible, verticalAlignment]))

  const regsitryOptions: UseOverlayRegistryProps = useMemo(() => ({ isActive }), [isActive])
  const { zIndex } = useOverlayRegistry(regsitryOptions)
  const { zIndex: zIndexTriangle } = useOverlayRegistry(regsitryOptions)

  const onEnter = useCallback(() => {
    setState(prevState => {
      if (prevState.isShown) {
        clearTimeout(prevState.timer)
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
            return { ...prevState, isShown: true, timer: null }
          })
        }, appearDelay)
      }
    })
  }, [appearDelay])

  const onLeave = useCallback(() => {
    setState(prevState => {
      if (!prevState.isShown) {
        clearTimeout(prevState.timer)
        return {
          ...prevState,
          timer: null
        }
      }
      clearTimeout(prevState.timer)
      return {
        ...prevState,
        timer: setTimeout(() => {
          setState(prevState => {
            clearTimeout(prevState.timer)
            return { ...prevState, isShown: false, timer: null }
          })
        }, disappearDelay)
      }
    })
  }, [disappearDelay])

  return (
    <div
      ref={anchorRef}
      className={clsx('relative inline-block', containerClassName)}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}
      <Visibility isVisible={isActive || isVisible}>
        {createPortal(
          <div
            ref={containerRef}

            {...callbacks}
            onPointerEnter={onEnter}

            data-name={PropsUtil.dataAttributes.name('tooltip')}
            data-state={transitionState}

            className={tooltipClassName}
            style={{ ...css, zIndex }}
          >
            {tooltip}
          </div>
          , document.body
        )}
        {createPortal(
          <div
            ref={triangleRef}

            data-name="tooltip-triangle"
            data-state={transitionState}
            data-position={position}

            style={{ ...cssTriangle, zIndex: zIndexTriangle }}
          />
          , document.body
        )}
      </Visibility>
    </div>
  )
}
