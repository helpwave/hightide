import {
  View,
  type ViewProps
} from 'react-native'

import type { ComponentSizeBasic } from '@helpwave/hightide-design/theme-tokens'

import type { IconComponent } from '../../icons/types'
import { useTheme } from '../../global-contexts/theme/ThemeContext'

export type IconProps = Omit<ViewProps, 'children'> & {
  icon: IconComponent,
  size?: ComponentSizeBasic | number,
  color?: string,
  strokeWidth?: number,
}

export const Icon = ({
  icon: Glyph,
  size = 'md',
  color,
  strokeWidth,
  style,
  ...props
}: IconProps) => {
  const { theme } = useTheme()
  const iconToken = typeof size === 'number'
    ? {
      size,
      strokeWidth: strokeWidth ?? theme.components.icon.md.strokeWidth,
    }
    : theme.components.icon[size]

  return (
    <View
      {...props}
      style={[
        {
          width: iconToken.size,
          height: iconToken.size,
          minWidth: iconToken.size,
          maxWidth: iconToken.size,
          minHeight: iconToken.size,
          maxHeight: iconToken.size,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Glyph
        size={iconToken.size}
        strokeWidth={iconToken.strokeWidth}
        color={color}
      />
    </View>
  )
}
