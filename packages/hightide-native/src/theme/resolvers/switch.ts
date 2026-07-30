import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'
import type { ColorSchemes, SemanticColorTokens } from '@helpwave/hightide-design/semantic'

import type {
  SwitchState,
  SwitchTheme
} from '../types/components/switch'
import { createValueResolver } from '../types/resolver'

export type CreateSwitchThemeOptions = {
  colors: SemanticColorTokens,
  colorSchemes: ColorSchemes,
  switchTokens: ComponentTokens['switch'],
}

export const createSwitchTheme = ({
  colors,
  colorSchemes,
  switchTokens,
}: CreateSwitchThemeOptions): SwitchTheme => {
  const resolveState = (state: SwitchState) => {
    const trackInactive = state.isDisabled
      ? colors.disabled
      : switchTokens.track.inactive
    const trackActive = state.isDisabled
      ? colors.disabled
      : switchTokens.track.active

    const trackColor = state.isActive ? trackActive : trackInactive

    const borderColor = state.isDisabled
      ? colors.disabled
      : state.isInvalid
        ? colorSchemes.negative.text.base.foreground
        : state.isActive
          ? trackActive
          : switchTokens.borderColor

    const thumbColor = state.isDisabled
      ? colors.onDisabled
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
    colors: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes,
    switchTokens: theme.components.switch,
  })
}
