import type { PropsWithChildren, ReactNode, RefObject } from 'react'
import { forwardRef, useContext, useEffect, useImperativeHandle } from 'react'
import { useId } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { clsx } from 'clsx'
import type { FloatingElementAlignment, UseAnchoredPositionOptions } from '@/src/hooks/useAnchoredPosition'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import type { TooltipConfig } from '@/src/global-contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/global-contexts/HightideConfigContext'
import { Portal } from '@/src/components/utils/Portal'
import type { AnchoredFloatingContainerProps } from '../layout/AnchoredFloatingContainer'
import { AnchoredFloatingContainer } from '../layout/AnchoredFloatingContainer'
import { createContext } from 'react'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'

export interface TooltipTriggerContextValue {
  ref: RefObject<HTMLElement>,
  callbackRef: (el: HTMLElement | null) => void,
  props: {
    'onPointerEnter': () => void,
    'onPointerLeave': () => void,
    'onPointerCancel': () => void,
    'onClick': () => void,
    'onFocus': () => void,
    'onBlur': () => void,
    'aria-describedby'?: string,
  },
}

export interface TooltipContextType {
  tooltip: {
    id: string,
    setId: (id: string) => void,
  },
  trigger: TooltipTriggerContextValue,
  disabled: boolean,
  isShown: boolean,
  open: () => void,
  close: () => void,
}

export const TooltipContext = createContext<TooltipContextType | null>(null)

export const useTooltip = () => {
  const context = useContext(TooltipContext)
  if(!context) {
    throw new Error('useTooltip must be used within a TooltipContext.Provider or TooltipRoot')
  }
  return context
}

export interface TooltipRootProps extends PropsWithChildren {
  isInitiallyShown?: boolean,
  appearDelay?: number,
  disabled?: boolean,
}

export const TooltipRoot = ({
  children,
  isInitiallyShown = false,
  appearDelay: appearOverwrite,
  disabled = false,
}: TooltipRootProps) => {
  const generatedId = 'tooltip-' + useId()
  const [tooltipId, setTooltipId] = useState<string | null>(generatedId)
  const [isShown, setIsShown] = useState(isInitiallyShown)

  const timeoutRef = useRef<NodeJS.Timeout>(undefined)

  const { config } = useHightideConfig()

  const appearDelay = useMemo(() =>
    appearOverwrite ?? config.tooltip.appearDelay,
  [appearOverwrite, config.tooltip.appearDelay])

  const triggerRef = useRef<HTMLElement>(null)

  const openWithDelay = useCallback(() => {
    if (timeoutRef.current || isShown) return

    if(appearDelay < 0) {
      setIsShown(true)
      return
    }

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = undefined
      setIsShown(true)
    }, appearDelay)
  }, [appearDelay, isShown])


  const close = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    setIsShown(false)
  }, [])

  useEffect(() => {
    if (!isShown) return

    const closeOnBlur = () => close()
    const closeOnScroll = () => close()

    window.addEventListener('blur', closeOnBlur)
    window.addEventListener('scroll', closeOnScroll, true)

    return () => {
      window.removeEventListener('blur', closeOnBlur)
      window.removeEventListener('scroll', closeOnScroll, true)
    }
  }, [isShown, close])

  useEffect(() => {
    if(disabled) {
      setIsShown(false)
      if(timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    }
  }, [disabled])

  const contextValue: TooltipContextType = useMemo(() => ({
    tooltip: {
      id: tooltipId,
      setId: setTooltipId,
    },
    trigger: {
      ref: triggerRef,
      callbackRef: (el: HTMLElement | null) => triggerRef.current = el,
      props: {
        'onPointerEnter': openWithDelay,
        'onPointerLeave': close,
        'onPointerCancel': close,
        'onClick': openWithDelay,
        'onFocus': openWithDelay,
        'onBlur': close,
        'aria-describedby': tooltipId,
      },
    },
    disabled,
    isShown,
    open: openWithDelay,
    close,
  }), [tooltipId, openWithDelay, close, isShown, disabled])

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  )
}







type TooltipAligment = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipDisplayProps extends Omit<AnchoredFloatingContainerProps, 'options'>, Partial<TooltipConfig> {
  alignment?: TooltipAligment,
  disabled?: boolean,
  isShown?: boolean,
  options?: Omit<UseAnchoredPositionOptions, 'verticalAlignment' | 'horizontalAlignment'>,
}

export const TooltipDisplay = forwardRef<HTMLDivElement, TooltipDisplayProps>(function TooltipAnchoredFloatingContainer({
  children,
  alignment = 'bottom',
  disabled: disabledOverwrite,
  isShown: isShownOverwrite,
  isAnimated: isAnimatedOverwrite,
  anchor: anchorOverwrite,
  ...props
}, forwardRef) {
  const { config } = useHightideConfig()
  const tooltipContext = useContext(TooltipContext)

  const disabled = disabledOverwrite ?? tooltipContext?.disabled
  const isShown = isShownOverwrite ?? tooltipContext?.isShown
  const anchor = anchorOverwrite ?? tooltipContext?.trigger.ref
  const id = tooltipContext?.tooltip.id ?? props.id

  useEffect(() => {
    if(!tooltipContext || !props.id) return
    tooltipContext?.tooltip.setId(props.id)
  }, [props.id, tooltipContext])

  const isAnimated = useMemo(() =>
    isAnimatedOverwrite ?? config.tooltip.isAnimated,
  [isAnimatedOverwrite, config.tooltip.isAnimated])

  const container = useRef<HTMLDivElement>(null)

  useImperativeHandle(forwardRef, () => container.current)

  const isActive = !disabled && isShown

  const { isVisible, transitionState } = useTransitionState(
    useMemo(() => ({ isOpen: isShown, ref: container }), [isShown])
  )

  const verticalAlignment: FloatingElementAlignment = useMemo(() =>
    alignment === 'top' ? 'beforeStart' : alignment === 'bottom' ? 'afterEnd' : 'center',
  [alignment])

  const horizontalAlignment: FloatingElementAlignment = useMemo(() =>
    alignment === 'left' ? 'beforeStart' : alignment === 'right' ? 'afterEnd' : 'center',
  [alignment])

  const { zIndex } = useOverlayRegistry({ isActive })

  if(disabled) return null
  return (
    <Portal>
      <AnchoredFloatingContainer
        {...props}
        id={id}
        ref={container}
        active={isVisible}
        anchor={anchor}
        options={{
          verticalAlignment,
          horizontalAlignment,
          avoidOverlap: true,
        }}
        data-state={transitionState}
        data-animated={isAnimated ? '': undefined}

        role="tooltip"
        data-name={props['data-name'] ?? 'tooltip'}
        style={{ zIndex, position: 'fixed', visibility: isVisible ? undefined : 'hidden', ...props.style }}
      >
        {children}
      </AnchoredFloatingContainer>
    </Portal>
  )
})



export interface TooltipTriggerBag extends TooltipTriggerContextValue {
  disabled: boolean,
  isShown: boolean,
}

export interface TooltipTriggerProps {
  children: (bag: TooltipTriggerBag) => ReactNode,
}

export const TooltipTrigger = ({
  children,
}: TooltipTriggerProps) => {
  const context = useTooltip()
  const bag: TooltipTriggerBag = { ...context.trigger, disabled: context.disabled, isShown: context.isShown }

  return BagFunctionUtil.resolve(children, bag)
}




export interface TooltipProps extends TooltipRootProps, Pick<TooltipDisplayProps, 'alignment' | 'disabled' |'isAnimated'> {
  tooltip: ReactNode,
  tooltipClassName?: string,
  containerClassName?: string,
}

/**
 * A Component for showing a tooltip when hovering over Content
 */
export const Tooltip = ({
  tooltip,
  children,
  isInitiallyShown,
  appearDelay,
  disabled,
  containerClassName,
  alignment,
  isAnimated,
}: TooltipProps) => {

  return (
    <TooltipRoot
      isInitiallyShown={isInitiallyShown}
      appearDelay={appearDelay}
      disabled={disabled}
    >
      <TooltipTrigger>
        {({ props, callbackRef, disabled }) => (
          <div
            ref={callbackRef}
            className={clsx(containerClassName)}
            {...(disabled ? undefined : props)}
          >
            {children}
          </div>
        )}
      </TooltipTrigger>
      <TooltipDisplay
        alignment={alignment}
        isAnimated={isAnimated}
      >
        {tooltip}
      </TooltipDisplay>
    </TooltipRoot>
  )
}
