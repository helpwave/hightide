import type { ElementSize } from '../primitive/elements'
import type { SemanticTokens } from '../semantic/to-semantic'
import type {
  ComponentElementLayout,
  ComponentTokens
} from './component-tokens'

export type ToComponentsArgs<Tokens extends SemanticTokens = SemanticTokens> = {
  semanticTokens: Tokens,
}

const elementSizes: ElementSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

const buttonMinWidths: Record<ElementSize, number> = {
  xs: 80,
  sm: 112,
  md: 144,
  lg: 180,
  xl: 200,
}

const buttonFontSizes: Record<ElementSize, number> = {
  xs: 12,
  sm: 14,
  md: 14,
  lg: 18,
  xl: 20,
}

const radiusKeyFor = (size: ElementSize): 'xs' | 'sm' | 'md' | 'lg' => {
  if (size === 'xl') {
    return 'lg'
  }
  if (size === 'lg') {
    return 'md'
  }
  return size
}

const chipRadiusKeyFor = (size: ElementSize): 'xs' | 'sm' | 'md' => {
  if (size === 'xl' || size === 'lg') {
    return 'md'
  }
  return size
}

export const toHightideComponentTokens = ({
  semanticTokens,
}: ToComponentsArgs): ComponentTokens => {
  const colors = semanticTokens.colors
  const colorSchemes = semanticTokens.colorSchemes
  const semantic = semanticTokens

  const element = Object.fromEntries(
    elementSizes.map((size) => {
      const token = semantic.elements[size]
      const horizontalInset = size === 'xs' || size === 'sm'
        ? token.inset + semantic.spacing.xs
        : token.inset + semantic.spacing.md
      const gap = size === 'xs' || size === 'sm' ? semantic.spacing.xs : semantic.spacing.sm

      return [size, {
        size: token.size,
        inset: token.inset,
        border: token.border,
        radius: Number(semantic.radius[radiusKeyFor(size)]),
        gap,
        horizontalInset,
        minWidth: buttonMinWidths[size],
        fontSize: buttonFontSizes[size],
      } satisfies ComponentElementLayout]
    })
  ) as Record<ElementSize, ComponentElementLayout>

  const icon = Object.fromEntries(
    elementSizes.map((size) => {
      let iconSize = semantic.spacing.md
      if (size === 'sm') {
        iconSize = semantic.spacing.md + semantic.spacing.xs / 2
      } else if (size === 'md') {
        iconSize = semantic.spacing.lg
      } else if (size === 'lg') {
        iconSize = semantic.spacing.xl - semantic.spacing.xs
      } else if (size === 'xl') {
        iconSize = semantic.spacing.xl
      }

      return [size, {
        size: iconSize,
        strokeWidth: semantic.border.base,
      }]
    })
  ) as ComponentTokens['icon']

  const avatar = Object.fromEntries(
    elementSizes.map((size) => {
      const dimension = semantic.elements[size].size - semantic.spacing.xs
      let avatarFontSize = Number(semantic.typography.scales.body.large.fontSize)
      if (size === 'xs' || size === 'sm') {
        avatarFontSize = Number(semantic.typography.scales.caption.small.fontSize)
      } else if (size === 'lg' || size === 'xl') {
        avatarFontSize = Number(semantic.typography.scales.title.small.fontSize)
      }

      return [size, {
        size: dimension,
        padding: Math.max(Math.round(semantic.elements[size].inset / 2), 2),
        fontSize: avatarFontSize,
        statusDotSize: Math.round(dimension / 2),
        statusDotBorderWidth: size === 'xs' ? semantic.border.thin + 0.5 : semantic.border.base,
      }]
    })
  ) as ComponentTokens['avatar']

  const chipLayout = Object.fromEntries(
    elementSizes.map((size) => {
      const token = element[size]
      return [size, {
        ...token,
        size: Math.max(token.size - semantic.spacing.xs, 24),
        inset: Math.max(Math.round(token.inset * 0.5), 3),
        horizontalInset: Math.max(Math.round(token.horizontalInset * 0.8), semantic.spacing.xs),
        fontSize: Number(semantic.typography.scales.label.medium.fontSize),
        radius: Number(semantic.radius[chipRadiusKeyFor(size)]),
      } satisfies ComponentElementLayout]
    })
  ) as Record<ElementSize, ComponentElementLayout>

  return {
    button: {
      layout: element,
    },
    iconButton: {
      layout: element,
    },
    chip: {
      layout: chipLayout,
    },
    input: {
      ...element.md,
      horizontalInset: semantic.spacing.md,
      inset: semantic.spacing.sm,
      radius: Number(semantic.radius.sm),
      border: semantic.border.thin,
      fontSize: Number(semantic.typography.scales.label.medium.fontSize),
      background: colors.surfaceVariant,
      text: colors.onSurface,
    },
    menu: {
      background: colors.surfaceVariant,
      text: colors.onSurface,
      border: colors.menuBorder,
    },
    progressIndicator: {
      fill: colorSchemes.primary.filled.base.background,
      background: colors.progressTrack,
    },
    switch: {
      track: {
        inactive: colors.surfaceVariant,
        active: colorSchemes.primary.filled.base.background,
      },
      thumb: {
        inactive: colors.switchThumbInactive,
        active: colors.switchThumbActive,
      },
      borderColor: colors.switchBorder,
    },
    icon,
    avatar,
    avatarGroup: {
      overlap: 0.5,
      maxShown: 5,
      gap: semantic.spacing.sm,
    },
  }
}
