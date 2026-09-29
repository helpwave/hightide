import type { ElementType, ForwardedRef, ReactNode } from 'react'
import { forwardRef,type ButtonHTMLAttributes } from 'react'
import { Icon } from '../display-and-visualization/Icon'
import type { ButtonColor, IconButtonVariant } from './Pressable'
import { mapButtonVariant } from './Pressable'
import type { TooltipDisplayProps } from './Tooltip'
import { TooltipContext, TooltipDisplay, TooltipRoot, useTooltip } from './Tooltip'
import { Visibility } from '../layout/Visibility'
import { LoadingSpinner } from '../layout/loading/LoadingSpinner'
import { useLogOnce } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import clsx from 'clsx'

/**
 * The different sizes for a icon button
 */
type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | null

export interface IconButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    /**
     * @default 'medium'
     */
    size?: IconButtonSize,
    color?: ButtonColor,
    variant?: IconButtonVariant,
    isProcessing?: boolean,
    icon?: ElementType,
}

export const IconButtonBase = forwardRef<HTMLButtonElement, IconButtonBaseProps>(function IconButtonBase({
  children,
  icon,
  size = 'md',
  color = 'primary',
  variant = 'filled',
  disabled,
  isProcessing = false,
  ...props
}, ref) {
  const coloring = mapButtonVariant(variant)
  return (
    <button
      {...props}
      ref={ref}
      disabled={disabled}
      aria-busy={isProcessing || undefined}
      type={props['type'] ?? 'button'}


      onClick={event => {
        if (isProcessing) {
          return
        }
        props.onClick?.(event)
      }}

      className={clsx('icon-button coloring', props.className)}
      data-disabled={disabled ? '': undefined}
      data-size={size ?? undefined}
      data-color={color ?? undefined}
      data-coloring-style={coloring.coloringStyle}
      data-color-variant={coloring.colorVariant}
      data-bordered={coloring.bordered ? '' : undefined}
      data-elevated={coloring.elevated ? '' : undefined}
    >
      {isProcessing ? <LoadingSpinner /> : (children ?? <Icon icon={icon} />)}
    </button>
  )
})






type IconButtonTooltipTriggerProps = IconButtonBaseProps


const IconButtonTooltipTrigger = forwardRef<HTMLButtonElement, IconButtonTooltipTriggerProps>(function IconButtonTooltipTrigger({
  disabled,
  isProcessing,
  ...props
}, ref) {
  const { trigger: { ref: triggerRef, props: tooltipTriggerProps } } = useTooltip()
  const isInteractionLocked = disabled || isProcessing

  return (
    <IconButtonBase
      {...props}
      ref={ReactUtils.assingRefsBuilder([ref, triggerRef as ForwardedRef<HTMLButtonElement>])}
      disabled={disabled}
      isProcessing={isProcessing}
      type={props['type'] ?? 'button'}

      onClick={event => {
        if (isProcessing) {
          return
        }
        if(!disabled) {
          tooltipTriggerProps.onClick()
        }
        props.onClick?.(event)
      }}
      onKeyDown={(e) => {
        if(!isInteractionLocked) {
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
        {(context) => {
          const id = context?.tooltip.id
          return (
            <IconButtonTooltipTrigger
              {...props}
              ref={ref}

              color={color}
              disabled={disabled}

              aria-describedby={props['aria-describedby'] ?? (isLabeled && !!tooltip ? id : undefined)}
              aria-labelledby={isLabeled ? ariaLabelledby : (isTooltipLabel ? id : undefined)}
              aria-label={ariaLabel}
            />
          )}}
      </TooltipContext.Consumer>
      <Visibility isVisible={!!tooltip}>
        <TooltipDisplay aria-hidden={!useTooltipAsLabel && !!props['aria-hidden']} {...tooltipProps}>
          {tooltip}
        </TooltipDisplay>
      </Visibility>
    </TooltipRoot>
  )
})