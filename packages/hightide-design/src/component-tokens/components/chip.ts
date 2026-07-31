import type {
  ContainerColoringStyle,
  ColorStateFull,
  ColoringType,
  HightideSematicColorSchemeTokens
} from '../../semantic-tokens/colorScheme'
import { colorSchemeTypes } from '../../semantic-tokens/colorScheme'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../../theme-tokens/layout'
import { componentSizes } from '../../theme-tokens/layout'
import { toColorStateFull } from './pressable'

export type ChipLayoutToken = {
  size: number,
  inset: number,
  border: number,
  radius: number,
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

const chipRadiusKeyFor = (size: ComponentSize): 'xs' | 'sm' | 'md' => {
  if (size === 'xl' || size === 'lg') {
    return 'md'
  }
  return size
}

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

  const layout = Object.fromEntries(
    componentSizes.map((size) => {
      const token = control[size]
      const gap = size === 'xs' || size === 'sm' ? semanticTokens.spacing.xs : semanticTokens.spacing.sm
      const sizeValue = token.size
      const inset = token.inset
      const horizontalInset = token.horizontalContentPadding ?? token.inset

      return [size, {
        size: Math.max(sizeValue - semanticTokens.spacing.xs, 24),
        inset: Math.max(Math.round(inset * 0.5), 3),
        border: token.border,
        radius: semanticTokens.borderRadius[chipRadiusKeyFor(size)],
        gap,
        horizontalInset: Math.max(Math.round(horizontalInset * 0.8), semanticTokens.spacing.xs),
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
