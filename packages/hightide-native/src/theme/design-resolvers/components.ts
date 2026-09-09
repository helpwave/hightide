import type {
  ComponentTokenResolvers,
  ListItemTokenResolvers
} from '@helpwave/hightide-design/component-tokens'
import { avatarGroupTokenResolver, avatarTokenResolver, avatarWithStatusTokenResolver } from './avatar'
import { buttonTokenResolver } from './button'
import { cardTokenResolver } from './card'
import { chatTokenResolvers } from './chat'
import { checkboxTokenResolver } from './checkbox'
import { chipTokenResolver } from './chip'
import { dividerTokenResolver } from './divider'
import { iconTokenResolver } from './icon'
import { iconButtonTokenResolver } from './icon-button'
import { inputTokenResolver } from './input'
import { listActionTokenResolver, listNavigationTokenResolver } from './list-action'
import { listItemTokenResolver } from './list-item'
import { modalTokenResolver } from './modal'
import { multiSelectTokenResolver } from './multi-select'
import { pressableTokenResolver } from './pressable'
import { searchBarTokenResolver } from './search-bar'
import { selectTokenResolver } from './select'
import { switchTokenResolver } from './switch'
import { textareaTokenResolver } from './textarea'

export const listItemTokenResolvers: ListItemTokenResolvers = {
  default: listItemTokenResolver,
  action: listActionTokenResolver,
  navigation: listNavigationTokenResolver,
}

export const componentTokenResolvers: ComponentTokenResolvers = {
  button: buttonTokenResolver,
  iconButton: iconButtonTokenResolver,
  pressable: pressableTokenResolver,
  chip: chipTokenResolver,
  checkbox: checkboxTokenResolver,
  switch: switchTokenResolver,
  input: inputTokenResolver,
  textarea: textareaTokenResolver,
  searchBar: searchBarTokenResolver,
  select: selectTokenResolver,
  multiSelect: multiSelectTokenResolver,
  card: cardTokenResolver,
  divider: dividerTokenResolver,
  listItem: listItemTokenResolvers,
  modal: modalTokenResolver,
  avatar: avatarTokenResolver,
  avatarWithStatus: avatarWithStatusTokenResolver,
  avatarGroup: avatarGroupTokenResolver,
  icon: iconTokenResolver,
  chat: chatTokenResolvers,
}
