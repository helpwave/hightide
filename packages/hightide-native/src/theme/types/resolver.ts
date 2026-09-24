import type { StyleProp } from 'react-native'
import type { TokenContextInput } from '../token-context'

export type { InteractionState } from '../token-context'
export { interactionConfig as toPressableInteractionState, interactionStateSet } from '../token-context'

export type StyleOverwrite<TStateOrStyle, TStyle = TStateOrStyle> =
  StyleProp<TStyle> | ((context: TokenContextInput, prev: TStyle) => StyleProp<TStyle>)

export type StyleLeaf<TStyle> = (context?: TokenContextInput) => TStyle
