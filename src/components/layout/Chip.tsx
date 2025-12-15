import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'
import { ButtonUtil } from '@/src/components/user-action/Button'

const chipColors = ButtonUtil.colors
export type ChipColor = typeof chipColors[number]

type ChipVariant = 'normal' | 'fullyRounded' | 'none'
type ChipSize = 'small' | 'medium' | 'large' | 'none'

export const ChipUtil = {
  colors: chipColors,
}

export type ChipProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren<{
  color?: ChipColor,
  size?: ChipSize,
  icon?: boolean,
  variant?: ChipVariant,
  trailingIcon?: ReactNode,
}>

/**
 * A component for displaying a single chip
 */
export const Chip = ({
                       children,
                       trailingIcon,
                       color = 'neutral',
                       size = 'medium',
                       variant = 'normal',
                       className = '',
                       ...restProps
                     }: ChipProps) => {
  const colorMapping: string = ButtonUtil.colorClasses[color]

  return (
    <div
      {...restProps}
      className={clsx(
        `flex-row-0 w-fit font-semibold coloring-solid`,
        colorMapping,
        {
          'chip-sm': size === 'small',
          'chip-md': size === 'medium',
          'chip-lg': size === 'large',
        },
        {
          'rounded-md': variant === 'normal',
          'rounded-full': variant === 'fullyRounded',
        },
        className
      )}
    >
      {children}
      {trailingIcon}
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
          color={value.color}
          variant={value.variant}
        >
          {value.children}
        </Chip>
      ))}
    </div>
  )
}
