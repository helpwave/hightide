import type { ButtonTheme } from './button'
import type { ChatTheme } from './chat'
import type { CheckboxTheme } from './checkbox'
import type { ChipTheme } from './chip'
import type { IconButtonTheme } from './iconButton'
import type { InputTheme } from './input'
import type { MenuTheme } from './menu'
import type { MultiSelectTheme } from './multiSelect'
import type { SelectTheme } from './select'

export type ComponentThemes = {
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
