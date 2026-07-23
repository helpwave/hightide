import type { Color } from '../color'
import type { AvatarTheme } from './avatar'
import type { ButtonTheme } from './button'
import type { ChatTheme } from './chat'
import type { CheckboxTheme } from './checkbox'
import type { ChipTheme } from './chip'
import type { IconButtonTheme } from './iconButton'
import type { InputTheme } from './input'
import type { MenuTheme } from './menu'
import type { MultiSelectTheme } from './multiSelect'
import type { SelectTheme } from './select'

export type ColoringDefinition = {
  color: Color,
  onColor: Color,
  hover: Color,
  text?: Color,
  textHover?: Color,
  outline?: Color,
  outlineHover?: Color,
  tonalText?: Color,
  tonalBackground?: Color,
}

export type HightideComponentThemes = {
  coloring: {
    primary: ColoringDefinition,
    secondary: ColoringDefinition,
    positive: ColoringDefinition,
    warning: ColoringDefinition,
    negative: ColoringDefinition,
    neutral: ColoringDefinition,
  } & Record<string, ColoringDefinition>,
  button: ButtonTheme,
  iconButton: IconButtonTheme,
  chip: ChipTheme,
  checkbox: CheckboxTheme,
  input: InputTheme,
  select: SelectTheme,
  multiSelect: MultiSelectTheme,
  chat: ChatTheme,
  menu: MenuTheme,
  avatar: AvatarTheme,
}
