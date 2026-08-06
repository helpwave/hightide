import {
  listActionTokenResolver,
  type ListActionComponentResolverProps,
  type ListActionItemState,
  type ListActionTokenResolver
} from './list-action-tokens'

export type ListNavigationItemState = ListActionItemState

export type ListNavigationComponentResolverProps = ListActionComponentResolverProps

export type ListNavigationTokenResolver = ListActionTokenResolver

export const listNavigationTokenResolver: ListNavigationTokenResolver = listActionTokenResolver
