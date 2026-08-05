import type { Color } from '../types/color'
import type {
  SwitchState,
  SwitchThemeResolvers
} from '../types/components/switch'
import {
  createValueResolver,
  type ComponentThemeResolver
} from '../types/resolver'

export const toSwitchThemeResolvers: ComponentThemeResolver<SwitchThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: SwitchState) => componentTokens.switch({
    themeTokens,
    semanticResolvers: semanticTokens,
    state: {
      isActive: state.isActive,
      isDisabled: state.isDisabled,
      isInvalid: state.isInvalid,
    },
  })

  return {
    trackColor: createValueResolver((state: SwitchState): Color => resolve(state).trackColor),
    borderColor: createValueResolver((state: SwitchState): Color => resolve(state).borderColor),
    thumbColor: createValueResolver((state: SwitchState): Color => resolve(state).thumbColor),
  }
}
