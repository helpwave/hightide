import type { ElementSize, RemValue, TimeValue } from './types'

export type SpacingTokens = {
  base: RemValue,
  drawerIndent: RemValue,
  scrollbarWidth: RemValue,
  scrollbarPadding: RemValue,
  coloringOutlineWidth: RemValue,
}

export const spacing = {
  base: '0.25rem',
  drawerIndent: '1rem',
  scrollbarWidth: '0.625rem',
  scrollbarPadding: '0.0625rem',
  coloringOutlineWidth: '0.125rem',
} as const satisfies SpacingTokens

export type ElementSizeTokenMap = {
  height: RemValue,
  borderRadius: RemValue,
}

export type ElementSizeTokens = Record<ElementSize, ElementSizeTokenMap>

export const elementSizes = {
  xs: {
    height: '1.75rem',
    borderRadius: '0.25rem',
  },
  sm: {
    height: '2.25rem',
    borderRadius: '0.375rem',
  },
  md: {
    height: '2.75rem',
    borderRadius: '0.375rem',
  },
  lg: {
    height: '3.25rem',
    borderRadius: '0.5rem',
  },
} as const satisfies ElementSizeTokens

export type InputElementSizeTokenMap = {
  height: RemValue,
  paddingX: RemValue,
  paddingY: RemValue,
  borderRadius: RemValue,
}

export const inputElementSizes = {
  md: {
    height: elementSizes.md.height,
    paddingX: '0.75rem',
    paddingY: '0.5rem',
    borderRadius: elementSizes.md.borderRadius,
  },
} as const satisfies Record<'md', InputElementSizeTokenMap>

export type BreakpointTokens = {
  tablet: RemValue,
  desktop: RemValue,
}

export const breakpoints = {
  tablet: '48rem',
  desktop: '64rem',
} as const satisfies BreakpointTokens

export type AnimationDurationTokens = {
  in: TimeValue,
  out: TimeValue,
}

export const animationDurations = {
  in: '250ms',
  out: '170ms',
} as const satisfies AnimationDurationTokens
