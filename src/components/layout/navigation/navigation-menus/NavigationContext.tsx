import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import {
  type TreeItem,
  type TreeNavigationOptions,
  type TreeNavigationReturn,
  useTreeNavigation
} from '@/src/hooks/useTreeNavigation'

export interface NavigationItemState {
  expanded: boolean,
  isFocused: boolean,
  path: ReadonlyArray<string>,
}

export interface NavigationContextActions {
  navigateTo: TreeNavigationReturn['navigateTo'],
  expand: TreeNavigationReturn['expand'],
  collapse: TreeNavigationReturn['collapse'],
  next: TreeNavigationReturn['next'],
  previous: TreeNavigationReturn['previous'],
  first: TreeNavigationReturn['first'],
  last: TreeNavigationReturn['last'],
  toggleExpansion: TreeNavigationReturn['toggleExpansion'],
  registerItemRef: (id: string, element: HTMLElement | null) => void,
}

export interface NavigationContextType extends NavigationContextActions {
  activeItem: TreeItem | null,
  focusedId: string | null,
  items: ReadonlyArray<TreeItem>,
  getItemState: (id: string) => NavigationItemState | null,
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export type NavigationProviderProps = PropsWithChildren<TreeNavigationOptions>

export function NavigationProvider({
  children,
  ...options
}: NavigationProviderProps) {
  const navigation = useTreeNavigation(options)
  const itemRefs = useRef(new Map<string, HTMLElement>())

  const focusedId = navigation.activeItem?.id ?? navigation.items[0]?.id ?? null

  const itemStateById = useMemo(() => {
    const map = new Map<string, NavigationItemState>()

    for (const item of navigation.items) {
      map.set(item.id, {
        expanded: item.expanded,
        isFocused: focusedId === item.id,
        path: item.path,
      })
    }

    return map
  }, [navigation.items, focusedId])

  const getItemState = useCallback((id: string) => {
    return itemStateById.get(id) ?? null
  }, [itemStateById])

  const registerItemRef = useCallback((id: string, element: HTMLElement | null) => {
    if (element == null) {
      itemRefs.current.delete(id)
      return
    }
    itemRefs.current.set(id, element)
  }, [])

  useEffect(() => {
    if (focusedId == null) return
    itemRefs.current.get(focusedId)?.focus()
  }, [focusedId])

  const value = useMemo((): NavigationContextType => ({
    activeItem: navigation.activeItem,
    focusedId,
    items: navigation.items,
    getItemState,
    navigateTo: navigation.navigateTo,
    expand: navigation.expand,
    collapse: navigation.collapse,
    next: navigation.next,
    previous: navigation.previous,
    first: navigation.first,
    last: navigation.last,
    toggleExpansion: navigation.toggleExpansion,
    registerItemRef,
  }), [
    navigation.activeItem,
    navigation.items,
    navigation.navigateTo,
    navigation.expand,
    navigation.collapse,
    navigation.next,
    navigation.previous,
    navigation.first,
    navigation.last,
    navigation.toggleExpansion,
    focusedId,
    getItemState,
    registerItemRef,
  ])

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigationContext(): NavigationContextType {
  const context = useContext(NavigationContext)
  if (context == null) {
    throw new Error('useNavigationContext must be used within NavigationProvider')
  }
  return context
}

export function useNavigationItem(id: string) {
  const context = useNavigationContext()
  const state = context.getItemState(id)

  if (state == null) {
    throw new Error(`useNavigationItem could not resolve state for id "${id}"`)
  }

  const ref = useCallback((element: HTMLLIElement | null) => {
    context.registerItemRef(id, element)
  }, [context, id])

  return useMemo(() => ({
    ...state,
    ref,
    navigateTo: context.navigateTo,
    expand: context.expand,
    collapse: context.collapse,
    next: context.next,
    previous: context.previous,
    first: context.first,
    last: context.last,
    toggleExpansion: context.toggleExpansion,
  }), [
    state,
    ref,
    context.navigateTo,
    context.expand,
    context.collapse,
    context.next,
    context.previous,
    context.first,
    context.last,
    context.toggleExpansion,
  ])
}
