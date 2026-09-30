import clsx from 'clsx'
import type { ComponentPropsWithoutRef, ElementType } from 'react'

export const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export type IconSize = typeof iconSizes[number]

export type IconProps<T extends ElementType = 'div'> = {
  size?: IconSize,
  icon?: T,
} & Omit<ComponentPropsWithoutRef<T>, 'size'>

export function Icon<T extends ElementType = 'div'>({
  size = 'md',
  icon,
  className,
  ...props
}: IconProps<T>) {
  const Component = icon ?? 'div'

  return (
    <Component
      {...props}
      className={clsx('icon', className)}
      data-size={size}
    />
  )
}
