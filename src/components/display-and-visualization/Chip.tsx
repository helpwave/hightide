import type { HTMLAttributes } from 'react'
import { ButtonUtil } from '@/src/components/user-interaction/Button'

type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | null

type ChipColoringStyle = 'solid' | 'tonal' | null

const chipColors = ButtonUtil.colors
export type ChipColor = typeof chipColors[number]

export const ChipUtil = {
  colors: chipColors,
}

export type ChipProps = HTMLAttributes<HTMLDivElement> & {
  color?: ChipColor,
  coloringStyle?: ChipColoringStyle,
  size?: ChipSize,
}

/**
 * A component for displaying a single chip
 */
export const Chip = ({
  children,
  color = 'neutral',
  coloringStyle = 'solid',
  size = 'md',
  ...props
}: ChipProps) => {
  return (
    <div
      {...props}

      data-name={props['data-name'] ?? 'chip'}
      data-color={color ?? undefined}
      data-coloringstyle={coloringStyle ?? undefined}
      data-size={size ?? undefined}
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
    <ul {...props} data-name={props['data-name'] ?? 'chip-list'}>
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
