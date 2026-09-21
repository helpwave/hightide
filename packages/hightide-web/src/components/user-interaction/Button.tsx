import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { LoadingSpinner } from '../layout/loading/LoadingSpinner'

/**
 * The different sizes for a button
 */
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | null

type ButtonColoringStyle = 'outline' | 'solid' | 'text' | 'tonal' | 'tonal-outline' | null

const buttonColorsList = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

/**
 * The allowed colors for the Button
 */
export type ButtonColor = typeof buttonColorsList[number] | null

export const ButtonUtil = {
  colors: buttonColorsList,
}

/**
 * The shard properties between all button types
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * @default 'medium'
   */
  size?: ButtonSize,
  color?: ButtonColor,
  /**
   * @default 'solid'
   */
  coloringStyle?: ButtonColoringStyle,
  allowClickEventPropagation?: boolean,
  isProcessing?: boolean,
}

/**
 * A button with a solid background and different sizes
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function SolidButton({
  children,
  size = 'md',
  color = 'primary',
  coloringStyle = 'solid',
  disabled,
  allowClickEventPropagation = false,
  isProcessing = false,
  ...props
}, ref) {
  return (
    <button
      {...props}
      ref={ref}
      disabled={disabled}
      aria-busy={isProcessing || undefined}
      type={props['type'] ?? 'button'}

      onClick={event => {
        if (isProcessing) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        if(!allowClickEventPropagation) {
          event.stopPropagation()
        }
        props.onClick?.(event)
      }}

      data-name={props['data-name'] ?? 'button'}
      data-disabled={disabled ? '': undefined}
      data-processing={isProcessing ? '': undefined}
      data-size={size ?? undefined}
      data-color={color ?? undefined}
      data-coloringstyle={coloringStyle ?? undefined}
    >
      {children}
      {isProcessing && (
        <span data-name="button-processing-overlay">
          <LoadingSpinner />
        </span>
      )}
    </button>
  )
})
