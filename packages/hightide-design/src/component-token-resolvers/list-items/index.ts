export * from './list-item-tokens'
export * from './list-action-tokens'
export * from './list-navigation-tokens'

import {
  listItemTokenResolver,
  type ListItemTokenResolver
} from './list-item-tokens'
import {
  listActionTokenResolver,
  type ListActionTokenResolver
} from './list-action-tokens'
import {
  listNavigationTokenResolver,
  type ListNavigationTokenResolver
} from './list-navigation-tokens'

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
