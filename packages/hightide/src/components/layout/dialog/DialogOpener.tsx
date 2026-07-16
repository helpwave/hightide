import { useMemo, type ReactNode } from 'react'
import { useDialogContext } from './DialogContext'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'

export interface DialogOpenerWrapperBag {
    open: () => void,
    close: () => void,
    isOpen: boolean,
    toggleOpen: () => void,
    props: {
        'onClick': () => void,
        'aria-haspopup': 'dialog',
    },
}

export interface DialogOpenerWrapperProps {
    children: (props: DialogOpenerWrapperBag) => ReactNode,
}

export function DialogOpenerWrapper({ children }: DialogOpenerWrapperProps) {
  const context = useDialogContext()

  const bag: DialogOpenerWrapperBag = useMemo<DialogOpenerWrapperBag>(() => ({
    open: () => context.setIsOpen(true),
    close: () => context.setIsOpen(false),
    toggleOpen: () => context.setIsOpen(prev => !prev),
    isOpen: context.isOpen,
    props: {
      'onClick': () => context.setIsOpen(true),
      'aria-haspopup': 'dialog',
    },
  }), [context])

  return BagFunctionUtil.resolve(children, bag)
}


export interface DialogOpenerPassingProps {
  'children'?: React.ReactNode,
  'onClick'?: React.MouseEventHandler<HTMLButtonElement>,
  'aria-haspopup'?: 'dialog',
}
