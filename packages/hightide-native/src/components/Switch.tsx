import type { View } from 'react-native'
import { forwardRef } from 'react'
import { Pressable, StyleSheet, View as RNView } from 'react-native'
import { useHightideTheme } from '../theme/ThemeContext'
import { useControlledState } from '../hooks/useControlledState'

export type SwitchSize = 'sm' | 'md' | 'lg'

const sizing: Record<SwitchSize, { width: number, height: number, thumb: number, padding: number }> = {
  sm: { width: 36, height: 22, thumb: 18, padding: 2 },
  md: { width: 44, height: 26, thumb: 22, padding: 2 },
  lg: { width: 52, height: 30, thumb: 26, padding: 2 },
}

export type SwitchProps = {
  /** Controlled value. Omit for uncontrolled usage. */
  value?: boolean,
  /** @default false */
  initialValue?: boolean,
  onValueChange?: (value: boolean) => void,
  disabled?: boolean,
  /** @default 'md' */
  size?: SwitchSize,
  className?: string,
}

const styles = StyleSheet.create({
  track: { justifyContent: 'center' },
})

/** A binary on/off toggle. */
export const Switch = forwardRef<View, SwitchProps>(function Switch({
  value: controlledValue,
  initialValue = false,
  onValueChange,
  disabled = false,
  size = 'md',
}, ref) {
  const { theme } = useHightideTheme()
  const [value, setValue] = useControlledState<boolean>({
    value: controlledValue,
    defaultValue: initialValue,
    onChange: onValueChange,
  })
  const dims = sizing[size]

  return (
    <Pressable
      ref={ref}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => setValue(!value)}
      style={[
        styles.track,
        {
          width: dims.width,
          height: dims.height,
          borderRadius: dims.height / 2,
          padding: dims.padding,
          backgroundColor: value ? theme.colors.primary : theme.colors.neutral,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <RNView
        style={{
          width: dims.thumb,
          height: dims.thumb,
          borderRadius: dims.thumb / 2,
          backgroundColor: value ? theme.colors.switchThumbActive : theme.colors.switchThumbInactive,
          transform: [{ translateX: value ? dims.width - dims.thumb - dims.padding * 2 : 0 }],
        }}
      />
    </Pressable>
  )
})
