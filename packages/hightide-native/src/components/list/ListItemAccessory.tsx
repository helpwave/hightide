import type { ReactNode } from 'react'
import {
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'

import { ContentThemeOverrideProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import type { IconStyle } from '../../icons'

export type ListItemAccessoryProps = {
  children: ReactNode,
  style?: StyleProp<ViewStyle>,
  foreground?: ColorToken,
  iconStyle: IconStyle,
}

export const ListItemAccessory = ({
  children,
  style,
  foreground,
  iconStyle,
}: ListItemAccessoryProps) => (
  <View style={style}>
    <ContentThemeOverrideProvider
      foreground={foreground}
      iconStyle={iconStyle}
    >
      {children}
    </ContentThemeOverrideProvider>
  </View>
)
