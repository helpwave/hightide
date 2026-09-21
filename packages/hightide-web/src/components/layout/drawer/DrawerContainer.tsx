import { forwardRef, useId, useMemo, useRef, type HTMLAttributes } from 'react'
import { useFocusTrap } from '../../../hooks/focus/useFocusTrap'
import { useOverlayRegistry } from '@helpwave/hightide-utils/hooks'
import { useTransitionState } from '../../../hooks/useTransitionState'
import { PropsUtil } from '../../../utils/propsUtil'
import { Portal } from '../../utils/Portal'
import { useDrawerContext } from './DrawerContext'
import type { DrawerAligment } from './Drawer'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import clsx from 'clsx'

export type DrawerContainerProps = HTMLAttributes<HTMLDivElement> & {
  alignment: DrawerAligment,
  containerClassName?: string,
  backgroundClassName?: string,
  forceMount?: boolean,
}

export const DrawerContainer = forwardRef<HTMLDivElement, DrawerContainerProps>(function DrawerContent({
  children,
  alignment = 'left',
  containerClassName,
  backgroundClassName,
  forceMount = false,
  ...props
}, forwardedRef) {
  const { isOpen } = useDrawerContext()
  const generatedId = useId()
  const ids = useMemo(() => ({
    screenCover: `drawer-screen-cover-${generatedId}`,
    background: `drawer-background-${generatedId}`,
    container: props.id ?? `drawer-container-${generatedId}`
  }), [generatedId, props.id])

  const ref = useRef<HTMLDivElement>(null)

  const { isVisible, transitionState } = useTransitionState({ isOpen, ref })

  useFocusTrap({
    container: ref,
    active: isVisible,
  })

  const { zIndex, tagPositions, tagItemCounts } = useOverlayRegistry({
    isActive: isVisible,
    tags: useMemo(() => ['drawer'], [])
  })
  const depth = tagPositions && tagItemCounts ? ((tagItemCounts['drawer'] ?? 0) - (tagPositions['drawer'] ?? 0)) : 0
  const { setOpen } = useDrawerContext()

  if (!isVisible && !forceMount) return null

  return (
    <Portal>
      <div
        id={ids.screenCover}
        className={clsx('drawer-screen-cover', containerClassName)}
        data-open={PropsUtil.dataAttributes.bool(isOpen)}
        hidden={!isVisible && forceMount}
        style={{ zIndex, '--drawer-depth': depth.toString() } as React.CSSProperties}
      >
        <div
          id={ids.background}
          onClick={() => setOpen(false)}
          className={backgroundClassName}
          data-name="drawer-background"
          data-state={transitionState}
          data-depth={depth}
          data-alignment={alignment}
          aria-hidden={true}
        />
        <div
          {...props}
          id={ids.container}
          ref={ReactUtils.assingRefsBuilder([ref, forwardedRef])}
          onKeyDown={PropsUtil.aria.close(() => setOpen(false))}
          className="drawer-container"
          data-state={transitionState}
          data-depth={depth}
          data-alignment={alignment}
        >
          {children}
        </div>
      </div>
    </Portal>
  )
})


