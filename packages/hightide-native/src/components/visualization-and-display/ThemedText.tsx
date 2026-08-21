import {
  forwardRef
} from 'react'
import {
  Text as RNText,
  type TextProps
} from 'react-native'

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
  const { foreground, background, textStyle } = useContentTheme()
  const color = appearance === 'description'
    ? theme.semantics.asDescription({
      colorPair: {
        color: background,
        onColor: foreground,
      },
    })
    : undefined

  return (
    <RNText
      {...props}
      ref={ref}
      style={[textStyle, color === undefined ? undefined : { color }, style]}
    />
  )
})
