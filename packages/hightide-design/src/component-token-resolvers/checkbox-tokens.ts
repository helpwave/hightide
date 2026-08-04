import type { ColorToken } from '../primitive-tokens/color'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'

export type CheckboxState = {
  size?: ComponentSize,
  isDisabled?: boolean,
  isChecked?: boolean,
  isIndeterminate?: boolean,
  isInvalid?: boolean,
  isRounded?: boolean,
  alwaysShowCheckIcon?: boolean,
}

export type CheckboxBoxTokens = {
  alignItems: 'center',
  justifyContent: 'center',
  width: number,
  height: number,
  padding: number,
  borderWidth: number,
  borderColor: ColorToken,
  borderRadius: number,
  backgroundColor: ColorToken,
  opacity: number,
}

export type CheckboxIconTokens = {
  color: ColorToken,
  size: number,
  isVisible: boolean,
}

export type CheckboxThemeTokens = {
  box: CheckboxBoxTokens,
  icon: CheckboxIconTokens,
}

export const hightideCheckboxTokenResolver: ComponentTokenResolver<
  ThemeTokens,
  CheckboxState,
  CheckboxThemeTokens
> = ({ themeTokens, state }) => {
  const size = state.size ?? 'md'
  const { color, borders } = themeTokens
  const control = createElementLayoutTokens(themeTokens).control
  const element = control[size]
  const borderWidth = borders.borderWidths.normal
  const inset = control.xs.inset
  const dimension = element.size - 2 * element.inset - 2 * element.borderWidth
  const isActive = !!(state.isChecked || state.isIndeterminate)

  const borderColor = state.isDisabled
    ? color.disabled
    : state.isInvalid
      ? color.negative.color
      : isActive ? color.primary.color : color.border

  const backgroundColor = state.isDisabled
    ? color.disabled
    : isActive ? color.primary.color : color.surface

  return {
    box: {
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension,
      height: dimension,
      padding: inset,
      borderWidth,
      borderColor,
      borderRadius: state.isRounded ? dimension / 2 : element.borderRadius,
      backgroundColor,
      opacity: state.isDisabled ? 0.6 : 1,
    },
    icon: {
      color: isActive ? color.primary.onColor : color.primary.color,
      size: dimension - 2 * inset - 2 * borderWidth,
      isVisible: !!(state.isIndeterminate || state.alwaysShowCheckIcon || state.isChecked),
    },
  }
}
