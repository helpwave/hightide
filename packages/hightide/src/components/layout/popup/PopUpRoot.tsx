import { useControlledState } from '@/src/hooks/useControlledState'
import type { PropsWithChildren, RefObject } from 'react'
import { useId, useMemo, useState } from 'react'
import { PopUpContext } from './PopUpContext'

export interface PopUpRootProps extends PropsWithChildren {
  isOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void,
  initialIsOpen?: boolean,
  popUpId?: string,
  triggerId?: string,
}

export function PopUpRoot({
  children,
  isOpen: controlledIsOpen,
  onIsOpenChange,
  initialIsOpen = false,
  popUpId: popUpIdOverwrite,
  triggerId: triggerIdOverwrite,
}: PopUpRootProps) {
  const generatedPopUpId = useId()
  const generatedTriggerId = useId()

  const [isOpen, setIsOpen] = useControlledState({
    value: controlledIsOpen,
    onValueChange: onIsOpenChange,
    defaultValue: initialIsOpen,
  })

  const [triggerRef, setTriggerRef] = useState<RefObject<HTMLElement> | null>(null)

  const popUpId = useMemo(() => popUpIdOverwrite ?? `pop-up-${generatedPopUpId}`, [popUpIdOverwrite, generatedPopUpId])
  const triggerId = useMemo(() => triggerIdOverwrite ?? `pop-up-trigger-${generatedTriggerId}`, [triggerIdOverwrite, generatedTriggerId])

  const contextValue = useMemo(() => ({
    isOpen,
    setIsOpen,
    popUpId,
    triggerId,
    triggerRef,
    setTriggerRef,
  }), [isOpen, setIsOpen, popUpId, triggerId, triggerRef])


  return (
    <PopUpContext.Provider value={contextValue}>
      {children}
    </PopUpContext.Provider>
  )
}
