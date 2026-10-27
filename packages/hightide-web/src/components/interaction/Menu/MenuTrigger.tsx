import type { ReactNode, RefObject } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { useMenuContext } from './MenuContext'

export type MenuTriggerBag<T extends HTMLElement = HTMLButtonElement> = {
  ref: RefObject<T | null>,
  onClick: () => void,
  isOpen: boolean,
  disabled: boolean,
}

export type MenuTriggerProps<T extends HTMLElement = HTMLButtonElement> = {
  children: (bag: MenuTriggerBag<T>) => ReactNode,
}

export function MenuTrigger<T extends HTMLElement = HTMLButtonElement>({
  children,
}: MenuTriggerProps<T>) {
  const { state, dispatch, disabled, setTriggerRef } = useMenuContext()
  const ref = useRef<T>(null)

  useEffect(() => {
    setTriggerRef(ref)
    return () => {
      setTriggerRef(null)
    }
  }, [setTriggerRef])

  const bag = useMemo<MenuTriggerBag<T>>(() => ({
    ref,
    onClick: () => dispatch({ type: 'toggle' }),
    isOpen: state.isOpen,
    disabled,
  }), [disabled, dispatch, ref, state.isOpen])

  return children(bag)
}
