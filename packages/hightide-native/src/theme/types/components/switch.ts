import type { Color } from '../color'
import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'

export type SwitchState = InteractionState & {
  isActive?: boolean,
}

export type SwitchTheme = {
  trackColor: StyleResolverFunction<SwitchState, Color>,
  borderColor: StyleResolverFunction<SwitchState, Color>,
  thumbColor: StyleResolverFunction<SwitchState, Color>,
}
