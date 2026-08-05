import type { ColorToken } from '../primitive-tokens/color'
import {
  createElementLayoutTokens,
  type ComponentSize
} from '../theme-tokens/element-layout'
import type { ComponentTokenResolver } from './component-token-resolver'

export type CheckboxState = {
  isDisabled?: boolean,
  isChecked?: boolean,
  isIndeterminate?: boolean,
  isInvalid?: boolean,
}

export type CheckboxComponentResolverProps = {
  config: {
    alwaysShowCheckIcon?: boolean,
  },
  overrides: {
    size?: ComponentSize,
    isRounded?: boolean,
  },
  state: CheckboxState,
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

export type CheckboxTokens = {
  box: CheckboxBoxTokens,
  icon: CheckboxIconTokens,
}

export type CheckboxTokenResolver = ComponentTokenResolver<
  CheckboxComponentResolverProps,
  CheckboxTokens
>

export const checkboxTokenResolver: CheckboxTokenResolver = ({ themeTokens, semanticResolvers, config, overrides, state }) => {
  const size = overrides.size ?? 'md'
  const { color, borders } = themeTokens
  const control = createElementLayoutTokens(themeTokens).control
  const element = control[size]
  const borderWidth = borders.borderWidths.normal
  const inset = control.xs.inset
  const dimension = element.size - 2 * element.inset - 2 * element.borderWidth
  const isActive = !!(state.isChecked || state.isIndeterminate)
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    semanticResolvers,
    color: color.surface.onColor,
  })

  const borderColor = state.isDisabled
    ? color.disabled.color
    : state.isInvalid
      ? color.negative.color
      : isActive ? color.primary.color : fadedBorder

  const backgroundColor = state.isDisabled
    ? color.disabled.color
    : isActive ? color.primary.color : color.surface.color

  return {
    box: {
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension,
      height: dimension,
      padding: inset,
      borderWidth,
      borderColor,
      borderRadius: overrides.isRounded ? dimension / 2 : element.borderRadius,
      backgroundColor,
      opacity: state.isDisabled ? 0.6 : 1,
    },
    icon: {
      color: isActive ? color.primary.onColor : color.primary.color,
      size: dimension - 2 * inset - 2 * borderWidth,
      isVisible: !!(state.isIndeterminate || config.alwaysShowCheckIcon || state.isChecked),
    },
  }
}
