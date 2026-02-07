import { forwardRef, useId, useImperativeHandle, useMemo, useRef, type HTMLAttributes } from 'react'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import { PropsUtil } from '@/src/utils/propsUtil'
import { Portal } from '../../utils/Portal'
import { useDrawerContext } from './DrawerContext'
import type { DrawerAligment } from './Drawer'

export type DrawerContentProps = HTMLAttributes<HTMLDivElement> & {
  alignment: DrawerAligment,
  containerClassName?: string,
  backgroundClassName?: string,
  forceMount?: boolean,
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent({
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
    container: `dialog-container-${generatedId}`,
    background: `dialog-background-${generatedId}`,
    content: props.id ?? `dialog-content-${generatedId}`
  }), [generatedId, props.id])

  const ref = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardedRef, () => ref.current, [ref])

  const { isVisible, transitionState } = useTransitionState({ isOpen, ref })

  useFocusTrap({
    container: ref,
    active: isVisible,
    focusFirst: false,
  })

  const { zIndex, tagPositions, tagItemCounts } = useOverlayRegistry({
    isActive: isVisible,
    tags: useMemo(() => ['drawer'], [])
  })
  const depth = tagPositions && tagItemCounts ? ((tagItemCounts['drawer'] ?? 0) - (tagPositions['drawer'] ?? 0)) : 0
  console.log('depth', depth)
  const { setOpen } = useDrawerContext()

  if (!isVisible && !forceMount) return null

  return (
    <Portal>
      <div
        id={ids.container}
        data-name="drawer-container"
        className={containerClassName}
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
          id={ids.content}
          ref={ref}
          onKeyDown={PropsUtil.aria.close(() => setOpen(false))}
          data-name={props['data-name'] ?? 'drawer-content'}
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


