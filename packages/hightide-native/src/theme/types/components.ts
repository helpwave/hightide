
import type { Color } from './color'
import type { ButtonTheme } from './components/button'
import type { ChatTheme } from './components/chat'
import type { CheckboxTheme } from './components/checkbox'
import type { ChipTheme } from './components/chip'
import type { IconButtonTheme } from './components/iconButton'
import type { InputTheme } from './components/input'
import type { MenuTheme } from './components/menu'
import type { MultiSelectTheme } from './components/multiSelect'
import type { SelectTheme } from './components/select'

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
}
