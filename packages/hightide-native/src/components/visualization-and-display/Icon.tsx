import type { LucideIcon } from 'lucide-react-native'

import type { ComponentSize } from '@helpwave/hightide-design/theme'

import { useTheme } from '../../global-contexts/theme/ThemeContext'

export type IconProps = {
  icon: LucideIcon,
  size?: ComponentSize,
  color?: string,
}

export const Icon = ({
  icon: IconComponent,
  size = 'md',
  color,
}: IconProps) => {
  const { theme } = useTheme()
  const iconToken = theme.components.icon[size]

  return (
    <IconComponent
      size={iconToken.size}
      strokeWidth={iconToken.strokeWidth}
      color={color}
    />
  )
}
