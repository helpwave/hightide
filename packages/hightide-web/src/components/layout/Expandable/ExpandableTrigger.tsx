import type { ReactNode, RefObject } from 'react'
import { useMemo, useRef } from 'react'
import { BagFunctionUtil } from '@helpwave/hightide-utils/utils'

import { useExpandableContext } from './ExpandableContext'

export interface ExpandableTriggerBag<T extends HTMLElement> {
  isExpanded: boolean,
  disabled: boolean,
  toggle: () => void,
  props: {
    'id': string,
    'onClick': () => void,
    'aria-expanded': boolean,
    'aria-controls': string,
    'aria-disabled': true | undefined,
    'ref': RefObject<T | null>,
  },
}

export interface ExpandableTriggerProps<T extends HTMLElement> {
  children: (bag: ExpandableTriggerBag<T>) => ReactNode,
}

export function ExpandableTrigger<T extends HTMLElement = HTMLButtonElement>({ children }: ExpandableTriggerProps<T>) {
  const { isExpanded, toggle, ids, disabled } = useExpandableContext()
  const ref = useRef<T>(null)

  const bag = useMemo<ExpandableTriggerBag<T>>(() => ({
    isExpanded,
    disabled,
    toggle,
    props: {
      'id': ids.header,
      'onClick': toggle,
      'aria-expanded': isExpanded,
      'aria-controls': ids.content,
      'aria-disabled': disabled || undefined,
      'ref': ref,
    },
  }), [disabled, ids.content, ids.header, isExpanded, toggle])

  return BagFunctionUtil.resolve(children, bag)
}
