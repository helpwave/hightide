import { mapChipVariant, toTypographySize } from '@helpwave/hightide-design/semantic-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import { toButtonIconSize } from '@helpwave/hightide-design/component-tokens'
import type { ColorPair } from './types/color'
import type { HightideTheme } from './types/theme'
import type { IconSize } from './types/icongraphy'
import type { InteractionState, TokenContextInput } from './token-context'
import { interactionStateSet } from './token-context'

export const toHexColor = (value: unknown): ColorPair['color'] => {
  if (typeof value === 'string' && value.startsWith('#')) {
    return value as ColorPair['color']
  }
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return toHexColor((value as { value: unknown }).value)
  }
  throw new Error(`Expected HexColor, received ${String(value)}`)
}

export const toColorPair = (pair: { color: unknown, onColor: unknown }): ColorPair => ({
  color: toHexColor(pair.color),
  onColor: toHexColor(pair.onColor),
})

export const pressableTokenContext = (
  theme: HightideTheme,
  options: {
    color?: { color: unknown, onColor: unknown },
    size?: string,
    variant?: string,
    coloringStyle?: string,
    coloringColorVariant?: string,
    hasAdditionalHorizontalPadding?: boolean,
    interaction?: InteractionState,
    extraState?: readonly string[],
  }
): TokenContextInput => {
  const pair = toColorPair(options.color ?? theme.colors.primary)
  const extra = [...(options.extraState ?? [])]
  if (options.variant !== undefined) {
    extra.push(options.variant)
  }
  if (options.hasAdditionalHorizontalPadding) {
    extra.push('additionalHorizontalPadding')
  }

  return {
    params: {
      colors: pair,
    },
    config: {
      size: options.size,
      variant: options.variant,
      coloringStyle: options.coloringStyle,
      coloringColorVariant: options.coloringColorVariant,
    },
    state: interactionStateSet(options.interaction, extra),
  }
}

export const inputTokenContext = (
  theme: HightideTheme,
  options: {
    color?: { color: unknown, onColor: unknown },
    interaction: InteractionState,
  }
): TokenContextInput => {
  const pair = toColorPair(options.color ?? theme.colors.primary)
  const state = interactionStateSet(options.interaction)
  const coloring = theme.semantics.colors.inputColoring({
    params: { colors: { accent: pair.color } },
    state,
  })
  const extra = new Set(state)
  if (options.interaction.isFocused && coloring.border !== HexColorUtils.transparent) {
    extra.add('hasFocusShadow')
  }
  const layout = theme.semantics.numbers.controlLayout({ config: { size: 'md' } })
  const textStyle = theme.typography.body.md
  const placeholderColor = options.interaction.isDisabled
    ? theme.colors.disabled.onColor
    : theme.semantics.colors.asDescription({
      params: {
        colors: {
          color: theme.colors.surface.color,
          onColor: theme.colors.surface.onColor,
        },
      },
    })
  const tint = theme.semantics.colors.pressableStateLayerTint({
    params: { colors: { tint: coloring.text } },
    state: interactionStateSet({
      isHovered: !!options.interaction.isHovered && !options.interaction.isFocused,
      isPressed: options.interaction.isPressed,
    }),
  })
  const outlineColor = !options.interaction.isFocusVisible
    ? HexColorUtils.transparent
    : options.interaction.isInvalid
      ? theme.colors.negative.color
      : pair.color

  return {
    params: {
      colors: {
        background: coloring.background,
        foreground: coloring.text,
        color: coloring.border,
        tint,
        accent: outlineColor,
        disabledForeground: placeholderColor,
      },
      numbers: {
        size: layout.size,
        borderRadius: layout.borderRadius,
        borderWidth: layout.borderWidth,
        inset: layout.inset,
        horizontalContentPadding: layout.horizontalContentPadding,
        iconSize: theme.icongraphy.sizes.md,
        iconStrokeWidth: theme.icongraphy.strokeWidth,
        fontSize: textStyle.fontSize,
        fontWeight: Number.parseInt(textStyle.fontWeight, 10),
        lineHeight: textStyle.lineHeight,
      },
    },
    state: extra,
  }
}

export const chipTokenContext = (
  theme: HightideTheme,
  options: {
    color?: { color: unknown, onColor: unknown },
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    variant?: 'filled' | 'tonal',
  }
): TokenContextInput => {
  const size = options.size ?? 'md'
  const variant = options.variant ?? 'filled'
  const pair = toColorPair(options.color ?? theme.colors.primary)
  const { colorVariant, style } = mapChipVariant(variant)
  const variantColors = theme.semantics.colors.coloringColorVariant({
    params: { colors: pair },
    config: { coloringColorVariant: colorVariant },
  })
  const coloring = theme.semantics.colors.coloringStyle({
    params: {
      colors: {
        color: variantColors.color,
        onColor: variantColors.onColor,
        accent: variantColors.accent,
      },
    },
    config: { coloringStyle: style },
  })
  const layout = theme.semantics.numbers.insideControlLayout({ config: { size } })
  const textStyle = theme.typography.label[toTypographySize(size)]
  const iconSize = theme.icongraphy.sizes[toButtonIconSize(size)]

  return {
    params: {
      colors: {
        background: coloring.background,
        foreground: coloring.foreground,
      },
      numbers: {
        size: layout.size,
        borderRadius: layout.borderRadius,
        inset: layout.inset,
        paddingExtension: layout.paddingExtension,
        gap: size === 'sm' || size === 'xs' ? theme.spacing.xs : theme.spacing.sm,
        iconSize,
        iconStrokeWidth: theme.icongraphy.strokeWidth,
        fontSize: textStyle.fontSize,
        fontWeight: Number.parseInt(textStyle.fontWeight, 10),
        lineHeight: textStyle.lineHeight,
      },
    },
    config: { size, variant },
  }
}

export const avatarTokenContext = (
  theme: HightideTheme,
  options: {
    color?: { color: unknown, onColor: unknown },
    size?: IconSize | number,
    isGrouped?: boolean,
  }
): TokenContextInput => {
  const pair = toColorPair(options.color ?? theme.colors.primary)
  const size = options.size ?? 'md'
  const dimension = typeof size === 'number' ? size : theme.icongraphy.sizes[size]
  const iconSizeKey = typeof size === 'number' ? 'md' : size

  return {
    params: {
      colors: pair,
      numbers: {
        dimension,
        iconSize: theme.icongraphy.sizes[iconSizeKey],
        iconStrokeWidth: theme.icongraphy.strokeWidth,
      },
    },
    config: options.isGrouped ? { 'avatar-group': '' } : {},
  }
}

export const listItemTokenContext = (
  theme: HightideTheme,
  options: {
    color?: { color: unknown, onColor: unknown },
  }
): TokenContextInput => {
  const layout = theme.semantics.numbers.controlLayout({ config: { size: 'md' } })
  const hasColor = options.color !== undefined
  const pair = toColorPair(options.color ?? theme.colors.surface)
  const variantColors = hasColor
    ? theme.semantics.colors.coloringColorVariant({
      params: { colors: pair },
      config: { coloringColorVariant: 'tonal' },
    })
    : undefined
  const coloring = variantColors === undefined
    ? undefined
    : theme.semantics.colors.coloringStyle({
      params: {
        colors: {
          color: variantColors.color,
          onColor: variantColors.onColor,
          accent: variantColors.accent,
        },
      },
      config: { coloringStyle: 'filled' },
    })
  const description = coloring?.foreground ?? theme.semantics.colors.asDescription({
    params: {
      colors: {
        color: theme.colors.surface.color,
        onColor: theme.colors.surface.onColor,
      },
    },
  })

  return {
    params: {
      colors: {
        foreground: coloring?.foreground ?? theme.colors.surface.onColor,
        onColor: description,
        background: coloring?.background ?? theme.colors.surface.color,
      },
      numbers: {
        size: layout.size,
        inset: layout.inset,
        horizontalContentPadding: layout.horizontalContentPadding,
      },
    },
    state: hasColor ? new Set(['tonal']) : new Set(),
  }
}
