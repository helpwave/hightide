import type { PropsWithChildren, SetStateAction } from 'react'
import { useCallback } from 'react'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { ModalContext } from './ModalContext'

export interface ModalRootProps extends PropsWithChildren {
  isOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void,
  initialIsOpen?: boolean,
  isClosable?: boolean,
}

export function ModalRoot({
  children,
  isOpen: controlledIsOpen,
  onIsOpenChange,
  initialIsOpen = false,
  isClosable = true,
}: ModalRootProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: controlledIsOpen,
    onValueChange: onIsOpenChange,
    defaultValue: initialIsOpen,
  })
  const setIsOpenGuarded = useCallback((action: SetStateAction<boolean>) => {
    const next = typeof action === 'function' ? action(isOpen) : action
    if (!isClosable && isOpen && !next) {
      return
    }
    setIsOpen(next)
  }, [isClosable, isOpen, setIsOpen])

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen: setIsOpenGuarded, isClosable }}>
      {children}
    </ModalContext.Provider>
  )
}