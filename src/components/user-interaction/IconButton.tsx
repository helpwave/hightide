import type { ReactNode } from 'react'
import { forwardRef, useImperativeHandle, useRef, type ButtonHTMLAttributes } from 'react'
import type { TooltipDisplayProps } from './Tooltip'
import { TooltipContext, TooltipDisplay, TooltipRoot, useTooltip } from './Tooltip'
import { Visibility } from '../layout/Visibility'
import { useLogOnce } from '@/src/hooks/useLogOnce'

/**
 * The different sizes for a icon button
 */
type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | null

type IconButtonColoringStyle = 'outline' | 'solid' | 'text' | 'tonal' | 'tonal-outline' | null



export interface IconButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * @default 'medium'
     */
    size?: IconButtonSize,
    /**
     * @default 'solid'
     */
    coloringStyle?: IconButtonColoringStyle,
}

export const IconButtonBase = forwardRef<HTMLButtonElement, IconButtonBaseProps>(function IconButtonBase({
  children,
  size = 'md',
  color = 'primary',
  coloringStyle = 'solid',
  disabled,
  ...props
}, ref) {
  return (
    <button
      {...props}
      ref={ref}
      disabled={disabled}
      type={props['type'] ?? 'button'}


      onClick={event => {
        props.onClick?.(event)
      }}

      data-name={props['data-name'] ?? 'icon-button'}
      data-disabled={disabled ? '': undefined}
      data-size={size ?? undefined}
      data-color={color ?? undefined}
      data-coloringstyle={coloringStyle ?? undefined}
    >
      {children}
    </button>
  )
})






type IconButtonTooltipTriggerProps = IconButtonBaseProps


const IconButtonTooltipTrigger = forwardRef<HTMLButtonElement, IconButtonTooltipTriggerProps>(function IconButtonTooltipTrigger({
  disabled,
  ...props
}, ref) {
  const { trigger: { ref: triggerRef, props: tooltipTriggerProps } } = useTooltip()

  const innerRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => innerRef.current)
  useImperativeHandle(triggerRef, () => innerRef.current)

  return (
    <IconButtonBase
      {...props}
      ref={innerRef}
      disabled={disabled}
      type={props['type'] ?? 'button'}

      onClick={event => {
        if(!disabled) {
          tooltipTriggerProps.onClick()
        }
        props.onClick?.(event)
      }}
      onKeyDown={(e) => {
        if(!disabled) {
          if(e.key === 'Enter' || e.key === ' ') {
            tooltipTriggerProps.onClick()
          }
        }
        props.onKeyDown?.(e)
      }}
      onPointerEnter={(e) => {
        if(!disabled) {
          tooltipTriggerProps.onPointerEnter()
        }
        props.onPointerEnter?.(e)
      }}
      onPointerLeave={(e) => {
        if(!disabled) {
          tooltipTriggerProps.onPointerLeave()
        }
        props.onPointerLeave?.(e)
      }}
      onPointerCancel={(e) => {
        if(!disabled) {
          tooltipTriggerProps.onPointerCancel()
        }
        props.onPointerCancel?.(e)
      }}
      onBlur={(e) => {
        if(!disabled) {
          tooltipTriggerProps.onBlur()
        }
        props.onBlur?.(e)
      }}
    />
  )
})



export interface IconButtonProps extends IconButtonBaseProps {
  useTooltipAsLabel?: boolean,
  tooltip?: ReactNode,
  tooltipProps?: Omit<TooltipDisplayProps, 'children' | 'isShown'>,
}

/**
 * A icon button with a tooltip
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({
  tooltip,
  tooltipProps,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  useTooltipAsLabel = true,
  color = 'neutral',
  disabled,
  ...props
}, ref) {
  const isLabeled = !!ariaLabel || !!ariaLabelledby
  const isTooltipLabel = useTooltipAsLabel && !!tooltip

  useLogOnce('IconButton: Either provide "aria-label" or "aria-labelledby" or use ' +
    '"useTooltipAsLabel" and "tooltip" to give the icon button a semantic meaning',
  !isLabeled && !isTooltipLabel, { type: 'warning' })

  return (
    <TooltipRoot disabled={disabled}>
      <TooltipContext.Consumer>
        {({ tooltip: { id } }) => (
          <IconButtonTooltipTrigger
            {...props}
            ref={ref}

            color={color}
            disabled={disabled}

            aria-describedby={props['aria-describedby'] ?? (isLabeled && !!tooltip ? id : undefined)}
            aria-labelledby={isLabeled ? ariaLabelledby : (isTooltipLabel ? id : undefined)}
            aria-label={ariaLabel}
          />
        )}
      </TooltipContext.Consumer>
      <Visibility isVisible={!!tooltip}>
        <TooltipDisplay aria-hidden={!useTooltipAsLabel && !!props['aria-hidden']} {...tooltipProps}>
          {tooltip}
        </TooltipDisplay>
      </Visibility>
    </TooltipRoot>
  )
})