import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import type { HightideSemanticColors } from '../types/color'
import type { HightideComponentThemes } from '../types/components/hightide'
import type {
  SwitchState,
  SwitchTheme
} from '../types/components/switch'
import { createValueResolver } from '../types/resolver'

export type CreateSwitchThemeOptions = {
  semantic: HightideSemanticColors,
  colorSchemes: HightideComponentThemes['colorSchemes'],
  switchTokens: ComponentTokens['switch'],
}

export const createSwitchTheme = ({
  semantic,
  colorSchemes,
  switchTokens,
}: CreateSwitchThemeOptions): SwitchTheme => {
  const resolveState = (state: SwitchState) => {
    const trackInactive = state.isDisabled
      ? semantic.disabled
      : switchTokens.track.inactive
    const trackActive = state.isDisabled
      ? semantic.disabled
      : switchTokens.track.active

    const trackColor = state.isActive ? trackActive : trackInactive

    const borderColor = state.isDisabled
      ? semantic.disabled
      : state.isInvalid
        ? colorSchemes.negative.text.base.foreground
        : state.isActive
          ? trackActive
          : switchTokens.borderColor

    const thumbColor = state.isDisabled
      ? semantic.onDisabled
      : state.isActive
        ? switchTokens.thumb.active
        : switchTokens.thumb.inactive

    return {
      trackColor,
      borderColor,
      thumbColor,
    }
  }

  return {
    trackColor: createValueResolver((state) => resolveState(state).trackColor),
    borderColor: createValueResolver((state) => resolveState(state).borderColor),
    thumbColor: createValueResolver((state) => resolveState(state).thumbColor),
  }
}

export const createSwitchThemeFromDesign = (theme: DesignTokensTheme): SwitchTheme => {
  return createSwitchTheme({
    semantic: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes,
    switchTokens: theme.components.switch,
  })
}
