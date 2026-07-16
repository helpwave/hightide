import { useControlledState } from '@/src/hooks/useControlledState'
import type { PropsWithChildren } from 'react'
import { DrawerContext } from './DrawerContext'

export interface DrawerRootProps extends PropsWithChildren {
  isOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void,
  initialIsOpen?: boolean,
}

export function DrawerRoot({
  children,
  isOpen: controlledIsOpen,
  onIsOpenChange,
  initialIsOpen = false,
}: DrawerRootProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: controlledIsOpen,
    onValueChange: onIsOpenChange,
    defaultValue: initialIsOpen,
  })

  return (
    <DrawerContext.Provider value={{ isOpen, setOpen: setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}


