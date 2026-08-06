import {
  useMemo,
  type ReactNode
} from 'react'
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type { CardStyle } from '../../theme/types/components/card'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type CardProps = Omit<ViewProps, 'children' | 'style'> & {
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  cardStyle?: StyleOverwrite<Record<string, never>, CardStyle>,
}

export const Card = ({
  children,
  style,
  cardStyle,
  ...props
}: CardProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({}), [])

  const resolvedCardStyle = useMemo(
    () => theme.components.card.container(state, cardStyle),
    [theme, state, cardStyle]
  )

  return (
    <View {...props} style={[resolvedCardStyle, style]}>
      {children}
    </View>
  )
}
