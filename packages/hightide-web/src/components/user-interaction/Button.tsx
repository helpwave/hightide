import clsx from 'clsx'
import type { ElementType } from 'react'
import { forwardRef } from 'react'

import type { IconSize } from '../display-and-visualization/Icon'
import { Icon } from '../display-and-visualization/Icon'
import type { PressableProps } from './Pressable'
import { Pressable } from './Pressable'

export {
  ButtonUtil,
  Pressable,
  type ButtonColor,
  type ButtonColoringStyle,
  type ButtonSize,
  type PressableProps,
} from './Pressable'

export type ButtonProps = Omit<PressableProps, 'children'> & {
  children: string,
  leading?: ElementType,
  trailing?: ElementType,
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
  ...props
}, ref) {
  const iconSize = buttonIconSize(size)

  return (
    <Pressable
      {...props}
      ref={ref}
      size={size}
      className={clsx('button', className)}
    >
      {leading && (
        <Icon icon={leading} size={iconSize} />
      )}
      {children}
      {trailing && (
        <Icon icon={trailing} size={iconSize} />
      )}
    </Pressable>
  )
})
