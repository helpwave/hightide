import type { View } from 'react-native'
import { forwardRef } from 'react'
import { Pressable } from 'react-native'
import { useHightideTheme } from '../theme/ThemeContext'
import { useControlledState } from '../hooks/useControlledState'
import { Text } from '../primitives/Text'

export type CheckboxSize = 'sm' | 'md' | 'lg'

const sizing: Record<CheckboxSize, { box: number, glyph: number }> = {
  sm: { box: 16, glyph: 12 },
  md: { box: 20, glyph: 15 },
  lg: { box: 24, glyph: 18 },
}

export type CheckboxProps = {
  /** Controlled value. Omit for uncontrolled usage. */
  value?: boolean,
  /** @default false */
  initialValue?: boolean,
  /** Renders the indeterminate (mixed) state. Overrides the checkmark. */
  indeterminate?: boolean,
  onValueChange?: (value: boolean) => void,
  disabled?: boolean,
  /** @default 'md' */
  size?: CheckboxSize,
  /** @default false */
  isRounded?: boolean,
  className?: string,
}

/** A tri-state checkbox (checked / unchecked / indeterminate). */
export const Checkbox = forwardRef<View, CheckboxProps>(function Checkbox({
  value: controlledValue,
  initialValue = false,
  indeterminate = false,
  onValueChange,
  disabled = false,
  size = 'md',
  isRounded = false,
}, ref) {
  const { theme } = useHightideTheme()
  const [value, setValue] = useControlledState<boolean>({
    value: controlledValue,
    defaultValue: initialValue,
    onChange: onValueChange,
  })
  const dims = sizing[size]
  const filled = indeterminate || value

  return (
    <Pressable
      ref={ref}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : value, disabled }}
      disabled={disabled}
      onPress={() => setValue(!value)}
      style={{
        width: dims.box,
        height: dims.box,
        borderRadius: isRounded ? dims.box / 2 : theme.radii.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: filled ? 0 : theme.spacing.outlineWidth,
        borderColor: theme.colors.border,
        backgroundColor: filled ? theme.colors.primary : 'transparent',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {filled && (
        <Text style={{ color: theme.colors.onPrimary, fontSize: dims.glyph, fontWeight: '700', lineHeight: dims.glyph + 1 }}>
          {indeterminate ? '−' : '✓'}
        </Text>
      )}
    </Pressable>
  )
})
