import { spacing } from './size'
import type { ElementSize, RemValue } from './types'

export type ElementPaddingTokenMap = {
  vertical: RemValue,
  horizontal: RemValue,
}

export type ElementPaddingTokens = Record<ElementSize, ElementPaddingTokenMap>

export const elementPadding = {
  xs: {
    vertical: '0.375rem',
    horizontal: '0.5625rem',
  },
  sm: {
    vertical: '0.375rem',
    horizontal: '0.75rem',
  },
  md: {
    vertical: '0.625rem',
    horizontal: '1.25rem',
  },
  lg: {
    vertical: '0.625rem',
    horizontal: '1.875rem',
  },
} as const satisfies ElementPaddingTokens

export type ButtonPaddingTokenMap = {
  paddingY: RemValue,
  paddingX: RemValue,
  paddingYOutline: RemValue,
  paddingXOutline: RemValue,
  gap: RemValue,
  minWidth: RemValue,
  borderRadius: RemValue,
}

export type ButtonPaddingTokens = Record<ElementSize, ButtonPaddingTokenMap>

const outlineWidth = spacing.coloringOutlineWidth

const subtractOutline = (value: RemValue): RemValue => {
  const numeric = Number.parseFloat(value)
  const outline = Number.parseFloat(outlineWidth)
  return `${numeric - outline}rem`
}

export const buttonPadding = {
  xs: {
    paddingY: elementPadding.xs.vertical,
    paddingX: elementPadding.xs.horizontal,
    paddingYOutline: subtractOutline(elementPadding.xs.vertical),
    paddingXOutline: subtractOutline(elementPadding.xs.horizontal),
    gap: '0.25rem',
    minWidth: '5rem',
    borderRadius: '0.25rem',
  },
  sm: {
    paddingY: elementPadding.sm.vertical,
    paddingX: elementPadding.sm.horizontal,
    paddingYOutline: subtractOutline(elementPadding.sm.vertical),
    paddingXOutline: subtractOutline(elementPadding.sm.horizontal),
    gap: '0.25rem',
    minWidth: '7rem',
    borderRadius: '0.375rem',
  },
  md: {
    paddingY: elementPadding.md.vertical,
    paddingX: elementPadding.md.horizontal,
    paddingYOutline: subtractOutline(elementPadding.md.vertical),
    paddingXOutline: subtractOutline(elementPadding.md.horizontal),
    gap: '0.5rem',
    minWidth: '9rem',
    borderRadius: '0.375rem',
  },
  lg: {
    paddingY: elementPadding.lg.vertical,
    paddingX: elementPadding.lg.horizontal,
    paddingYOutline: subtractOutline(elementPadding.lg.vertical),
    paddingXOutline: subtractOutline(elementPadding.lg.horizontal),
    gap: '0.5rem',
    minWidth: '11.25rem',
    borderRadius: '0.5rem',
  },
} as const satisfies ButtonPaddingTokens

export type IconButtonPaddingTokens = Record<ElementSize, Pick<ButtonPaddingTokenMap, 'paddingYOutline' | 'paddingXOutline' | 'borderRadius'>>

export const iconButtonPadding = {
  xs: {
    paddingYOutline: buttonPadding.xs.paddingYOutline,
    paddingXOutline: buttonPadding.xs.paddingXOutline,
    borderRadius: buttonPadding.xs.borderRadius,
  },
  sm: {
    paddingYOutline: buttonPadding.sm.paddingYOutline,
    paddingXOutline: buttonPadding.sm.paddingXOutline,
    borderRadius: buttonPadding.sm.borderRadius,
  },
  md: {
    paddingYOutline: buttonPadding.md.paddingYOutline,
    paddingXOutline: buttonPadding.md.paddingXOutline,
    borderRadius: buttonPadding.md.borderRadius,
  },
  lg: {
    paddingYOutline: buttonPadding.lg.paddingYOutline,
    paddingXOutline: buttonPadding.lg.paddingXOutline,
    borderRadius: buttonPadding.lg.borderRadius,
  },
} as const satisfies IconButtonPaddingTokens
