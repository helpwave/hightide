import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'

const chipColors = ['default', 'dark', 'red', 'yellow', 'green', 'blue', 'pink', 'orange'] as const
export type ChipColor = typeof chipColors[number]

type ChipVariant = 'normal' | 'fullyRounded'
type ChipSize = 'sm' | 'md' | 'lg'

export const ChipUtil = {
  colors: chipColors,
}

export type ChipProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren<{
  color?: ChipColor,
  size?: ChipSize,
  variant?: ChipVariant,
  trailingIcon?: ReactNode,
}>

/**
 * A component for displaying a single chip
 */
export const Chip = ({
                       children,
                       trailingIcon,
                       color = 'default',
                       size = 'md',
                       variant = 'normal',
                       className = '',
                       ...restProps
                     }: ChipProps) => {
  const colorMapping: string = {
    default: 'text-tag-default-text bg-tag-default-background',
    dark: 'text-tag-dark-text bg-tag-dark-background',
    red: 'text-tag-red-text bg-tag-red-background',
    yellow: 'text-tag-yellow-text bg-tag-yellow-background',
    green: 'text-tag-green-text bg-tag-green-background',
    blue: 'text-tag-blue-text bg-tag-blue-background',
    pink: 'text-tag-pink-text bg-tag-pink-background',
    orange: 'text-tag-orange-text bg-tag-orange-background',
  }[color]

  const colorMappingIcon: string = {
    default: 'text-tag-default-icon',
    dark: 'text-tag-dark-icon',
    red: 'text-tag-red-icon',
    yellow: 'text-tag-yellow-icon',
    green: 'text-tag-green-icon',
    blue: 'text-tag-blue-icon',
    pink: 'text-tag-pink-icon',
    orange: 'text-tag-orange-icon',
  }[color]

  return (
    <div
      {...restProps}
      className={clsx(
        `flex-row-0 w-fit font-semibold`,
        colorMapping,
        {
          'px-1 py-0.5': size === 'sm',
          'px-2 py-1': size === 'md',
          'px-4 py-2': size === 'lg',
        },
        {
          'rounded-md': variant === 'normal',
          'rounded-full': variant === 'fullyRounded',
        },
        className
      )}
    >
      {children}
      {trailingIcon && (<span className={colorMappingIcon}>{trailingIcon}</span>)}
    </div>
  )
}

export type ChipListProps = {
  list: ChipProps[],
  className?: string,
}

/**
 * A component for displaying a list of chips
 */
export const ChipList = ({
                           list,
                           className = ''
                         }: ChipListProps) => {
  return (
    <div className={clsx('flex flex-wrap gap-x-2 gap-y-2', className)}>
      {list.map((value, index) => (
        <Chip
          key={index}
          {...value}
          color={value.color ?? 'default'}
          variant={value.variant ?? 'normal'}
        >
          {value.children}
        </Chip>
      ))}
    </div>
  )
}
