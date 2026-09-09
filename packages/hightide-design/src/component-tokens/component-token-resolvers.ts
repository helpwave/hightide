import type {
  AvatarGroupTokenResolver,
  AvatarTokenResolver,
  AvatarWithStatusTokenResolver
} from './avatar-tokens'
import type { ButtonTokenResolver } from './button-tokens'
import type { CardTokenResolver } from './card-tokens'
import type { ChatTokenResolvers } from './chat/chat-token-resolvers'
import type { CheckboxTokenResolver } from './checkbox-tokens'
import type { ChipTokenResolver } from './chip-tokens'
import type { DividerTokenResolver } from './divider-tokens'
import type { IconButtonTokenResolver } from './icon-button-tokens'
import type { IconTokenResolver } from './icon-tokens'
import type { InputTokenResolver } from './input-tokens'
import type { ListItemTokenResolvers } from './list-items'
import type { ModalTokenResolver } from './modal-tokens'
import type { MultiSelectTokenResolver } from './multi-select-tokens'
import type { PressableTokenResolver } from './pressable-tokens'
import type { SearchBarTokenResolver } from './search-bar-tokens'
import type { SelectTokenResolver } from './select-tokens'
import type { SwitchTokenResolver } from './switch-tokens'
import type { TextareaTokenResolver } from './textarea-tokens'

export type ComponentTokenResolvers = {
  button: ButtonTokenResolver,
  iconButton: IconButtonTokenResolver,
  pressable: PressableTokenResolver,
  chip: ChipTokenResolver,
  checkbox: CheckboxTokenResolver,
  switch: SwitchTokenResolver,
  input: InputTokenResolver,
  textarea: TextareaTokenResolver,
  searchBar: SearchBarTokenResolver,
  select: SelectTokenResolver,
  multiSelect: MultiSelectTokenResolver,
  card: CardTokenResolver,
  divider: DividerTokenResolver,
  listItem: ListItemTokenResolvers,
  modal: ModalTokenResolver,
  avatar: AvatarTokenResolver,
  avatarWithStatus: AvatarWithStatusTokenResolver,
  avatarGroup: AvatarGroupTokenResolver,
  icon: IconTokenResolver,
  chat: ChatTokenResolvers,
}
