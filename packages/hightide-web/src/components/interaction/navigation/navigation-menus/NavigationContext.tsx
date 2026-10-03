import type { TreeItem } from '@helpwave/hightide-utils/hooks'
import { TreeUtilities } from '@helpwave/hightide-utils/hooks'
import type { TreeExpansionOptions } from '@helpwave/hightide-utils/hooks'
import { useTreeExpansion } from '@helpwave/hightide-utils/hooks'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'


export interface NavigationItemState {
  expanded: boolean,
  isActive: boolean,
  isOnActivePath: boolean,
  path: ReadonlyArray<string>,
}

export interface NavigationContextActions {
  toggleExpansion: ReturnType<typeof useTreeExpansion>['toggleExpansion'],
}

export interface NavigationContextType extends NavigationContextActions {
  activeId: string | null,
  activePath: ReadonlyArray<string> | null,
  allItems: ReadonlyArray<TreeItem>,
  getItemState: (id: string) => NavigationItemState | null,
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export interface NavigationProviderProps extends TreeExpansionOptions {
  children: ReactNode,
  activeId?: string | null,
}

export function NavigationProvider({
  children,
  activeId = null,
  nodes,
  ...expansionOptions
}: NavigationProviderProps) {
  const expansion = useTreeExpansion({ nodes, ...expansionOptions })

  const index = useMemo(() => TreeUtilities.buildTreeIndex(nodes), [nodes])
  const activePath = useMemo(() => {
    if (activeId == null) return null
    return index.byId.get(activeId)?.path ?? null
  }, [activeId, index])

  const [hasExpandedForActiveId, setHasExpandedForActiveId] = useState(false)
  const { allItems, expandForPath } = expansion

  useEffect(() => {
    if (activeId == null || hasExpandedForActiveId || activePath == null) return
    const navigationItem = allItems.find((item) => item.id === activeId)
    if (navigationItem == null) return
    expandForPath(activePath)
    setHasExpandedForActiveId(true)
  }, [activeId, activePath, allItems, expandForPath, hasExpandedForActiveId])

  const itemStateById = useMemo(() => {
    const map = new Map<string, NavigationItemState>()

    for (const item of expansion.allItems) {
      map.set(item.id, {
        expanded: item.expanded,
        isActive: activeId === item.id,
        isOnActivePath: activePath?.includes(item.id) ?? false,
        path: item.path,
      })
    }

    return map
  }, [expansion.allItems, activeId, activePath])

  const getItemState = useCallback((id: string) => {
    return itemStateById.get(id) ?? null
  }, [itemStateById])

  const value = useMemo((): NavigationContextType => ({
    activeId,
    activePath,
    allItems: expansion.allItems,
    getItemState,
    toggleExpansion: expansion.toggleExpansion,
  }), [
    activeId,
    activePath,
    expansion.allItems,
    expansion.toggleExpansion,
    getItemState,
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

  return useMemo(() => ({
    ...state,
    toggleExpansion: context.toggleExpansion,
  }), [state, context.toggleExpansion])
}
