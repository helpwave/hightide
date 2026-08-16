import type { ListActionTokenResolver } from './list-action-tokens'
import { listActionTokenResolver } from './list-action-tokens'
import type { ListItemTokenResolver } from './list-item-tokens'
import { listItemTokenResolver } from './list-item-tokens'
import type { ListNavigationTokenResolver } from './list-navigation-tokens'
import { listNavigationTokenResolver } from './list-navigation-tokens'

export type ListItemTokenResolvers = {
  default: ListItemTokenResolver,
  action: ListActionTokenResolver,
  navigation: ListNavigationTokenResolver,
}

export const listItemTokenResolvers: ListItemTokenResolvers = {
  default: listItemTokenResolver,
  action: listActionTokenResolver,
  navigation: listNavigationTokenResolver,
}