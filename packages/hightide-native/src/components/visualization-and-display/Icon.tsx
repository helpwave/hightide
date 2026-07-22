import type { LucideIcon } from 'lucide-react-native'

import type { ElementSize } from '@helpwave/hightide-design/types'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'

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
  const { theme } = useTheme()

  return (
    <IconComponent
      size={theme.layout.icon[size].size}
      strokeWidth={theme.layout.icon[size].strokeWidth}
      color={color}
    />
  )
}
