import type { ReactNode } from 'react'
import {
  Modal as ReactNativeModal,
  Pressable
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
      <Pressable
        style={resolvedStyle}
        onPress={() => context.setIsOpen(false)}
      >
        {children}
      </Pressable>
    </ReactNativeModal>
  )
}
