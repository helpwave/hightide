import { ModalBackground } from './ModalBackground'
import { ModalCloseButton } from './ModalCloseButton'
import { ModalComponent } from './ModalComponent'
import { ModalContext } from './ModalContext'
import { ModalMenu } from './ModalMenu'
import { ModalRoot } from './ModalRoot'

const Modal = Object.assign(ModalComponent, {
  Root: ModalRoot,
  Background: ModalBackground,
  Menu: ModalMenu,
  CloseButton: ModalCloseButton,
  Context: ModalContext,
  Provider: ModalContext.Provider,
})

export { Modal }
