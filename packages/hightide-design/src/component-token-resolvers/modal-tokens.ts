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

export const modalTokenResolver: ModalTokenResolver = ({
  themeTokens,
}) => {
  const { color, spacing, padding, borderRadius, borderWidth, elevation } = themeTokens

  return {
    background: {
      backgroundColor: color.overlay,
      padding: {
        type: 'physicalAxis',
        vertical: spacing.xl,
        horizontal: spacing.xl,
      },
      layout: {
        direction: 'vertical',
        mainAxisAlignment: 'center',
        flexGrow: 1,
      },
    },
    menu: {
      backgroundColor: color.surfaceVariant.color,
      overflow: 'hidden',
      position: {
        type: 'relative',
      },
      layout: {
        direction: 'vertical',
        crossAxisAlignment: 'stretch',
      },
      shape: {
        borderRadius: { type: 'all', value: borderRadius.lg },
      },
      border: {
        width: {
          type: 'all',
          value: borderWidth.thin,
        },
        color: {
          type: 'all',
          value: color.border,
        },
      },
      decoration: {
        shadow: elevation.level4,
      },
    },
    closeButton: {
      position: {
        type: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
      },
      padding: {
        type: 'physicalSide',
        top: padding.md,
        right: padding.md,
      },
    },
  }
}
