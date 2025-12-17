import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

/**
 * The different sizes for a button
 */
type ButtonSize = 'tiny' | 'small' | 'medium' | 'large' | 'none'

type ButtonColoringStyle = 'outline' | 'solid' | 'text' | 'tonal' | 'none'

type ButtonLayout = 'icon' | 'default' | 'none'

const buttonColorsList = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral', 'none'] as const

/**
 * The allowed colors for the Button
 */
export type ButtonColor = typeof buttonColorsList[number]

const paddingMapping: Record<ButtonLayout, Partial<Record<ButtonSize, string>>> = {
  default: {
    tiny: 'btn-xs',
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  },
  icon: {
    tiny: 'icon-btn-xs',
    small: 'icon-btn-sm',
    medium: 'icon-btn-md',
    large: 'icon-btn-lg'
  },
  none: {}
}

export const ButtonUtil = {
  colors: buttonColorsList,
  colorClasses: {
    primary: 'primary',
    secondary: 'secondary',
    positive: 'positive',
    warning: 'warning',
    negative: 'negative',
    neutral: 'neutral',
    none: 'reset-coloring-variables',
  } satisfies Record<ButtonColor, string>
}

/**
 * The shard properties between all button types
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * @default 'medium'
   */
  size?: ButtonSize,
  layout?: ButtonLayout,
  color?: ButtonColor,
  /**
   * @default 'solid'
   */
  coloringStyle?: ButtonColoringStyle,
  startIcon?: ReactNode,
  endIcon?: ReactNode,
  allowClickEventPropagation?: boolean,
}

/**
 * A button with a solid background and different sizes
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function SolidButton({
                                                                                        children,
                                                                                        layout = 'default',
                                                                                        size = 'medium',
                                                                                        color = 'primary',
                                                                                        coloringStyle = 'solid',
                                                                                        startIcon,
                                                                                        endIcon,
                                                                                        disabled,
                                                                                        allowClickEventPropagation = false,
                                                                                        className,
                                                                                        ...restProps
                                                                                      }, ref) {
  const colorClasses = ButtonUtil.colorClasses[color]

  return (
    <button
      {...restProps}
      ref={ref}
      className={clsx(
        'group font-semibold',
        {
          'disabled': disabled,
          [colorClasses]: !disabled,
          'coloring-solid-hover': coloringStyle === 'solid',
          'coloring-text-hover': coloringStyle === 'text',
          'coloring-outline-hover': coloringStyle === 'outline',
          'coloring-tonal-hover': coloringStyle === 'tonal',
        },
        paddingMapping[layout][size],
        className
      )}
      onClick={event => {
        if(!allowClickEventPropagation) {
          event.stopPropagation()
        }
        restProps?.onClick(event)
      }}
      disabled={disabled}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  )
})
