import type {
  ComponentColorTokens,
  HightideThemeTokens as DesignTokensTheme
} from '@helpwave/hightide-design/types'

import type { HightideSemanticColors } from '../types/color'
import type {
  SwitchState,
  SwitchTheme
} from '../types/components/switch'
import { createValueResolver } from '../types/resolver'

export type CreateSwitchThemeOptions = {
  semantic: HightideSemanticColors,
  component: ComponentColorTokens,
}

export const createSwitchTheme = ({
  semantic,
  component,
}: CreateSwitchThemeOptions): SwitchTheme => {
  const resolveState = (state: SwitchState) => {
    const trackInactive = state.isDisabled
      ? semantic.disabled
      : component.switch.track.inactive
    const trackActive = state.isDisabled
      ? semantic.disabled
      : component.switch.track.active

    const trackColor = state.isActive ? trackActive : trackInactive

    const borderColor = state.isDisabled
      ? semantic.disabled
      : state.isInvalid
        ? semantic.negative
        : state.isActive
          ? trackActive
          : component.switch.borderColor

    const thumbColor = state.isDisabled
      ? semantic.onDisabled
      : state.isActive
        ? component.switch.thumb.active
        : component.switch.thumb.inactive

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
    semantic: theme.semanticColors,
    component: theme.componentColors,
  })
}
