import { stateful, tokenPath, tokenValue } from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'

export type ModalTokens = {
  background: ContainerTokens,
  menu: ContainerTokens,
  closeButton: ContainerTokens,
}

export type ModalTokenResolver = ComponentTokenResolver<
  object,
  ModalTokens
>

export const modalTokens = {
  background: {
    backgroundColor: stateful(tokenPath('theme.color.overlay')),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('theme.spacing.xl'),
      horizontal: tokenPath('theme.spacing.xl'),
    }),
    layout: stateful({
      direction: 'vertical',
      mainAxisAlignment: 'center',
      flexGrow: tokenValue(1),
    }),
  },
  menu: {
    backgroundColor: stateful(tokenPath('theme.color.surfaceVariant.color')),
    overflow: stateful('hidden'),
    position: stateful({
      type: 'relative',
    }),
    layout: stateful({
      direction: 'vertical',
      crossAxisAlignment: 'stretch',
    }),
    borderRadius: stateful({
      type: 'all',
      value: tokenPath('theme.borderRadius.lg'),
    }),
    border: stateful({
      width: {
        type: 'all',
        value: tokenPath('theme.borderWidth.thin'),
      },
      color: {
        type: 'all',
        value: tokenPath('theme.color.border'),
      },
    }),
    shadow: stateful(tokenPath('theme.elevation.level4')),
  },
  closeButton: {
    position: stateful({
      type: 'absolute',
      top: tokenValue(0),
      right: tokenValue(0),
      zIndex: tokenValue(1),
    }),
    padding: stateful({
      type: 'physicalSide',
      top: tokenPath('theme.padding.md'),
      right: tokenPath('theme.padding.md'),
    }),
  },
} as const
