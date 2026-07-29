import type { SemanticTokens } from '../semantic/semantic-tokens'
import type {
  ComponentSize,
  ComponentSizeBasic
} from '../theme/layout'
import { componentSizes } from '../theme/layout'
import type {
  ComponentElementLayout,
  ComponentTokens
} from './component-tokens'

export type ToComponentsArgs<Tokens extends SemanticTokens = SemanticTokens> = {
  semanticTokens: Tokens,
}

const buttonFontSizes: Record<ComponentSize, number> = {
  xs: 12,
  sm: 14,
  md: 14,
  lg: 18,
  xl: 20,
}

const radiusKeyFor = (size: ComponentSize): 'xs' | 'sm' | 'md' | 'lg' => {
  if (size === 'xl') {
    return 'lg'
  }
  if (size === 'lg') {
    return 'md'
  }
  return size
}

const chipRadiusKeyFor = (size: ComponentSize): 'xs' | 'sm' | 'md' => {
  if (size === 'xl' || size === 'lg') {
    return 'md'
  }
  return size
}

const checkboxControlSize: Record<ComponentSizeBasic, ComponentSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

export const toHightideComponentTokens = ({
  semanticTokens,
}: ToComponentsArgs): ComponentTokens => {
  const colors = semanticTokens.colors
  const colorSchemes = semanticTokens.colorSchemes
  const semantic = semanticTokens
  const control = semantic.elementLayout.control

  const element = Object.fromEntries(
    componentSizes.map((size) => {
      const token = control[size]
      const gap = size === 'xs' || size === 'sm' ? semantic.spacing.xs : semantic.spacing.sm

      return [size, {
        size: token.size,
        inset: token.inset,
        border: token.border,
        radius: Number(semantic.radius[radiusKeyFor(size)]),
        gap,
        horizontalInset: token.horizontalContentPadding ?? token.inset,
        minWidth: token.minimumWidth ?? token.size,
        fontSize: buttonFontSizes[size],
      } satisfies ComponentElementLayout]
    })
  ) as Record<ComponentSize, ComponentElementLayout>

  const icon = Object.fromEntries(
    componentSizes.map((size) => [size, {
      size: semantic.icon[size].size,
      strokeWidth: semantic.border.base,
    }])
  ) as ComponentTokens['icon']

  const avatar = Object.fromEntries(
    componentSizes.map((size) => {
      const dimension = control[size].size - semantic.spacing.xs
      let avatarFontSize = Number(semantic.typography.scales.body.large.fontSize)
      if (size === 'xs' || size === 'sm') {
        avatarFontSize = Number(semantic.typography.scales.caption.small.fontSize)
      } else if (size === 'lg' || size === 'xl') {
        avatarFontSize = Number(semantic.typography.scales.title.small.fontSize)
      }

      return [size, {
        size: dimension,
        padding: Math.max(Math.round(control[size].inset / 2), 2),
        fontSize: avatarFontSize,
        statusDotSize: Math.round(dimension / 2),
        statusDotBorderWidth: size === 'xs' ? semantic.border.thin + 0.5 : semantic.border.base,
      }]
    })
  ) as ComponentTokens['avatar']

  const chipLayout = Object.fromEntries(
    componentSizes.map((size) => {
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
  ) as Record<ComponentSize, ComponentElementLayout>

  const checkboxLayout = Object.fromEntries(
    (['sm', 'md', 'lg'] as const).map((size) => {
      const controlSize = checkboxControlSize[size]
      return [size, control[controlSize]]
    })
  ) as ComponentTokens['checkbox']['layout']

  const inputControl = control.md

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
      size: inputControl.size,
      inset: semantic.spacing.sm,
      border: semantic.border.thin,
      radius: Number(semantic.radius.sm),
      gap: semantic.spacing.sm,
      horizontalInset: semantic.spacing.md,
      minWidth: inputControl.minimumWidth ?? inputControl.size,
      fontSize: Number(semantic.typography.scales.label.medium.fontSize),
      background: colors.surfaceVariant,
      text: colors.onSurface,
    },
    checkbox: {
      layout: checkboxLayout,
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
