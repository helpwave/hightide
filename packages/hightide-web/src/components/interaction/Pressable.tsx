import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { LoadingSpinner } from '../visualization/LoadingSpinner'
import type { ColoringColor, ColoringColorVariant, ColoringStyle } from '../../utils/coloring'
import { ColoringUtils } from '../../utils/coloring'

export type { ColoringColor, ColoringColorVariant, ColoringMode, ColoringStyle } from '../../utils/coloring'
export { ColoringUtils } from '../../utils/coloring'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | null

export const buttonVariants = ['elevated', 'filled', 'tonal', 'outlined', 'foreground'] as const

export type ButtonVariant = typeof buttonVariants[number]

export const iconButtonVariants = ['elevated', 'filled', 'tonal', 'foreground'] as const

export type IconButtonVariant = typeof iconButtonVariants[number]

const buttonColorsList = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral', 'surfaceInverse'] as const

export type ButtonColor = typeof buttonColorsList[number] | null

export function coloringColorName(color: ButtonColor): ColoringColor | undefined {
  if (color === 'surfaceInverse') {
    return 'surface-inverse'
  }
  return color ?? undefined
}

export function buttonColorForVariant(variant: ButtonVariant | IconButtonVariant, color: ButtonColor) {
  if (variant === 'foreground' && color === 'neutral') {
    return 'surfaceInverse' as const
  }
  return color
}

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
      className={clsx('pressable', className)}
      data-disabled={disabled ? '' : undefined}
      data-processing={isProcessing ? '' : undefined}
      data-size={size ?? undefined}
      {...ColoringUtils.build({
        color: coloringColorName(color) ?? 'primary',
        mode: 'interactive',
        coloringStyle,
        colorVariant,
        bordered,
        elevated,
      })}
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
