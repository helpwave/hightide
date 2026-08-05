import {
  avatarTokenResolver,
  type AvatarTokenResolver
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
  multiSelectTokenResolver,
  type MultiSelectTokenResolver
} from './multi-select-tokens'
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
  chip: ChipTokenResolver,
  checkbox: CheckboxTokenResolver,
  switch: SwitchTokenResolver,
  input: InputTokenResolver,
  select: SelectTokenResolver,
  multiSelect: MultiSelectTokenResolver,
  card: CardTokenResolver,
  avatar: AvatarTokenResolver,
  icon: IconTokenResolver,
  chat: ChatTokenResolvers,
}

export const componentTokenResolvers: ComponentTokenResolvers = {
  button: buttonTokenResolver,
  iconButton: iconButtonTokenResolver,
  chip: chipTokenResolver,
  checkbox: checkboxTokenResolver,
  switch: switchTokenResolver,
  input: inputTokenResolver,
  select: selectTokenResolver,
  multiSelect: multiSelectTokenResolver,
  card: cardTokenResolver,
  avatar: avatarTokenResolver,
  icon: iconTokenResolver,
  chat: chatTokenResolvers,
}
