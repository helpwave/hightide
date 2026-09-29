import clsx from 'clsx'
import type { ElementType } from 'react'
import { forwardRef } from 'react'

import type { IconSize } from '../display-and-visualization/Icon'
import { Icon } from '../display-and-visualization/Icon'
import { LoadingSpinner } from '../layout/loading/LoadingSpinner'
import type { ButtonVariant, PressableProps } from './Pressable'
import { mapButtonVariant, Pressable } from './Pressable'

export {
  ButtonUtil,
  Pressable,
  buttonVariants,
  mapButtonVariant,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  type ColoringColorVariant,
  type ColoringStyle,
  type PressableProps,
} from './Pressable'

export type ButtonProps = Omit<PressableProps, 'children' | 'coloringStyle' | 'colorVariant' | 'bordered' | 'elevated' | 'processingIndicator'> & {
  children: string,
  leading?: ElementType,
  trailing?: ElementType,
  variant?: ButtonVariant,
}

const buttonIconSize = (size: ButtonProps['size']): IconSize => (
  size === 'xs' || size === 'sm' ? 'sm' : 'md'
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  children,
  leading,
  trailing,
  className,
  size = 'md',
  variant = 'filled',
  isProcessing = false,
  ...props
}, ref) {
  const iconSize = buttonIconSize(size)
  const coloring = mapButtonVariant(variant)
  const showLeadingSpinner = isProcessing && !!leading && !trailing
  const showTrailingSpinner = isProcessing && !showLeadingSpinner

  return (
    <Pressable
      {...props}
      {...coloring}
      ref={ref}
      size={size}
      isProcessing={isProcessing}
      processingIndicator={false}
      className={clsx('button coloring', className)}
    >
      {showLeadingSpinner ? (
        <LoadingSpinner size={iconSize} />
      ) : leading && (
        <Icon icon={leading} size={iconSize} />
      )}
      {children}
      {showTrailingSpinner ? (
        <LoadingSpinner size={iconSize} />
      ) : trailing && (
        <Icon icon={trailing} size={iconSize} />
      )}
    </Pressable>
  )
})
