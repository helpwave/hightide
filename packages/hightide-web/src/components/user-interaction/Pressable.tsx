import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { LoadingSpinner } from '../layout/loading/LoadingSpinner'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | null

export type ColoringStyle = 'filled' | 'foreground'

export type ColoringColorVariant = 'normal' | 'tonal' | 'transparent'

export const buttonVariants = ['elevated', 'filled', 'tonal', 'outlined', 'foreground'] as const

export type ButtonVariant = typeof buttonVariants[number]

export const iconButtonVariants = ['elevated', 'filled', 'tonal', 'foreground'] as const

export type IconButtonVariant = typeof iconButtonVariants[number]

const buttonColorsList = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

export type ButtonColor = typeof buttonColorsList[number] | null

export const ButtonUtil = {
  colors: buttonColorsList,
  variants: buttonVariants,
}

export const mapButtonVariant = (variant: ButtonVariant) => {
  switch (variant) {
  case 'elevated':
    return { coloringStyle: 'filled', colorVariant: 'normal', bordered: false, elevated: true } as const
  case 'filled':
    return { coloringStyle: 'filled', colorVariant: 'normal', bordered: false, elevated: false } as const
  case 'tonal':
    return { coloringStyle: 'filled', colorVariant: 'tonal', bordered: false, elevated: false } as const
  case 'outlined':
    return { coloringStyle: 'foreground', colorVariant: 'normal', bordered: true, elevated: false } as const
  case 'foreground':
    return { coloringStyle: 'foreground', colorVariant: 'normal', bordered: false, elevated: false } as const
  }
}

export type PressableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize,
  color?: ButtonColor,
  coloringStyle?: ColoringStyle,
  colorVariant?: ColoringColorVariant,
  bordered?: boolean,
  elevated?: boolean,
  isProcessing?: boolean,
  processingIndicator?: boolean,
}

export const Pressable = forwardRef<HTMLButtonElement, PressableProps>(function Pressable({
  children,
  size = 'md',
  color = 'primary',
  coloringStyle = 'filled',
  colorVariant = 'normal',
  bordered = false,
  elevated = false,
  disabled,
  isProcessing = false,
  processingIndicator = true,
  className,
  type,
  onClick,
  ...props
}, ref) {
  return (
    <button
      {...props}
      ref={ref}
      disabled={disabled}
      aria-busy={isProcessing || undefined}
      type={type ?? 'button'}
      onClick={event => {
        if (isProcessing) {
          return
        }
        onClick?.(event)
      }}
      className={clsx('pressable coloring', className)}
      data-disabled={disabled ? '' : undefined}
      data-processing={isProcessing ? '' : undefined}
      data-size={size ?? undefined}
      data-color={color ?? undefined}
      data-coloring-style={coloringStyle}
      data-color-variant={colorVariant}
      data-bordered={bordered ? '' : undefined}
      data-elevated={elevated ? '' : undefined}
    >
      {children}
      {isProcessing && processingIndicator && (
        <span className="pressable-processing-overlay">
          <LoadingSpinner />
        </span>
      )}
    </button>
  )
})
