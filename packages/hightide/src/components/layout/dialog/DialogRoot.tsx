import { useControlledState } from '@/src/hooks/useControlledState'
import type { PropsWithChildren } from 'react'
import { DialogContext } from './DialogContext'

export interface DialogRootProps extends PropsWithChildren {
    isOpen?: boolean,
    onIsOpenChange?: (isOpen: boolean) => void,
    initialIsOpen?: boolean,
    isModal?: boolean,
}

export function DialogRoot({
  children,
  isOpen: controlledIsOpen,
  onIsOpenChange,
  initialIsOpen = false,
  isModal = true,
}: DialogRootProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: controlledIsOpen,
    onValueChange: onIsOpenChange,
    defaultValue: initialIsOpen,
  })

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen, isModal }}>
      {children}
    </DialogContext.Provider>
  )
}