import clsx from 'clsx'
import type { ReactNode } from 'react'
import { forwardRef } from 'react'
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
  leading?: ReactNode,
  trailing?: ReactNode,
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  children,
  leading,
  trailing,
  className,
  ...props
}, ref) {
  return (
    <Pressable
      {...props}
      ref={ref}
      className={clsx('button', className)}
    >
      {leading}
      {children}
      {trailing}
    </Pressable>
  )
})
