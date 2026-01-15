import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { ReactNode } from 'react'
import { forwardRef, useId, useImperativeHandle, useMemo, useRef, type HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { Visibility } from './Visibility'
import { Button } from '../user-interaction/Button'
import { X } from 'lucide-react'
import { useTransitionState } from '@/src/hooks/useTransitionState'
import { PropsUtil } from '@/src/utils/propsUtil'

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

  const { isVisible, transitionState, callbacks } = useTransitionState({ isOpen })

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

  if (!isVisible) return

  return createPortal(
    <div
      id={ids.container}

      data-name="drawer-container"
      data-open={PropsUtil.dataAttributes.bool(isOpen)}

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
        {...callbacks}

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
          <Button
            layout="icon"
            color="neutral"
            size="xs"
            aria-label={translation('close')}
            onClick={onClose}
          >
            <X />
          </Button>
        </div>
        {children}
      </div>
    </div>
    , document.body
  )
})