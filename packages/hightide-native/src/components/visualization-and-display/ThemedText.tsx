import {
  forwardRef
} from 'react'
import {
  Text as RNText,
  type TextProps
} from 'react-native'

import type { HexColorToken } from '@helpwave/hightide-design/primitive-tokens'

import { useContentTheme } from '../../global-contexts/content-theme/ContentThemeContext'
import { useTheme } from '../../global-contexts/theme/ThemeContext'

export type ThemedTextAppearance = 'normal' | 'description'

export type ThemedTextProps = TextProps & {
  appearance?: ThemedTextAppearance,
}

export const ThemedText = forwardRef<React.ComponentRef<typeof RNText>, ThemedTextProps>(function ThemedText({
  appearance = 'normal',
  style,
  ...props
}, ref) {
  const { theme } = useTheme()
  const { foreground, textStyle } = useContentTheme()
  // TODO use a hex color parser
  const foregroundColor = (typeof textStyle.color === 'string'
    ? textStyle.color
    : foreground) as HexColorToken
  const color = appearance === 'description'
    ? theme.semantics.asDescription({ color: foregroundColor })
    : foregroundColor

  return (
    <RNText
      {...props}
      ref={ref}
      style={[textStyle, { color }, style]}
    />
  )
})
