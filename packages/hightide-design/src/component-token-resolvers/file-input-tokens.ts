import { resolvePressableStateLayerTint } from '../semantic-token-resolvers'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import {
  inputTokenResolver,
  toInputState,
  type InputStateValue
} from './input-tokens'
import { modalTokenResolver } from './modal-tokens'
import { toPressableState } from './pressable-tokens'
import type { TextStyleTokens } from './text-style-tokens'

export type FileInputStateValue =
  | InputStateValue
  | 'open'
  | 'hasValue'
  | 'dragging'
  | 'dragOver'

export type FileInputState = ReadonlySet<FileInputStateValue>

export type FileInputComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: FileInputState,
}

export type FileInputTokens = {
  trigger: ContainerTokens,
  stateLayer: ContainerTokens,
  files: ContainerTokens,
  fileRow: ContainerTokens,
  fileName: TextStyleTokens,
  placeholder: TextStyleTokens,
  icon: IconTokens,
  fileIcon: IconTokens,
  overlay: ContainerTokens,
  menu: ContainerTokens,
  menuBody: ContainerTokens,
  menuHeader: ContainerTokens,
  dropHint: TextStyleTokens,
  menuTitle: TextStyleTokens,
  addButtonContainer: ContainerTokens,
}

export type FileInputTokenResolver = ComponentTokenResolver<
  FileInputComponentResolverProps,
  FileInputTokens
>

export const fileInputTokenResolver: FileInputTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const { color, spacing, padding, typography, borderWidth } = themeTokens
  const input = inputTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      color: overrides?.color,
    },
    state: toInputState(state),
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toPressableState(state),
    color: input.text.color ?? color.surface.onColor,
  })
  const modal = modalTokenResolver({
    themeTokens,
    semanticResolvers,
  })
  const inputPadding = input.container.padding
  const horizontalPadding = inputPadding?.type === 'physicalAxis'
    ? inputPadding.horizontal
    : undefined
  const isFileDrag = state.has('dragging')
  const isDragOver = state.has('dragOver')
  const showDropBorder = isFileDrag || isDragOver
  const dropAccent = (overrides?.color ?? color.primary).color
  const touchTargetSize = semanticResolvers.touchTargetSize({ themeTokens })

  return {
    trigger: {
      ...input.container,
      layout: {
        ...input.container.layout,
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        mainAxisAlignment: 'space-between',
        gap: horizontalPadding,
      },
    },
    stateLayer: {
      backgroundColor: tint,
    },
    files: {
      size: {
        minWidth: 0,
      },
      layout: {
        direction: 'vertical',
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'stretch',
        gap: spacing.xs,
        flexGrow: 1,
        flexShrink: 1,
      },
    },
    fileRow: {
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'start',
        crossAxisAlignment: 'center',
        gap: spacing.sm,
      },
    },
    fileName: state.has('hasValue') ? input.text : input.placeholder,
    placeholder: input.placeholder,
    icon: input.icon,
    fileIcon: input.icon,
    overlay: modal.background,
    menu: {
      ...modal.menu,
      size: {
        minHeight: touchTargetSize * 8,
        maxHeight: touchTargetSize * 14,
      },
      border: {
        width: {
          type: 'all',
          value: borderWidth.normal,
        },
        color: {
          type: 'all',
          value: showDropBorder ? dropAccent : 'transparent',
        },
        style: isDragOver || !showDropBorder ? 'solid' : 'dashed',
      },
    },
    menuBody: {
      padding: {
        type: 'physicalSide',
        top: padding.xl,
        bottom: padding.xl,
        left: padding.xl,
        right: padding.xl,
      },
      layout: {
        direction: 'vertical',
        crossAxisAlignment: 'stretch',
        gap: spacing.md,
        flexGrow: 1,
      },
    },
    menuHeader: {
      padding: {
        type: 'physicalSide',
        right: padding.xl,
      },
    },
    dropHint: {
      ...typography.body.sm,
      textAlign: 'center',
      color: semanticResolvers.asDescription({
        themeTokens,
        colorPair: color.surface,
      }),
    },
    menuTitle: {
      ...typography.heading.md,
      color: color.surface.onColor,
    },
    addButtonContainer: {
      layout: {
        direction: 'vertical',
        crossAxisAlignment: 'stretch',
      },
    },
  }
}
