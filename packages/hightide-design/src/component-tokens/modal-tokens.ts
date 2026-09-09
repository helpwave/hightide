import { stateful, tokenVariable, tokenValue } from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { elevationTokens } from './elevation-tokens'
import type { ComponentTokenConfig } from './token-config'

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
    backgroundColor: stateful(tokenVariable('theme.color.overlay')),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('theme.spacing.xl'),
      horizontal: tokenVariable('theme.spacing.xl'),
    }),
    layout: stateful({
      direction: 'vertical',
      mainAxisAlignment: 'center',
      flexGrow: tokenValue(1),
    }),
  },
  menu: {
    backgroundColor: stateful(tokenVariable('theme.color.surfaceVariant.color')),
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
      value: tokenVariable('theme.borderRadius.lg'),
    }),
    border: stateful({
      width: {
        type: 'all',
        value: tokenVariable('theme.borderWidth.thin'),
      },
      color: {
        type: 'all',
        value: tokenVariable('theme.color.border'),
      },
    }),
    shadow: stateful(elevationTokens('level4')),
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
      top: tokenVariable('theme.padding.md'),
      right: tokenVariable('theme.padding.md'),
    }),
  },
} as const satisfies ComponentTokenConfig<ModalTokens>
