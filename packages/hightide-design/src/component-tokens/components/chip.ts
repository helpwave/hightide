import type {
  ContainerColoringStyle,
  ColorStateFull,
  ColoringType,
  HightideSematicColorSchemeTokens
} from '../../semantic-tokens/colorScheme'
import { colorSchemeTypes } from '../../semantic-tokens/colorScheme'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../componentSize'
import { toColorStateFull } from './pressable'

export type ChipLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  fontSize: number,
}

export type ChipColorScheme = Record<ColoringType, ColorStateFull>

export type HightideChipTokens = {
  layout: Record<ComponentSize, ChipLayoutToken>,
  colorSchemes: Record<ContainerColoringStyle, ChipColorScheme>,
}

const chipSizes = ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[]

const chipColoringStyles = [
  'filled',
  'outline',
  'tonal',
  'tonal-outline',
] as const satisfies readonly ContainerColoringStyle[]

const toChipColorSchemes = (
  colorSchemes: HightideSematicColorSchemeTokens
): Record<ContainerColoringStyle, ChipColorScheme> => {
  const transparent = colorSchemes.primary.text.base.color

  return Object.fromEntries(
    chipColoringStyles.map((style) => [
      style,
      Object.fromEntries(
        colorSchemeTypes.map((type) => [
          type,
          toColorStateFull(colorSchemes[type][style].base, style, transparent),
        ])
      ) as ChipColorScheme,
    ])
  ) as Record<ContainerColoringStyle, ChipColorScheme>
}

export const toChipTokens = (
  semanticTokens: HightideSemanticTokens
): HightideChipTokens => {
  const control = semanticTokens.elementLayout.control
  const insideControl = semanticTokens.elementLayout.insideControl

  const layout = Object.fromEntries(
    chipSizes.map((size) => {
      const token = control[size]
      const inside = insideControl[size]
      const gap = size === 'sm' ? semanticTokens.spacing.xs : semanticTokens.spacing.sm
      return [size, {
        size: inside.size,
        inset: inside.inset,
        borderWidth: inside.borderWidth,
        borderRadius: inside.borderRadius,
        gap,
        horizontalInset: inside.inset + inside.paddingExtension,
        minWidth: token.minimumWidth ?? token.size,
        fontSize: Number(semanticTokens.typography.scales.label.medium.fontSize),
      } satisfies ChipLayoutToken]
    })
  ) as Record<ComponentSize, ChipLayoutToken>

  return {
    layout,
    colorSchemes: toChipColorSchemes(semanticTokens.colorSchemes),
  }
}
