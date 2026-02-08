import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { usePopUpContext } from './PopUpContext'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import type { RefObject } from 'react'

export interface PopUpOpenerBag<T extends HTMLElement> {
  open: () => void,
  close: () => void,
  isOpen: boolean,
  toggleOpen: () => void,
  props: {
    'id': string,
    'onClick': () => void,
    'aria-haspopup': 'dialog',
    'aria-controls': string,
    'aria-expanded': boolean,
    'ref': RefObject<T>,
  },
}

export interface PopUpOpenerProps<T extends HTMLElement> {
  children: (props: PopUpOpenerBag<T>) => ReactNode,
}

export function PopUpOpener<T extends HTMLElement = HTMLButtonElement>({ children }: PopUpOpenerProps<T>) {
  const context = usePopUpContext()
  const { setTriggerRef } = context
  const ref = useRef<T>(null)

  useEffect(() => {
    setTriggerRef(ref)
    return () => {
      setTriggerRef(null)
    }
  }, [setTriggerRef])

  const bag: PopUpOpenerBag<T> = useMemo<PopUpOpenerBag<T>>(() => ({
    open: () => context.setIsOpen(true),
    close: () => context.setIsOpen(false),
    toggleOpen: () => context.setIsOpen(prev => !prev),
    isOpen: context.isOpen,
    props: {
      'id': context.triggerId,
      'onClick': () => context.setIsOpen(true),
      'aria-haspopup': 'dialog',
      'aria-controls': context.popUpId,
      'aria-expanded': context.isOpen,
      'ref': ref,
    },
  }), [context])

  return BagFunctionUtil.resolve(children, bag)
}
