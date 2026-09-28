import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { LoadingSpinner } from '../layout/loading/LoadingSpinner'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | null

export type ButtonColoringStyle = 'outline' | 'solid' | 'text' | 'tonal' | 'tonal-outline' | null

const buttonColorsList = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

export type ButtonColor = typeof buttonColorsList[number] | null

export const ButtonUtil = {
  colors: buttonColorsList,
}

export type PressableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize,
  color?: ButtonColor,
  coloringStyle?: ButtonColoringStyle,
  isProcessing?: boolean,
}

export const Pressable = forwardRef<HTMLButtonElement, PressableProps>(function Pressable({
  children,
  size = 'md',
  color = 'primary',
  coloringStyle = 'solid',
  disabled,
  isProcessing = false,
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
      data-color={color ?? undefined}
      data-coloringstyle={coloringStyle ?? undefined}
    >
      {children}
      {isProcessing && (
        <span className="pressable-processing-overlay">
          <LoadingSpinner />
        </span>
      )}
    </button>
  )
})
