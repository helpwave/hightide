import type { LucideIcon } from 'lucide-react-native'

import type { ElementSize } from '@helpwave/hightide-design/primitive'

import { useTheme } from '../../global-contexts/theme/ThemeContext'

const iconSizeFor = (size: ElementSize, spacing: Record<string, number>): number => {
  switch (size) {
  case 'xs':
    return spacing.md
  case 'sm':
    return spacing.md + spacing.xs / 2
  case 'md':
    return spacing.lg
  case 'lg':
    return spacing.xl - spacing.xs
  case 'xl':
    return spacing.xl
  }
}

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
      size={iconSizeFor(size, theme.spacing)}
      strokeWidth={theme.border.base}
      color={color}
    />
  )
}
