import type {
  SwitchState as DesignSwitchState,
  SwitchStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import type {
  SwitchContainerStyle,
  SwitchState,
  SwitchThemeResolvers,
  SwitchThumbStyle,
  SwitchTrackStyle
} from '../types/components/switch'
import {
  createStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters'

const toDesignSwitchState = (state: SwitchState = {}): DesignSwitchState => {
  const active = new Set<SwitchStateValue>()

  if (state.isDisabled) {
    active.add('disabled')
  }
  if (state.isFocused) {
    active.add('focused')
  }
  if (state.isFocusVisible) {
    active.add('focusVisible')
  }
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }
  if (state.isReadonly) {
    active.add('readonly')
  }
  if (state.isInvalid) {
    active.add('invalid')
  }
  if (state.isActive) {
    active.add('active')
  }

  return active
}

export const toSwitchThemeResolvers: ComponentThemeResolver<SwitchThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: SwitchState = {}) => componentTokens.switch({
    themeTokens,
    semanticResolvers: semanticTokens,
    state: toDesignSwitchState(state),
  })

  return {
    container: createStyleResolver((state: SwitchState): SwitchContainerStyle => (
      StyleAdapterUtils.container(resolve(state).container)
    )),
    track: createStyleResolver((state: SwitchState): SwitchTrackStyle => (
      StyleAdapterUtils.container(resolve(state).track)
    )),
    thumb: createStyleResolver((state: SwitchState): SwitchThumbStyle => (
      StyleAdapterUtils.container(resolve(state).thumb)
    )),
  }
}
