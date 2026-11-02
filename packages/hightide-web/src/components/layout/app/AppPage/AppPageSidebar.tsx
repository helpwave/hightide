import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef, useRef } from 'react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { useOverlayRegistry } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { X } from 'lucide-react'
import { FocusTrap } from '../../../interaction/FocusTrap'
import { IconButton } from '../../../interaction/IconButton'
import { Icon } from '../../../visualization/Icon'
import { PropsUtil } from '../../../../utils/propsUtil'

export type AppSidebarProps = HTMLAttributes<HTMLElement> & {
  isOpen?: boolean,
  onClose?: () => void,
}

export const AppPageSidebar = forwardRef<HTMLElement, AppSidebarProps>(
  function AppPageSidebar({ isOpen = false, onClose, children, className, ...props }, forwardedRef) {
    const translation = useHightideTranslation()
    const { zIndex } = useOverlayRegistry({ isActive: isOpen })
    const asideRef = useRef<HTMLElement>(null)

    return (
      <>
        {isOpen && (
          <div
            className="app-sidebar-backdrop"
            onClick={onClose}
            role="presentation"
          />
        )}
        <div
          className="app-sidebar-container"
          data-open={PropsUtil.dataAttributes.bool(isOpen)}
          style={{ zIndex }}
        >
          <FocusTrap
            active={isOpen}
            container={asideRef}
          >
            <aside
              {...props}
              ref={ReactUtils.assingRefsBuilder([asideRef, forwardedRef])}
              data-open={PropsUtil.dataAttributes.bool(isOpen)}
              className={clsx('app-sidebar-content', className)}
            >
              <IconButton
                className="app-sidebar-close-button"
                tooltip={translation('close')}
                onClick={onClose}
                variant="foreground"
                color="neutral"
              >
                <Icon icon={X}/>
              </IconButton>
              {children}
            </aside>
          </FocusTrap>
        </div>
      </>
    )
  }
)
