import type { SemanticColors } from './semantic'

/**
 * The "coloring" model shared by buttons, chips, icon-buttons, … on web.
 *
 * On the web this is expressed through the `--coloring-*` CSS variables and the
 * `coloring-{solid,tonal,outline,text}` utilities. Native has no cascade, so we
 * reproduce the exact same resolution here as plain data, and the native
 * styling layer turns it into a `StyleSheet`.
 */

/** A role-based color name (`data-color` on web). */
export const coloringRoles = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const
export type ColoringRole = (typeof coloringRoles)[number]

/** A visual treatment (`data-coloringstyle` on web). */
export const coloringStyles = ['solid', 'tonal', 'outline', 'text', 'tonal-outline'] as const
export type ColoringStyle = (typeof coloringStyles)[number]

/** Opacity applied to tonal backgrounds (web uses `/20` and `/30` on hover). */
export const TONAL_BACKGROUND_OPACITY = 0.2
export const TONAL_BACKGROUND_HOVER_OPACITY = 0.3
/** Opacity applied to the hover wash behind `text` style controls (web `/20`). */
export const TEXT_HOVER_BACKGROUND_OPACITY = 0.2

/**
 * The full set of color values a single role resolves to. Mirrors the variables
 * each `@utility <role>` sets in `colors/utilities.css`.
 */
export type ResolvedColorRole = {
  /** Primary fill color. */
  color: string,
  /** Foreground used on top of a solid `color` fill. */
  onColor: string,
  /** Fill color on hover/press. */
  hover: string,
  /** Foreground for `text`/`outline` treatments. */
  text: string,
  textHover: string,
  /** Border color for `outline` treatments. */
  outline: string,
  outlineHover: string,
  /** Background (pre-opacity) and foreground for `tonal` treatments. */
  tonalBackground: string,
  tonalText: string,
}

/**
 * Resolves a role against a color scheme. `neutral` has bespoke text/outline/
 * tonal colors; every other role derives those from its base `color`.
 */
export const resolveColorRole = (role: ColoringRole, colors: SemanticColors): ResolvedColorRole => {
  if (role === 'neutral') {
    return {
      color: colors.neutral,
      onColor: colors.onNeutral,
      hover: colors.neutralHover,
      text: colors.neutralText,
      textHover: colors.neutralTextHover,
      outline: colors.neutralOutline,
      outlineHover: colors.neutralOutlineHover,
      tonalBackground: colors.neutralTonalBackground,
      tonalText: colors.neutralTonalText,
    }
  }

  const base = colors[role]
  const onColor = colors[`on${capitalize(role)}` as keyof SemanticColors]
  const hover = colors[`${role}Hover` as keyof SemanticColors]
  return {
    color: base,
    onColor,
    hover,
    text: base,
    textHover: hover,
    outline: base,
    outlineHover: hover,
    tonalBackground: base,
    tonalText: base,
  }
}

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)
