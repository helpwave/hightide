import type { PropsWithChildren } from 'react'

import { useControlledState } from '@helpwave/hightide-utils/hooks'

import { ModalContext } from './ModalContext'

export type ModalRootProps = PropsWithChildren<{
  isOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void,
  initialIsOpen?: boolean,
}>

export function ModalRoot({
  children,
  isOpen: controlledIsOpen,
  onIsOpenChange,
  initialIsOpen = false,
}: ModalRootProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: controlledIsOpen,
    onValueChange: onIsOpenChange,
    defaultValue: initialIsOpen,
  })

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  )
}
