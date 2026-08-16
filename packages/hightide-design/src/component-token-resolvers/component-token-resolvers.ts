import {
  avatarGroupTokenResolver,
  avatarTokenResolver,
  avatarWithStatusTokenResolver,
  type AvatarGroupTokenResolver,
  type AvatarTokenResolver,
  type AvatarWithStatusTokenResolver
} from './avatar-tokens'
import {
  buttonTokenResolver,
  type ButtonTokenResolver
} from './button-tokens'
import {
  cardTokenResolver,
  type CardTokenResolver
} from './card-tokens'
import { chatTokenResolvers, type ChatTokenResolvers } from './chat/chat-token-resolvers'
import {
  checkboxTokenResolver,
  type CheckboxTokenResolver
} from './checkbox-tokens'
import {
  chipTokenResolver,
  type ChipTokenResolver
} from './chip-tokens'
import {
  dividerTokenResolver,
  type DividerTokenResolver
} from './divider-tokens'
import {
  iconButtonTokenResolver,
  type IconButtonTokenResolver
} from './icon-button-tokens'
import {
  iconTokenResolver,
  type IconTokenResolver
} from './icon-tokens'
import {
  inputTokenResolver,
  type InputTokenResolver
} from './input-tokens'
import {
  listItemTokenResolvers,
  type ListItemTokenResolvers
} from './list-items'
import {
  multiSelectTokenResolver,
  type MultiSelectTokenResolver
} from './multi-select-tokens'
import {
  pressableTokenResolver,
  type PressableTokenResolver
} from './pressable-tokens'
import {
  searchBarTokenResolver,
  type SearchBarTokenResolver
} from './search-bar-tokens'
import {
  selectTokenResolver,
  type SelectTokenResolver
} from './select-tokens'
import {
  switchTokenResolver,
  type SwitchTokenResolver
} from './switch-tokens'

export type ComponentTokenResolvers = {
  button: ButtonTokenResolver,
  iconButton: IconButtonTokenResolver,
  pressable: PressableTokenResolver,
  chip: ChipTokenResolver,
  checkbox: CheckboxTokenResolver,
  switch: SwitchTokenResolver,
  input: InputTokenResolver,
  searchBar: SearchBarTokenResolver,
  select: SelectTokenResolver,
  multiSelect: MultiSelectTokenResolver,
  card: CardTokenResolver,
  divider: DividerTokenResolver,
  listItem: ListItemTokenResolvers,
  avatar: AvatarTokenResolver,
  avatarWithStatus: AvatarWithStatusTokenResolver,
  avatarGroup: AvatarGroupTokenResolver,
  icon: IconTokenResolver,
  chat: ChatTokenResolvers,
}

export const componentTokenResolvers: ComponentTokenResolvers = {
  button: buttonTokenResolver,
  iconButton: iconButtonTokenResolver,
  pressable: pressableTokenResolver,
  chip: chipTokenResolver,
  checkbox: checkboxTokenResolver,
  switch: switchTokenResolver,
  input: inputTokenResolver,
  searchBar: searchBarTokenResolver,
  select: selectTokenResolver,
  multiSelect: multiSelectTokenResolver,
  card: cardTokenResolver,
  divider: dividerTokenResolver,
  listItem: listItemTokenResolvers,
  avatar: avatarTokenResolver,
  avatarWithStatus: avatarWithStatusTokenResolver,
  avatarGroup: avatarGroupTokenResolver,
  icon: iconTokenResolver,
  chat: chatTokenResolvers,
}
