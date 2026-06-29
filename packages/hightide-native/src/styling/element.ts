import type { TextStyle } from 'react-native'
import type { ElementSize, Theme } from '@helpwave/hightide-tokens'

export type { ElementSize }

export type ResolvedElement = {
  height: number,
  paddingVertical: number,
  paddingHorizontal: number,
  gap: number,
  borderRadius: number,
  /** Text styling for the element's label, matching the web button sizes. */
  text: Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight'>,
}

const labelText: Record<ElementSize, ResolvedElement['text']> = {
  xs: { fontSize: 12, lineHeight: 15, fontWeight: '600' },
  sm: { fontSize: 16, lineHeight: 19, fontWeight: '600' },
  md: { fontSize: 16, lineHeight: 19, fontWeight: '600' },
  lg: { fontSize: 18, lineHeight: 23, fontWeight: '600' },
}

/**
 * Resolves the geometry (height/padding/radius/gap) and label typography for an
 * interactive element at a given size, from the shared spacing/radii tokens.
 */
export const resolveElement = (theme: Theme, size: ElementSize): ResolvedElement => ({
  height: theme.spacing.elementHeight[size],
  paddingVertical: theme.spacing.elementPaddingVertical[size],
  paddingHorizontal: theme.spacing.elementPaddingHorizontal[size],
  gap: theme.spacing.elementGap[size],
  borderRadius: theme.elementRadius[size],
  text: labelText[size],
})
