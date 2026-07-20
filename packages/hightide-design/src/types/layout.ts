import type { ElementSize, FixedUnit, ScalingUnit, TimeValue } from './units'

export type BreakPointTokens = {
  tablet: ScalingUnit,
  desktop: ScalingUnit,
}

export type AnimationTokens = {
  durationIn: TimeValue,
  durationOut: TimeValue,
}

export type SharedLayoutTokens = {
  spacingBase: ScalingUnit,
  drawerIndent: ScalingUnit,
  scrollbarWidth: FixedUnit,
  scrollbarPadding: FixedUnit,
  coloringOutlineWidth: FixedUnit,
  breakpoints: BreakPointTokens,
  animation: AnimationTokens,
}

export type ElementLayoutTokenMap = {
  height: ScalingUnit,
  borderRadius: ScalingUnit,
}

export type ElementLayoutTokens = Record<ElementSize, ElementLayoutTokenMap>

export type ElementPaddingTokenMap = {
  vertical: ScalingUnit,
  horizontal: ScalingUnit,
}

export type ElementPaddingTokens = Record<ElementSize, ElementPaddingTokenMap>

export type ButtonLayoutTokenMap = {
  paddingY: ScalingUnit,
  paddingX: ScalingUnit,
  paddingYOutline: ScalingUnit,
  paddingXOutline: ScalingUnit,
  gap: ScalingUnit,
  minWidth: ScalingUnit,
  borderRadius: ScalingUnit,
}

export type ButtonLayoutTokens = Record<ElementSize, ButtonLayoutTokenMap>

export type IconButtonLayoutTokens = Record<ElementSize, Pick<ButtonLayoutTokenMap, 'paddingYOutline' | 'paddingXOutline' | 'borderRadius'>>

export type IconLayoutTokenMap = {
  size: ScalingUnit,
  strokeWidth: FixedUnit,
}

export type IconLayoutTokens = Record<ElementSize, IconLayoutTokenMap>

export type InputLayoutTokenMap = {
  height: ScalingUnit,
  paddingX: ScalingUnit,
  paddingY: ScalingUnit,
  borderRadius: ScalingUnit,
}

export type ChipLayoutTokenMap = {
  minHeight: ScalingUnit,
  paddingVertical: ScalingUnit,
  paddingHorizontal: ScalingUnit,
  gap: ScalingUnit,
  borderRadius: ScalingUnit,
  fontSize: FixedUnit,
}

export type ChipLayoutTokens = Record<ElementSize, ChipLayoutTokenMap>

export type ComponentLayouts = {
  shared: SharedLayoutTokens,
  element: ElementLayoutTokens,
  elementPadding: ElementPaddingTokens,
  button: ButtonLayoutTokens,
  iconButton: IconButtonLayoutTokens,
  icon: IconLayoutTokens,
  input: Record<'md', InputLayoutTokenMap>,
  chip: ChipLayoutTokens,
}
