import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect } from 'react'
import { useId } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Visibility } from '@/src/components/layout/Visibility'
import type { FloatingElementAlignment } from '@/src/hooks/useFloatingElement'
import { useFloatingElement } from '@/src/hooks/useFloatingElement'
import { createPortal } from 'react-dom'
import type { UseOverlayRegistryProps } from '@/src/hooks/useOverlayRegistry'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import { PropsUtil } from '@/src/utils/propsUtil'
import type { TooltipConfig } from '@/src/contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/contexts/HightideConfigContext'

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
  appearDelay: appearOverwrite,
  tooltipClassName,
  containerClassName,
  position = 'bottom',
  disabled = false,
}: TooltipProps) => {
  const id = useId()
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const { config } = useHightideConfig()

  const appearDelay = useMemo(() =>
    appearOverwrite ?? config.tooltip.appearDelay,
  [appearOverwrite, config.tooltip.appearDelay])

  const anchorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triangleRef = useRef<HTMLDivElement>(null)

  const isActive = !disabled && open

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

  const openWithDelay = useCallback(() => {
    if (timeoutRef.current || open) return

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null
      setOpen(true)
    }, appearDelay)
  }, [appearDelay, open])


  const close = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
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
      }
    }
  }, [])


  return (
    <div
      ref={anchorRef}
      className={clsx('relative inline-block', containerClassName)}
      aria-describedby={isVisible ? id : undefined}
      onPointerEnter={openWithDelay}
      onPointerLeave={close}
      onPointerCancel={close}
      onFocus={openWithDelay}
      onBlur={close}
    >
      {children}
      <Visibility isVisible={isActive || isVisible}>
        {createPortal(
          <div
            ref={containerRef}
            id={id}

            {...callbacks}

            data-name={PropsUtil.dataAttributes.name('tooltip')}
            data-state={transitionState}

            role="tooltip"
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
