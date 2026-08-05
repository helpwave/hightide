import {
  View,
  type ViewProps
} from 'react-native'

import type { HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { ComponentSize } from '@helpwave/hightide-design/theme-tokens'
import type { Appearance } from '@helpwave/hightide-design/semantic-token-resolvers'

import type { IconComponent } from '../../icons/types'
import { useContentTheme } from '../../global-contexts/content-theme/ContentThemeContext'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type { Color } from '../../theme/types/color'

export type ThemedIconAppearance = Appearance

export type ThemedIconProps = Omit<ViewProps, 'children'> & {
  icon: IconComponent,
  size?: ComponentSize | number,
  color?: Color,
  strokeWidth?: number,
  appearance?: ThemedIconAppearance,
}

export const ThemedIcon = ({
  icon: Glyph,
  size = 'md',
  color,
  strokeWidth,
  appearance = 'normal',
  style,
  ...props
}: ThemedIconProps) => {
  const { theme } = useTheme()
  const { foregroundColor } = useContentTheme()
  const iconToken = typeof size === 'number'
    ? {
      size,
      strokeWidth: strokeWidth ?? theme.components.icon.md.strokeWidth,
    }
    : theme.components.icon[size]

  const baseColor = (color ?? foregroundColor) as HexColorToken
  const resolvedColor = appearance === 'normal'
    ? baseColor
    : theme.semantics.withAppearance({ color: baseColor, appearance })

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
        color={resolvedColor}
      />
    </View>
  )
}
