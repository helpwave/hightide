import type { ColorValue, ElementSize } from '@helpwave/hightide-design'
import type { InteractionState, ResolverFunction } from './resolver'

export type CheckboxSize = 'sm' | 'md' | 'lg'

export type CheckboxState = InteractionState & {
  size?: CheckboxSize,
  isChecked?: boolean,
  isIndeterminate?: boolean,
  isInvalid?: boolean,
  isRounded?: boolean,
  alwaysShowCheckIcon?: boolean,
}

export type CheckboxStyle = {
  width: number,
  height: number,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: number,
  borderColor: ColorValue,
  borderRadius: number,
  backgroundColor: ColorValue,
  opacity: number,
}

export type CheckboxIconStyle = {
  color: ColorValue,
  size: Exclude<ElementSize, 'xs'>,
  visible: boolean,
}

export type CheckboxTheme = {
  checkbox: ResolverFunction<CheckboxState, CheckboxStyle>,
  icon: ResolverFunction<CheckboxState, CheckboxIconStyle>,
}
