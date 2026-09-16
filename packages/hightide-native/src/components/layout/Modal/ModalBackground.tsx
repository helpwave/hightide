import type { ReactNode } from 'react'
import {
  Modal as ReactNativeModal,
  Pressable,
  View
} from 'react-native'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import type { ModalBackgroundStyle } from '../../../theme/types/components/modal'
import type { StyleOverwrite } from '../../../theme/types/resolver'
import { useModalContext } from './ModalContext'

export type ModalBackgroundProps = {
  children?: ReactNode,
  style?: StyleOverwrite<Record<string, never>, ModalBackgroundStyle>,
}

export const ModalBackground = ({
  children,
  style,
}: ModalBackgroundProps) => {
  const { theme } = useTheme()
  const context = useModalContext()
  const resolvedStyle = useMemoizedTheme(theme.components.modal.background, {}, style)

  return (
    <ReactNativeModal
      visible={context.isOpen}
      transparent
      animationType="fade"
      onRequestClose={() => context.setIsOpen(false)}
    >
      <View style={resolvedStyle}>
        <Pressable
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          onPress={() => context.setIsOpen(false)}
        />
        {children}
      </View>
    </ReactNativeModal>
  )
}
