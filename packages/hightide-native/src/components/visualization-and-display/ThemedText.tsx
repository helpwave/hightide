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
  const { foregroundColor, textStyle } = useContentTheme()
  const color = appearance === 'description'
    ? theme.semantics.asDescription({ color: foregroundColor as HexColorToken })
    : foregroundColor

  return (
    <RNText
      {...props}
      ref={ref}
      style={[textStyle, { color }, style]}
    />
  )
})
