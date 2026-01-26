import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect } from 'react'
import { useId } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Visibility } from '@/src/components/layout/Visibility'
import type { FloatingElementAlignment } from '@/src/hooks/useAnchoredPosition'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import type { TooltipConfig } from '@/src/global-contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/global-contexts/HightideConfigContext'
import { Portal } from '@/src/components/utils/Portal'
import { AnchoredFloatingContainer } from '../layout/AnchoredFloatingContainer'

type Position = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps extends PropsWithChildren, Partial<TooltipConfig> {
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
  appearDelay: appearOverwrite,
  isAnimated: isAnimatedOverwrite,
  tooltipClassName,
  containerClassName,
  position = 'bottom',
  disabled = false,
}: TooltipProps) => {
  const id = useId()
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)

  const { config } = useHightideConfig()

  const appearDelay = useMemo(() =>
    appearOverwrite ?? config.tooltip.appearDelay,
  [appearOverwrite, config.tooltip.appearDelay])

  const isAnimated = useMemo(() =>
    isAnimatedOverwrite ?? config.tooltip.isAnimated,
  [isAnimatedOverwrite, config.tooltip.isAnimated])

  const anchor = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)

  const isActive = !disabled && open

  const { isVisible, transitionState } = useTransitionState(
    useMemo(() => ({ isOpen: isActive, ref: container }), [isActive])
  )

  const verticalAlignment: FloatingElementAlignment = useMemo(() =>
    position === 'top' ? 'beforeStart' : position === 'bottom' ? 'afterEnd' : 'center',
  [position])

  const horizontalAlignment: FloatingElementAlignment = useMemo(() =>
    position === 'left' ? 'beforeStart' : position === 'right' ? 'afterEnd' : 'center',
  [position])

  const { zIndex } = useOverlayRegistry({ isActive: isActive })

  const openWithDelay = useCallback(() => {
    if (timeoutRef.current || open) return

    if(appearDelay < 0) {
      setOpen(true)
      return
    }

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = undefined
      setOpen(true)
    }, appearDelay)
  }, [appearDelay, open])


  const close = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return

    const closeOnBlur = () => close()
    const closeOnScroll = () => close()

    window.addEventListener('blur', closeOnBlur)
    window.addEventListener('scroll', closeOnScroll, true)

    return () => {
      window.removeEventListener('blur', closeOnBlur)
      window.removeEventListener('scroll', closeOnScroll, true)
    }
  }, [open, close])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    }
  }, [])

  return (
    <div
      ref={anchor}
      className={clsx('relative inline-block', containerClassName)}
      aria-describedby={isVisible ? id : undefined}
      onPointerEnter={openWithDelay}
      onPointerLeave={close}
      onPointerCancel={close}
      onClick={close}
      onFocus={openWithDelay}
      onBlur={close}
    >
      {children}
      <Visibility isVisible={isVisible}>
        <Portal>
          <AnchoredFloatingContainer
            ref={container}
            id={id}
            anchor={anchor}
            options={{
              verticalAlignment,
              horizontalAlignment,
              avoidOverlap: true,
            }}
            data-state={transitionState}
            data-animated={isAnimated ? '': undefined}

            role="tooltip"
            className={clsx('tooltip', tooltipClassName)}
            style={{ zIndex, position: 'fixed' }}
          >
            {tooltip}
          </AnchoredFloatingContainer>
        </Portal>
      </Visibility>
    </div>
  )
}
