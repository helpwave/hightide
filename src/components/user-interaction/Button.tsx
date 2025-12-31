import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

/**
 * The different sizes for a button
 */
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | null

type ButtonColoringStyle = 'outline' | 'solid' | 'text' | 'tonal' | null

type ButtonLayout = 'icon' | 'default' | null

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
  layout?: ButtonLayout,
  color?: ButtonColor,
  /**
   * @default 'solid'
   */
  coloringStyle?: ButtonColoringStyle,
  allowClickEventPropagation?: boolean,
}

/**
 * A button with a solid background and different sizes
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function SolidButton({
  children,
  layout = 'default',
  size = 'md',
  color = 'primary',
  coloringStyle = 'solid',
  disabled,
  allowClickEventPropagation = false,
  ...props
}, ref) {
  return (
    <button
      {...props}
      ref={ref}
      disabled={disabled}

      onClick={event => {
        if(!allowClickEventPropagation) {
          event.stopPropagation()
        }
        props.onClick?.(event)
      }}

      type={props['type'] ?? 'button'}

      data-name={props['data-name'] ?? 'button'}
      data-disabled={disabled ? '': undefined}
      data-size={size ?? undefined}
      data-layout={layout ?? undefined}
      data-color={color ?? undefined}
      data-coloringstyle={coloringStyle ?? undefined}
    >
      {children}
    </button>
  )
})
