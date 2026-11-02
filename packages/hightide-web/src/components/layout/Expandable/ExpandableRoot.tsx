import type { ReactNode } from 'react'
import { useCallback, useId, useMemo, useState } from 'react'
import { useControlledState } from '@helpwave/hightide-utils/hooks'

import { ExpandableContextProvider } from './ExpandableContext'
import type { ExpandableContextIdsState } from './ExpandableContext'

export type ExpandableRootProps = {
  children: ReactNode,
  id?: string,
  isExpanded?: boolean,
  onExpandedChange?: (isExpanded: boolean) => void,
  isInitialExpanded?: boolean,
  disabled?: boolean,
}

export function ExpandableRoot({
  children,
  id: providedId,
  isExpanded: controlledExpanded,
  onExpandedChange,
  isInitialExpanded = false,
  disabled = false,
}: ExpandableRootProps) {
  const generatedId = useId()
  const [ids, setIds] = useState<ExpandableContextIdsState>({
    root: providedId ?? `expandable-${generatedId}-root`,
    header: `expandable-${generatedId}-header`,
    content: `expandable-${generatedId}-content`,
  })
  const [isExpanded, setIsExpanded] = useControlledState({
    value: controlledExpanded,
    onValueChange: onExpandedChange,
    defaultValue: isInitialExpanded,
  })

  const toggle = useCallback(() => {
    if (!disabled) {
      setIsExpanded(!isExpanded)
    }
  }, [disabled, isExpanded, setIsExpanded])

  const contextValue = useMemo(() => ({
    isExpanded,
    toggle,
    setIsExpanded,
    ids,
    setIds,
    disabled,
  }), [isExpanded, toggle, setIsExpanded, ids, disabled])

  return (
    <ExpandableContextProvider value={contextValue}>
      {children}
    </ExpandableContextProvider>
  )
}
