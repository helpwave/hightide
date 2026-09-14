import type { ListActionTokenResolver } from './list-action-tokens'
import type { ListItemTokenResolver } from './list-item-tokens'
import type { ListNavigationTokenResolver } from './list-navigation-tokens'

export type ListItemTokenResolvers = {
  default: ListItemTokenResolver,
  action: ListActionTokenResolver,
  navigation: ListNavigationTokenResolver,
}
