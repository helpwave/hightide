import { getIconSizePx, getIconStrokeWidth } from '@helpwave/hightide-design/helpers'
import { type ElementSize } from '@helpwave/hightide-design/types'
import type { LucideIcon } from 'lucide-react-native'

export type IconProps = {
  icon: LucideIcon,
  size?: ElementSize,
  color?: string,
}

export const Icon = ({
  icon: IconComponent,
  size = 'md',
  color,
}: IconProps) => {
  return (
    <IconComponent
      size={getIconSizePx(size)}
      strokeWidth={getIconStrokeWidth(size)}
      color={color}
    />
  )
}

export const resolveIconProps = (
  size: ElementSize = 'md',
  color?: string
): {
  size: number,
  strokeWidth: number,
  color?: string,
} => ({
  size: getIconSizePx(size),
  strokeWidth: getIconStrokeWidth(size),
  color,
})
