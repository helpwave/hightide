import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type SwitchState = InteractionState & {
  isActive?: boolean,
}

export type SwitchThemeResolvers = {
  trackColor: StyleResolverFunction<SwitchState, Color>,
  borderColor: StyleResolverFunction<SwitchState, Color>,
  thumbColor: StyleResolverFunction<SwitchState, Color>,
}
