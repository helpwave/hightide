import type {
  ColorValue } from 'react-native'
import {
  View,
  type ViewProps
} from 'react-native'

import type { HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { Appearance } from '@helpwave/hightide-design/semantic-token-resolvers'
import type { IconSize } from '@helpwave/hightide-design/theme-tokens'

import type { IconComponent } from '../../icons/types'
import { useContentTheme } from '../../global-contexts/content-theme/ContentThemeContext'
import { useTheme } from '../../global-contexts/theme/ThemeContext'

export type ThemedIconAppearance = Appearance

export type ThemedIconProps = Omit<ViewProps, 'children'> & {
  icon: IconComponent,
  size?: IconSize | number,
  color?: ColorValue,
  strokeWidth?: number,
  appearance?: ThemedIconAppearance,
}

export const ThemedIcon = ({
  icon: Glyph,
  size,
  color,
  strokeWidth,
  appearance = 'normal',
  style,
  ...props
}: ThemedIconProps) => {
  const { theme } = useTheme()
  const { foreground, iconStyle } = useContentTheme()
  const resolvedSize = size ?? iconStyle.size ?? 'md'
  const iconToken = typeof resolvedSize === 'number'
    ? {
      size: resolvedSize,
      strokeWidth: strokeWidth ?? iconStyle.strokeWidth ?? theme.components.icon.md.strokeWidth,
    }
    : theme.components.icon[resolvedSize]

  // TODO fix this by using a hex color parser
  const baseColor = (color
    ?? iconStyle.color
    ?? foreground) as HexColorToken
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
        strokeWidth={strokeWidth ?? iconStyle.strokeWidth ?? iconToken.strokeWidth}
        color={resolvedColor}
      />
    </View>
  )
}
