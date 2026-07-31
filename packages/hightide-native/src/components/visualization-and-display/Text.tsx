import {
  forwardRef
} from 'react'
import {
  Text as RNText,
  type TextProps
} from 'react-native'

import { useContentTheme } from '../../global-contexts/content-theme/ContentThemeContext'

export type TextComponentProps = TextProps

export const Text = forwardRef<React.ComponentRef<typeof RNText>, TextComponentProps>(function Text({
  style,
  ...props
}, ref) {
  const { foregroundColor, textStyle } = useContentTheme()

  return (
    <RNText
      {...props}
      ref={ref}
      style={[textStyle, { color: foregroundColor }, style]}
    />
  )
})
