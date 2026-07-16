import type { ReactNode } from 'react'
import { forwardRef, type HTMLAttributes } from 'react'
import { Visibility } from '../Visibility'
import { DrawerContainer } from './DrawerContainer'
import { DrawerCloseButton } from './DrawerCloseButton'
import { DrawerRoot } from './DrawerRoot'

export type DrawerAligment = 'left' | 'right' | 'bottom' | 'top'

export type DrawerProps = HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean,
  alignment: DrawerAligment,
  titleElement: ReactNode,
  description: ReactNode,
  headerOverwrite?: ReactNode,
  footer?: ReactNode,
  isAnimated?: boolean,
  containerClassName?: string,
  backgroundClassName?: string,
  onClose: () => void,
  forceMount?: boolean,
  hasDefaultCloseIcon?: boolean,
  noScrolling?: boolean,
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer({
  children,
  isOpen = true,
  alignment = 'left',
  titleElement,
  description,
  headerOverwrite,
  footer,
  containerClassName,
  backgroundClassName,
  onClose,
  forceMount = false,
  hasDefaultCloseIcon = true,
  noScrolling = false,
  ...props
}, forwardedRef) {
  return (
    <DrawerRoot isOpen={isOpen} onIsOpenChange={(open) => !open && onClose()}>
      <DrawerContainer
        ref={forwardedRef}
        alignment={alignment}
        containerClassName={containerClassName}
        backgroundClassName={backgroundClassName}
        forceMount={forceMount}
        {...props}
      >
        <div className="drawer-content" data-no-scrolling={noScrolling ? '' : undefined}>
          <div className="drawer-header">
            {headerOverwrite ? headerOverwrite : (
              <>
                <div className="drawer-title">
                  {titleElement}
                </div>
                <Visibility isVisible={!!description}>
                  <div className="drawer-description">
                    {description}
                  </div>
                </Visibility>
              </>
            )}
          </div>
          <div className="drawer-main-content" data-no-outer-scrolling={noScrolling ? '' : undefined}>
            {children}
          </div>
          {!!footer && (
            <div className="drawer-footer">
              {footer}
            </div>
          )}
        </div>
        {hasDefaultCloseIcon && (
          <div className="drawer-close-button-positioner">
            <DrawerCloseButton />
          </div>
        )}
      </DrawerContainer>
    </DrawerRoot>
  )
})