export type ScalingUnitToken = number

export type FixedUnitToken = number

export type ElementSize = 'xs' | 'sm' | 'md' | 'lg'

export type BreakPointTokens = {
  tablet: ScalingUnitToken,
  desktop: ScalingUnitToken,
}

export type SharedLayoutTokens = {
  spacingBase: ScalingUnitToken,
  drawerIndent: ScalingUnitToken,
  scrollbarWidth: FixedUnitToken,
  scrollbarPadding: FixedUnitToken,
  coloringOutlineWidth: FixedUnitToken,
  breakpoints: BreakPointTokens,
}

export type ElementLayoutTokenMap = {
  height: ScalingUnitToken,
  borderRadius: ScalingUnitToken,
}

export type ElementLayoutTokens = Record<ElementSize, ElementLayoutTokenMap>

export type ElementPaddingTokenMap = {
  vertical: ScalingUnitToken,
  horizontal: ScalingUnitToken,
}

export type ElementPaddingTokens = Record<ElementSize, ElementPaddingTokenMap>

export type ButtonLayoutTokenMap = {
  paddingY: ScalingUnitToken,
  paddingX: ScalingUnitToken,
  paddingYOutline: ScalingUnitToken,
  paddingXOutline: ScalingUnitToken,
  gap: ScalingUnitToken,
  minWidth: ScalingUnitToken,
  borderRadius: ScalingUnitToken,
}

export type ButtonLayoutTokens = Record<ElementSize, ButtonLayoutTokenMap>

export type IconButtonLayoutTokens = Record<ElementSize, Pick<ButtonLayoutTokenMap, 'paddingYOutline' | 'paddingXOutline' | 'borderRadius'>>

export type IconLayoutTokenMap = {
  size: ScalingUnitToken,
  strokeWidth: FixedUnitToken,
}

export type IconLayoutTokens = Record<ElementSize, IconLayoutTokenMap>

export type InputLayoutTokenMap = {
  height: ScalingUnitToken,
  paddingX: ScalingUnitToken,
  paddingY: ScalingUnitToken,
  borderRadius: ScalingUnitToken,
}

export type ChipLayoutTokenMap = {
  minHeight: ScalingUnitToken,
  paddingVertical: ScalingUnitToken,
  paddingHorizontal: ScalingUnitToken,
  gap: ScalingUnitToken,
  borderRadius: ScalingUnitToken,
  fontSize: FixedUnitToken,
}

export type ChipLayoutTokens = Record<ElementSize, ChipLayoutTokenMap>

export type AvatarLayoutTokenMap = {
  size: ScalingUnitToken,
  padding: ScalingUnitToken,
  fontSize: FixedUnitToken,
  statusDotSize: ScalingUnitToken,
  statusDotBorderWidth: FixedUnitToken,
}

export type AvatarLayoutTokens = Record<ElementSize, AvatarLayoutTokenMap>

export type AvatarGroupLayoutTokens = {
  overlap: number,
  maxShown: number,
  gap: ScalingUnitToken,
}

export type ComponentLayoutTokens = {
  shared: SharedLayoutTokens,
  element: ElementLayoutTokens,
  elementPadding: ElementPaddingTokens,
  button: ButtonLayoutTokens,
  iconButton: IconButtonLayoutTokens,
  icon: IconLayoutTokens,
  input: Record<'md', InputLayoutTokenMap>,
  chip: ChipLayoutTokens,
  avatar: AvatarLayoutTokens,
  avatarGroup: AvatarGroupLayoutTokens,
}
