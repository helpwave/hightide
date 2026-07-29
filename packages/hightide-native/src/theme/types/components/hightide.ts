import type { ColoringTokens } from '@helpwave/hightide-design/theme'
import type { AvatarTheme } from './avatar'
import type { ButtonTheme } from './button'
import type { ChatTheme } from './chat'
import type { CheckboxTheme } from './checkbox'
import type { ChipTheme } from './chip'
import type { IconButtonTheme } from './iconButton'
import type { InputTheme } from './input'
import type { CardTheme } from './card'
import type { MultiSelectTheme } from './multiSelect'
import type { SelectTheme } from './select'
import type { SwitchTheme } from './switch'

export type HightideComponentThemes = {
  coloring: ColoringTokens,
  button: ButtonTheme,
  iconButton: IconButtonTheme,
  chip: ChipTheme,
  checkbox: CheckboxTheme,
  switch: SwitchTheme,
  input: InputTheme,
  select: SelectTheme,
  multiSelect: MultiSelectTheme,
  chat: ChatTheme,
  card: CardTheme,
  avatar: AvatarTheme,
}
