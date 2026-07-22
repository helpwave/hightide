import type { Color } from '@/src/theme/types/color'
import type { ButtonTheme } from '@/src/theme/types/components/button'
import type { ChatTheme } from '@/src/theme/types/components/chat'
import type { CheckboxTheme } from '@/src/theme/types/components/checkbox'
import type { ChipTheme } from '@/src/theme/types/components/chip'
import type { IconButtonTheme } from '@/src/theme/types/components/iconButton'
import type { InputTheme } from '@/src/theme/types/components/input'
import type { MenuTheme } from '@/src/theme/types/components/menu'
import type { MultiSelectTheme } from '@/src/theme/types/components/multiSelect'
import type { SelectTheme } from '@/src/theme/types/components/select'

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
