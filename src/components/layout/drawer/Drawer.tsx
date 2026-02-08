import type { ReactNode } from 'react'
import { forwardRef, type HTMLAttributes } from 'react'
import { Visibility } from '../Visibility'
import { DrawerContent } from './DrawerContent'
import { DrawerCloseButton } from './DrawerCloseButton'
import { DrawerRoot } from './DrawerRoot'

export type DrawerAligment = 'left' | 'right' | 'bottom' | 'top'

export type DrawerProps = HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean,
  alignment: DrawerAligment,
  titleElement: ReactNode,
  description: ReactNode,
  isAnimated?: boolean,
  containerClassName?: string,
  backgroundClassName?: string,
  onClose: () => void,
  forceMount?: boolean,
  hasDefaultCloseIcon?: boolean,
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer({
  children,
  isOpen = true,
  alignment = 'left',
  titleElement,
  description,
  containerClassName,
  backgroundClassName,
  onClose,
  forceMount = false,
  hasDefaultCloseIcon = true,
  ...props
}, forwardedRef) {
  return (
    <DrawerRoot isOpen={isOpen} onIsOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        ref={forwardedRef}
        alignment={alignment}
        containerClassName={containerClassName}
        backgroundClassName={backgroundClassName}
        forceMount={forceMount}
        {...props}
      >
        <div className="typography-title-lg mr-8">
          {titleElement}
        </div>
        <Visibility isVisible={!!description}>
          <div className="text-description">
            {description}
          </div>
        </Visibility>
        {hasDefaultCloseIcon && (
          <div
            className="absolute top-0 right-0"
            style={{
              paddingTop: 'inherit',
              paddingRight: 'inherit'
            }}
          >
            <DrawerCloseButton />
          </div>
        )}
        {children}
      </DrawerContent>
    </DrawerRoot>
  )
})