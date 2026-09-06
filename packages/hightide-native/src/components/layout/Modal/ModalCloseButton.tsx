import { View } from 'react-native'

import { useTranslation } from '@helpwave/hightide-utils/context'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { ModalCloseButtonStyle } from '../../../theme/types/components/modal'
import type { StyleOverwrite } from '../../../theme/types/resolver'
import { IconButton } from '../../user-interaction/IconButton'
import { useModalContext } from './ModalContext'

export type ModalCloseButtonProps = {
  style?: StyleOverwrite<Record<string, never>, ModalCloseButtonStyle>,
}

export const ModalCloseButton = ({
  style,
}: ModalCloseButtonProps) => {
  const { theme } = useTheme()
  const translation = useTranslation()
  const context = useModalContext()
  const resolvedStyle = useMemoizedTheme(theme.components.modal.closeButton, {}, style)

  return (
    <View
      pointerEvents="box-none"
      style={resolvedStyle}
    >
      <IconButton
        icon={HightideIconRegistry.X}
        size="xs"
        color={theme.colors.neutral}
        variant="foreground"
        accessibilityLabel={translation('closeDialog')}
        onPress={() => context.setIsOpen(false)}
      />
    </View>
  )
}
