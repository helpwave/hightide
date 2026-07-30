import type { LucideIcon } from 'lucide-react-native'

import type { ComponentSize } from '@helpwave/hightide-design/theme-tokens'

import { useTheme } from '../../global-contexts/theme/ThemeContext'

export type IconProps = {
  icon: LucideIcon,
  size?: ComponentSize | number,
  color?: string,
}

export const Icon = ({
  icon: IconComponent,
  size = 'md',
  color,
}: IconProps) => {
  const { theme } = useTheme()
  const iconToken = typeof size === 'number'
    ? {
      size,
      strokeWidth: theme.components.icon.md.strokeWidth,
    }
    : theme.components.icon[size]

  return (
    <IconComponent
      size={iconToken.size}
      strokeWidth={iconToken.strokeWidth}
      color={color}
    />
  )
}
