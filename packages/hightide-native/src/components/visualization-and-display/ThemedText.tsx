import {
  forwardRef
} from 'react'
import type {
  ColorValue } from 'react-native'
import {
  Text as RNText,
  type TextProps
} from 'react-native'

import { useContentTheme } from '../../global-contexts/content-theme/ContentThemeContext'
import { useTheme } from '../../global-contexts/theme/ThemeContext'

import type { ThemedTextAppearance } from '../../enums/themedTextAppearance'
import { HexColorUtils } from '../../utils'

export type { ThemedTextAppearance }

export type ThemedTextProps = TextProps & {
  appearance?: ThemedTextAppearance,
}

export const ThemedText = forwardRef<React.ComponentRef<typeof RNText>, ThemedTextProps>(function ThemedText({
  appearance = 'normal',
  style,
  ...props
}, ref) {
  const { theme } = useTheme()
  const { foreground, background, textStyle } = useContentTheme()
  let color: ColorValue | undefined = textStyle.color ?? foreground
  color = appearance === 'description'
    ? theme.semantics.asDescription({
      colorPair: {
        color: background,
        onColor: HexColorUtils.parseColorValue(color),
      },
    })
    : color


  return (
    <RNText
      {...props}
      ref={ref}
      style={[textStyle, { color }, style]}
    />
  )
})
