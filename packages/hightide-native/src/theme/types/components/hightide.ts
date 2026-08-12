import type { IconSize } from '@helpwave/hightide-design/theme-tokens'
import type { IconTokens } from '@helpwave/hightide-design/component-token-resolvers'

import type { AvatarThemeResolvers } from './avatar'
import type { ButtonThemeResolvers } from './button'
import type { ChatThemeResolvers } from './chat'
import type { CheckboxThemeResolvers } from './checkbox'
import type { ChipThemeResolvers } from './chip'
import type { IconButtonThemeResolvers } from './iconButton'
import type { InputThemeResolvers } from './input'
import type { CardThemeResolvers } from './card'
import type { DividerThemeResolvers } from './divider'
import type { ListItemThemeResolvers } from './listItem'
import type { MultiSelectThemeResolvers } from './multiSelect'
import type { SelectThemeResolvers } from './select'
import type { SwitchThemeResolvers } from './switch'

export type IconThemeResolvers = Record<IconSize, IconTokens>

export type HightideComponentThemes = {
  button: ButtonThemeResolvers,
  iconButton: IconButtonThemeResolvers,
  chip: ChipThemeResolvers,
  checkbox: CheckboxThemeResolvers,
  switch: SwitchThemeResolvers,
  input: InputThemeResolvers,
  select: SelectThemeResolvers,
  multiSelect: MultiSelectThemeResolvers,
  chat: ChatThemeResolvers,
  card: CardThemeResolvers,
  divider: DividerThemeResolvers,
  listItem: ListItemThemeResolvers,
  avatar: AvatarThemeResolvers,
  icon: IconThemeResolvers,
}
