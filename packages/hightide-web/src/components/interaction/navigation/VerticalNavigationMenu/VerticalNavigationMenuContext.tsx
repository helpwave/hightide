import type { TreeExpansionOptions, TreeItem } from '@helpwave/hightide-utils/hooks'
import { TreeUtilities, useTreeExpansion } from '@helpwave/hightide-utils/hooks'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export interface VerticalNavigationMenuItemState {
  expanded: boolean,
  isActive: boolean,
  isOnActivePath: boolean,
  path: ReadonlyArray<string>,
}

export interface VerticalNavigationMenuContextActions {
  toggleExpansion: ReturnType<typeof useTreeExpansion>['toggleExpansion'],
}

export interface VerticalNavigationMenuContextValue extends VerticalNavigationMenuContextActions {
  activeId: string | null,
  activePath: ReadonlyArray<string> | null,
  allItems: ReadonlyArray<TreeItem>,
  getItemState: (id: string) => VerticalNavigationMenuItemState | null,
}

export const VerticalNavigationMenuContext = createContext<VerticalNavigationMenuContextValue | null>(null)

export interface VerticalNavigationMenuProviderProps extends TreeExpansionOptions {
  children: ReactNode,
  activeId?: string | null,
}

export function VerticalNavigationMenuProvider({
  children,
  activeId = null,
  nodes,
  ...expansionOptions
}: VerticalNavigationMenuProviderProps) {
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
    const map = new Map<string, VerticalNavigationMenuItemState>()

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

  const value = useMemo((): VerticalNavigationMenuContextValue => ({
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
    <VerticalNavigationMenuContext.Provider value={value}>
      {children}
    </VerticalNavigationMenuContext.Provider>
  )
}

export function useVerticalNavigationMenuContext(): VerticalNavigationMenuContextValue {
  const context = useContext(VerticalNavigationMenuContext)
  if (context == null) {
    throw new Error('useVerticalNavigationMenuContext must be used inside a VerticalNavigationMenu.Provider')
  }
  return context
}

export function useVerticalNavigationMenuItem(id: string) {
  const context = useVerticalNavigationMenuContext()
  const state = context.getItemState(id)

  if (state == null) {
    throw new Error(`useVerticalNavigationMenuItem could not resolve state for id "${id}"`)
  }

  return useMemo(() => ({
    ...state,
    toggleExpansion: context.toggleExpansion,
  }), [state, context.toggleExpansion])
}
