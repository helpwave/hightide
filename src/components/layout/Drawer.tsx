import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { ReactNode } from 'react'
import { forwardRef, useId, useImperativeHandle, useMemo, useRef, type HTMLAttributes } from 'react'
import { Visibility } from './Visibility'
import { X } from 'lucide-react'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import { PropsUtil } from '@/src/utils/propsUtil'
import { Portal } from '../utils/Portal'
import { IconButton } from '../user-interaction/IconButton'

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
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
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
    focusFirst: true,
  })

  const { zIndex, tagPositions, tagItemCounts } = useOverlayRegistry({
    isActive: isVisible,
    tags: useMemo(() => ['drawer'], [])
  })
  const depth = tagPositions && tagItemCounts ? ((tagItemCounts['drawer'] ?? 0) - (tagPositions['drawer'] ?? 0)) : 0

  if (!isVisible && !forceMount) return

  return (
    <Portal>
      <div
        id={ids.container}

        data-name="drawer-container"
        data-open={PropsUtil.dataAttributes.bool(isOpen)}

        hidden={!isVisible && forceMount}

        className={containerClassName}
        style={{ zIndex, '--drawer-depth': depth.toString() } as React.CSSProperties}
      >
        <div
          id={ids.background}

          onClick={onClose}

          data-name="drawer-background"
          data-state={transitionState}
          data-depth={depth}
          data-alignment={alignment}

          aria-hidden={true}

          className={backgroundClassName}
        />
        <div
          {...props}
          id={ids.content}
          ref={ref}

          onKeyDown={PropsUtil.aria.close(close)}

          data-name={PropsUtil.dataAttributes.name('drawer-content', props)}
          data-state={transitionState}
          data-depth={depth}
          data-alignment={alignment}

          className={props.className}
        >
          <div className="typography-title-lg mr-8">
            {titleElement}
          </div>
          <Visibility isVisible={!!description}>
            <div className="text-description">
              {description}
            </div>
          </Visibility>
          <div
            className="absolute top-0 right-0"
            style={{
              paddingTop: 'inherit',
              paddingRight: 'inherit'
            }}
          >
            <IconButton
              tooltip={translation('close')}
              coloringStyle="text"
              color="neutral"
              onClick={onClose}
            >
              <X size={24}/>
            </IconButton>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  )
})