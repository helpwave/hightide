import type { ViewProps } from 'react-native'
import { View as RNView } from 'react-native'
import { useHightideTheme } from '../theme/ThemeContext'

export type DividerProps = ViewProps & {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical',
  /** Thickness in px. @default 1 */
  thickness?: number,
  /** Override the line color (defaults to the theme `divider` color). */
  color?: string,
  className?: string,
}

/** A thin separator line using the theme's `divider` color. */
export const Divider = ({ orientation = 'horizontal', thickness = 1, color, style, ...props }: DividerProps) => {
  const { theme } = useHightideTheme()
  const lineColor = color ?? theme.colors.divider
  return (
    <RNView
      accessibilityRole="none"
      style={[
        orientation === 'horizontal'
          ? { height: thickness, alignSelf: 'stretch', backgroundColor: lineColor }
          : { width: thickness, alignSelf: 'stretch', backgroundColor: lineColor },
        style,
      ]}
      {...props}
    />
  )
}
