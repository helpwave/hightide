import type { ActivityIndicatorProps } from 'react-native'
import { ActivityIndicator } from 'react-native'
import type { SemanticColorName } from '@helpwave/hightide-tokens'
import { useHightideTheme } from '../theme/ThemeContext'

export type SpinnerProps = Omit<ActivityIndicatorProps, 'color'> & {
  /**
   * A semantic color name or raw color for the spinner.
   * @default 'primary'
   */
  color?: SemanticColorName | (string & {}),
}

/** A themed loading spinner, wrapping React Native's `ActivityIndicator`. */
export const Spinner = ({ color = 'primary', size = 'small', ...props }: SpinnerProps) => {
  const { theme } = useHightideTheme()
  const resolved = color in theme.colors ? theme.colors[color as SemanticColorName] : color
  return <ActivityIndicator color={resolved} size={size} {...props} />
}
