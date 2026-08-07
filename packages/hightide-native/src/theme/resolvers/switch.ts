import { toContainerStyle } from '../adapters/style-adapters'
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

export const toSwitchThemeResolvers: ComponentThemeResolver<SwitchThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: SwitchState = {}) => componentTokens.switch({
    themeTokens,
    semanticResolvers: semanticTokens,
    state: {
      isActive: state.isActive,
      isDisabled: state.isDisabled,
      isHovered: state.isHovered,
      isFocused: state.isFocused,
      isFocusVisible: state.isFocusVisible,
      isReadonly: state.isReadonly,
      isInvalid: state.isInvalid,
    },
  })

  return {
    container: createStyleResolver((state: SwitchState): SwitchContainerStyle => (
      toContainerStyle(resolve(state).container)
    )),
    track: createStyleResolver((state: SwitchState): SwitchTrackStyle => (
      toContainerStyle(resolve(state).track)
    )),
    thumb: createStyleResolver((state: SwitchState): SwitchThumbStyle => (
      toContainerStyle(resolve(state).thumb)
    )),
  }
}
