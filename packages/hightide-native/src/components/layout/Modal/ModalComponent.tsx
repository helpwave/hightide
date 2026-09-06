import type { ReactNode } from 'react'

import type { ModalBackgroundProps } from './ModalBackground'
import { ModalBackground } from './ModalBackground'
import { ModalCloseButton, type ModalCloseButtonProps } from './ModalCloseButton'
import { ModalMenu, type ModalMenuProps } from './ModalMenu'
import type { ModalRootProps } from './ModalRoot'
import { ModalRoot } from './ModalRoot'

export type ModalProps = Omit<ModalRootProps, 'children'> & {
  children?: ReactNode,
  backgroundProps?: Omit<ModalBackgroundProps, 'children'>,
  menuProps?: Omit<ModalMenuProps, 'children'>,
  closeButtonProps?: ModalCloseButtonProps,
  showCloseButton?: boolean,
}

export const ModalComponent = ({
  children,
  backgroundProps,
  menuProps,
  closeButtonProps,
  showCloseButton = true,
  ...props
}: ModalProps) => {
  return (
    <ModalRoot {...props}>
      <ModalBackground {...backgroundProps}>
        <ModalMenu {...menuProps}>
          {showCloseButton && <ModalCloseButton {...closeButtonProps} />}
          {children}
        </ModalMenu>
      </ModalBackground>
    </ModalRoot>
  )
}
