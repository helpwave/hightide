import clsx from 'clsx'
import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { IconButton } from '../../user-interaction'
import { useHightideTranslation } from '@/src/i18n'
import { MenuIcon, X } from 'lucide-react'
import { useOverlayRegistry } from '@/src/hooks'
import { PropsUtil } from '@/src/utils/propsUtil'


export interface AppSidebarProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean,
  onClose?: () => void,
}

export const AppSidebar = ({ isOpen, onClose, children, ...props }: AppSidebarProps) => {
  const translation = useHightideTranslation()
  const { zIndex } = useOverlayRegistry({ isActive: isOpen })

  return (
    <>
      {isOpen && (
        <div
          data-name="app-sidebar-backdrop"
          onClick={onClose}
          role="presentation"
        />
      )}
      <div
        data-name="app-sidebar-container"
        data-open={PropsUtil.dataAttributes.bool(isOpen)}
        style={{ zIndex }}
      >
        <aside
          {...props}
          data-name="app-sidebar-content"
          data-open={PropsUtil.dataAttributes.bool(isOpen)}
          className={clsx(props.className)}
        >
          <IconButton
            className="app-sidebar-close-button"
            tooltip={translation('close')}
            onClick={onClose}
            coloringStyle="text"
            color="neutral"
            size="sm"
          >
            <X className="size-4" />
          </IconButton>
          {children}
        </aside>
      </div>
    </>
  )
}


export interface AppPageProps extends HTMLAttributes<HTMLDivElement> {
  headerActions?: ReactNode[],
  sidebar?: ReactNode,
}

export const AppPage = ({ children, headerActions, sidebar, ...props }: AppPageProps) => {
  const translation = useHightideTranslation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div
      {...props}
      data-name="app-page"
      className={clsx(props.className)}
    >
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        {sidebar}
      </AppSidebar>
      <div data-name="app-page-content">
        <header data-name="app-page-header">
          <IconButton
            className="app-page-menu-button"
            tooltip={translation('menu')}
            onClick={() => setIsSidebarOpen(prev => !prev)}
            coloringStyle="text"
          >
            <MenuIcon />
          </IconButton>
          {headerActions}
        </header>
        <main data-name="app-page-main">
          {children}
          <div data-name="app-page-main-spacer" />
        </main>
      </div>
    </div>
  )
}
