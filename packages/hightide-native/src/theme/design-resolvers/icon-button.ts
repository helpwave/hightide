import {
  iconButtonTokens,
  toButtonIconSize,
  type IconButtonTokenResolver,
  type PressableButtonTokenParams,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import {
  semanticTokens,
  type ButtonTokenConfig,
  type ControlElementLayoutToken,
  type IconButtonVariant
} from '@helpwave/hightide-design/semantic-tokens'
import {
  resolveContainerTokenConfig,
  resolveIconTokenConfig,
  type TokenResolveContext
} from '../static-resolve/resolve'
import { iconTokenResolver } from './icon'

type IconButtonTokenState = PressableStateValue | IconButtonVariant

type IconButtonParams = Pick<PressableButtonTokenParams, 'colorPair'> & {
  layout: ControlElementLayoutToken,
  iconSize: number,
  iconStrokeWidth: number,
}

export const iconButtonTokenResolver: IconButtonTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const variant = overrides.variant ?? 'filled'
  const colorPair = overrides.color ?? themeTokens.color.primary
  const layout = semanticResolvers.controlLayout({
    themeTokens,
    size,
  })
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      size: toButtonIconSize(size),
    },
  })
  const states = new Set<IconButtonTokenState>([...state, variant])
  const params: IconButtonParams = {
    colorPair,
    layout,
    iconSize: iconSizeTokens.size ?? themeTokens.icongraphy.sizes.md,
    iconStrokeWidth: iconSizeTokens.strokeWidth ?? themeTokens.icongraphy.strokeWidth,
  }
  const config: ButtonTokenConfig = {
    variant,
    size,
  }
  const context: TokenResolveContext = {
    theme: themeTokens,
    semantics: semanticTokens,
    params,
    config,
    state: states,
  }

  return {
    container: resolveContainerTokenConfig(iconButtonTokens.container, context),
    stateLayer: resolveContainerTokenConfig(iconButtonTokens.stateLayer, context),
    icon: resolveIconTokenConfig(iconButtonTokens.icon, context),
  }
}
