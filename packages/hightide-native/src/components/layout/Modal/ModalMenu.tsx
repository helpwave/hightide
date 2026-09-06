import type { ReactNode } from 'react'
import { Pressable } from 'react-native'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import type { ModalMenuStyle } from '../../../theme/types/components/modal'
import type { StyleOverwrite } from '../../../theme/types/resolver'

export type ModalMenuProps = {
  children?: ReactNode,
  style?: StyleOverwrite<Record<string, never>, ModalMenuStyle>,
}

export const ModalMenu = ({
  children,
  style,
}: ModalMenuProps) => {
  const { theme } = useTheme()
  const resolvedStyle = useMemoizedTheme(theme.components.modal.menu, {}, style)

  return (
    <Pressable
      accessibilityRole="none"
      style={resolvedStyle}
      onPress={(event) => event.stopPropagation()}
    >
      {children}
    </Pressable>
  )
}
