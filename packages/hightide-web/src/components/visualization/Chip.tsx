import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import type { ColoringColor, ColoringColorVariant, ColoringStyle } from '../../utils/coloring'
import { ColoringUtils } from '../../utils/coloring'

type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | null

export type ChipColor = ColoringColor

export const ChipUtil = {
  colors: ColoringUtils.colors,
  colorVariants: ColoringUtils.colorVariants,
  styles: ColoringUtils.styles,
}

export type ChipProps = HTMLAttributes<HTMLDivElement> & {
  color?: ChipColor,
  colorVariant?: ColoringColorVariant,
  coloringStyle?: ColoringStyle,
  bordered?: boolean,
  elevated?: boolean,
  size?: ChipSize,
}

/**
 * A component for displaying a single chip
 */
export const Chip = ({
  children,
  color = 'neutral',
  colorVariant = 'tonal',
  coloringStyle = 'filled',
  bordered = false,
  elevated = false,
  size = 'md',
  ...props
}: ChipProps) => {
  return (
    <div
      {...props}
      className={clsx('chip', props.className)}
      data-size={size ?? undefined}
      {...ColoringUtils.build({
        color,
        mode: 'static',
        colorVariant,
        coloringStyle,
        bordered,
        elevated,
      })}
    >
      {children}
    </div>
  )
}

export type ChipListProps = HTMLAttributes<HTMLUListElement> & {
  list: ChipProps[],
}

/**
 * A component for displaying a list of chips
 */
export const ChipList = ({
  list,
  ...props
}: ChipListProps) => {
  return (
    <ul
      {...props}
      className={clsx('chip-list', props.className)}
    >
      {list.map((value, index) => (
        <li key={index}>
          <Chip
            key={index}
            {...value}
          >
            {value.children}
          </Chip>
        </li>
      ))}
    </ul>
  )
}
