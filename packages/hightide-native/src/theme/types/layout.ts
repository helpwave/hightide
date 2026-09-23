import type { HexColor } from './color'

export type HightideSize = Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>

export type HightideSpacing = Record<'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>

export type HightidePadding = Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>

export type HightideBorderRadius = Record<'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>

export type HightideBorderWidth = Record<'thin' | 'normal' | 'thick', number>

export type Shadow = {
  x: number,
  y: number,
  blur: number,
  spread: number,
  color: HexColor,
}

export type HightideElevation = Record<'level1' | 'level2' | 'level3' | 'level4' | 'level5', Shadow>

export type HightideMotion = {
  durations: Record<'fast' | 'normal' | 'slow', number>,
}

export type HightideShadowToken = Shadow

export type HightideShadow = {
  raised: Shadow,
  container: Shadow,
  popover: Shadow,
  dialog: Shadow,
}
