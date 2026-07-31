import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import type {
  SwitchState,
  SwitchTheme
} from '../types/components/switch'
import type { Color } from '../types/color'
import { createValueResolver } from '../types/resolver'

export const createSwitchTrackColorTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, components } = theme
  const switchTokens = components.switch

  return createValueResolver((state: SwitchState): Color => {
    const trackInactive = state.isDisabled
      ? colors.disabled
      : switchTokens.track.inactive
    const trackActive = state.isDisabled
      ? colors.disabled
      : switchTokens.track.active

    return state.isActive ? trackActive : trackInactive
  })
}

export const createSwitchBorderColorTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, colorSchemes, components } = theme
  const switchTokens = components.switch

  return createValueResolver((state: SwitchState): Color => {
    const trackActive = state.isDisabled
      ? colors.disabled
      : switchTokens.track.active

    return state.isDisabled
      ? colors.disabled
      : state.isInvalid
        ? colorSchemes.negative.text.base.foreground
        : state.isActive
          ? trackActive
          : switchTokens.borderColor
  })
}

export const createSwitchThumbColorTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, components } = theme
  const switchTokens = components.switch

  return createValueResolver((state: SwitchState): Color => (
    state.isDisabled
      ? colors.onDisabled
      : state.isActive
        ? switchTokens.thumb.active
        : switchTokens.thumb.inactive
  ))
}

export const createSwitchTheme = (theme: HightideDesignSystemTokens): SwitchTheme => ({
  trackColor: createSwitchTrackColorTheme(theme),
  borderColor: createSwitchBorderColorTheme(theme),
  thumbColor: createSwitchThumbColorTheme(theme),
})
