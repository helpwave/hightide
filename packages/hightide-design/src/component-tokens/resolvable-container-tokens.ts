import type { ResolverConfig, ResolverState } from '../primitive-tokens'
import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { OverflowToken } from '../primitive-tokens/overflow-token'
import type { TokenRefOrValue } from '../utils/token-type'
import type {
  BorderToken,
  BorderRadiusToken,
  ContainerLayoutTokens,
  ContainerSizeTokens,
  MarginToken,
  OutlineToken,
  PaddingToken,
  PositioningToken,
  ShadowToken,
  TransformTokens
} from './container-tokens'
import type { ContextBasedProperty } from './context-based'
import type { ResolvableLeaves } from './resolvable-leaves'

export type ResolvableShadowTokens = ResolvableLeaves<ShadowToken>
export type ResolvableOutlineTokens = ResolvableLeaves<OutlineToken>

export type ResolvableContainerTokens<
  State extends ResolverState = ResolverState,
  Config extends ResolverConfig = ResolverConfig
> = {
  type: 'container',
  backgroundColor?: ContextBasedProperty<TokenRefOrValue<ColorValueToken>, State, Config>,
  opacity?: ContextBasedProperty<TokenRefOrValue<NumberValueToken>, State, Config>,
  overflow?: ContextBasedProperty<TokenRefOrValue<OverflowToken>, State, Config>,
  position?: ContextBasedProperty<ResolvableLeaves<PositioningToken>, State, Config>,
  transform?: ContextBasedProperty<ResolvableLeaves<TransformTokens>, State, Config>,
  border?: ContextBasedProperty<ResolvableLeaves<BorderToken>, State, Config>,
  size?: ContextBasedProperty<ResolvableLeaves<ContainerSizeTokens>, State, Config>,
  borderRadius?: ContextBasedProperty<ResolvableLeaves<BorderRadiusToken>, State, Config>,
  padding?: ContextBasedProperty<ResolvableLeaves<PaddingToken>, State, Config>,
  margin?: ContextBasedProperty<ResolvableLeaves<MarginToken>, State, Config>,
  layout?: ContextBasedProperty<ResolvableLeaves<ContainerLayoutTokens>, State, Config>,
  shadow?: ContextBasedProperty<ResolvableShadowTokens, State, Config>,
  outline?: ContextBasedProperty<ResolvableOutlineTokens, State, Config>,
}
