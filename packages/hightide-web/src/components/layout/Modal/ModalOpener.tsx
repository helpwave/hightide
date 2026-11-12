import { useMemo, type ReactNode } from 'react'
import { BagFunctionUtil } from '@helpwave/hightide-utils/utils'

import { useModalContext } from './ModalContext'

export interface ModalOpenerBag {
  open: () => void,
  close: () => void,
  isOpen: boolean,
  toggleOpen: () => void,
  props: {
    'onClick': () => void,
    'aria-haspopup': 'dialog',
  },
}

export interface ModalOpenerProps {
  children: (props: ModalOpenerBag) => ReactNode,
}

export function ModalOpener({ children }: ModalOpenerProps) {
  const context = useModalContext()

  const bag: ModalOpenerBag = useMemo<ModalOpenerBag>(() => ({
    open: () => context.dispatch({ type: 'open' }),
    close: () => context.close(),
    toggleOpen: () => context.dispatch({ type: 'toggle' }),
    isOpen: context.state.isOpen,
    props: {
      'onClick': () => context.dispatch({ type: 'open' }),
      'aria-haspopup': 'dialog',
    },
  }), [context])

  return BagFunctionUtil.resolve(children, bag)
}

export interface ModalOpenerPassingProps {
  'children'?: React.ReactNode,
  'onClick'?: React.MouseEventHandler<HTMLButtonElement>,
  'aria-haspopup'?: 'dialog',
}
