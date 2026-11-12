import { useMemo, type ReactNode, type RefObject } from 'react'
import { usePopUpContext } from './PopUpContext'
import { BagFunctionUtil } from '@helpwave/hightide-utils/utils'

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
    'ref': RefObject<T | null>,
  },
}

export interface PopUpOpenerProps<T extends HTMLElement> {
  children: (props: PopUpOpenerBag<T>) => ReactNode,
}

export function PopUpOpener<T extends HTMLElement = HTMLButtonElement>({ children }: PopUpOpenerProps<T>) {
  const context = usePopUpContext()

  const bag: PopUpOpenerBag<T> = useMemo<PopUpOpenerBag<T>>(() => ({
    open: () => context.dispatch({ type: 'open' }),
    close: () => context.dispatch({ type: 'close' }),
    toggleOpen: () => context.dispatch({ type: 'toggle' }),
    isOpen: context.state.isOpen,
    props: {
      'id': context.triggerId,
      'onClick': () => context.dispatch({ type: 'open' }),
      'aria-haspopup': 'dialog',
      'aria-controls': context.popUpId,
      'aria-expanded': context.state.isOpen,
      'ref': context.triggerRef as RefObject<T | null>,
    },
  }), [context])

  return BagFunctionUtil.resolve(children, bag)
}
