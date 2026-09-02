import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import { useTranslation } from '@helpwave/hightide-utils/context'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import type { MultiSelectState } from '../../../theme/types/components/multiSelect'
import { Chip } from '../../visualization-and-display/Chip'
import { ThemedText } from '../../visualization-and-display/ThemedText'
import { IconButton } from '../IconButton'
import { useMultiSelectContext, type MultiSelectOptionType } from './MultiSelectContext'
import { ThemedPressable } from '../ThemedPressable'

export type MultiSelectTriggerProps<T = string> = {
  placeholder?: ReactNode,
  selectedDisplay?: (options: ReadonlyArray<MultiSelectOptionType<T>>) => ReactNode,
  style?: StyleProp<ViewStyle>,
}

export const MultiSelectTrigger = <T,>({
  placeholder = 'Select…',
  selectedDisplay,
  style,
}: MultiSelectTriggerProps<T>) => {
  const { theme } = useTheme()
  const translation = useTranslation()
  const context = useMultiSelectContext<T>()
  const [isPressed, setIsPressed] = useState(false)
  const interactive = !context.disabled && !context.readOnly
  const selectedOptions = context.selectedIds
    .map((id) => context.idToOptionMap[id])
    .filter((option): option is MultiSelectOptionType<T> => option !== undefined)

  const resolvedState = useMemo((): MultiSelectState => ({
    color: context.config.color,
    isDisabled: !!context.disabled,
    isReadonly: !!context.readOnly,
    isInvalid: !!context.invalid,
    isOpen: context.isOpen,
    hasSelections: selectedOptions.length > 0,
    hasValue: selectedOptions.length > 0,
    isPressed,
  }), [
    context.config.color,
    context.disabled,
    context.invalid,
    context.isOpen,
    context.readOnly,
    isPressed,
    selectedOptions.length,
  ])

  const multiSelectTheme = theme.components.multiSelect
  const resolvedTriggerStyle = useMemoizedTheme(multiSelectTheme.trigger, resolvedState)
  const resolvedStateLayerStyle = useMemoizedTheme(multiSelectTheme.stateLayer, resolvedState)
  const resolvedTriggerTextStyle = useMemoizedTheme(multiSelectTheme.triggerText, resolvedState)
  const iconSizeSm = theme.icongraphy.sizes.sm
  const customDisplay = selectedDisplay?.(selectedOptions)

  return (
    <ThemedPressable
      disabled={!interactive}
      style={[resolvedTriggerStyle, style]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => context.toggleIsOpen()}
    >
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
      {selectedDisplay ? (
        customDisplay
      ) : selectedOptions.length > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {selectedOptions.map((option) => (
            <Chip key={option.value.id} size="md" color={context.config.color} variant="tonal">
              <ThemedText>{option.label ?? String(option.value.value)}</ThemedText>
              {!context.readOnly && (
                <View
                  style={{
                    position: 'relative',
                    width: iconSizeSm,
                    height: iconSizeSm,
                  }}
                >
                  <IconButton
                    accessibilityLabel={translation('remove')}
                    size="sm"
                    color={theme.colors.negative}
                    variant="foreground"
                    disabled={!interactive}
                    onPress={() => context.toggleSelection(option.value.id, false)}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: [
                        { translateX: '-50%' },
                        { translateY: '-50%' },
                      ],
                    }}
                    icon={HightideIconRegistry.X}
                  />
                </View>
              )}
            </Chip>
          ))}
        </View>
      ) : typeof placeholder === 'string' || typeof placeholder === 'number' ? (
        <ThemedText style={resolvedTriggerTextStyle}>
          {placeholder}
        </ThemedText>
      ) : (
        placeholder
      )}
    </ThemedPressable>
  )
}
