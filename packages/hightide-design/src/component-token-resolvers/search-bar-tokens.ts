import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import {
  inputTokenResolver,
  type InputState,
  type InputTokens
} from './input-tokens'

export type SearchBarState = InputState

export type SearchBarComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: SearchBarState,
}

export type SearchBarTokens = {
  container: ContainerTokens,
  input: InputTokens,
  iconButton: ContainerTokens,
  icon: IconTokens,
}

export type SearchBarTokenResolver = ComponentTokenResolver<
  SearchBarComponentResolverProps,
  SearchBarTokens
>

export const searchBarTokenResolver: SearchBarTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const input = inputTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides,
    state,
  })
  const iconButtonLayout = semanticResolvers.controlLayout({
    themeTokens,
    size: 'sm',
  })
  const horizontalPadding = input.container.shape?.padding?.horizontal ?? 0

  return {
    container: {
      size: {
        width: '100%',
      },
    },
    input: {
      ...input,
      container: {
        ...input.container,
        outline: undefined,
        decoration: undefined,
        shape: {
          ...input.container.shape,
          padding: {
            vertical: input.container.shape?.padding?.vertical,
            horizontal: horizontalPadding,
          },
        },
      },
    },
    iconButton: {
      size: {
        width: iconButtonLayout.size,
        height: iconButtonLayout.size,
      },
      margin: {
        horizontal: themeTokens.spacing.sm,
      },
    },
    icon: {
      color: themeTokens.color.surface.onColor,
    },
  }
}
