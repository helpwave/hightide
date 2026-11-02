import type { HTMLAttributes, ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import { PropsUtil } from '../../../utils'
import { Visibility } from '../Visibility'
import { useTabSwitcherContext } from './TabSwitcherContext'

export type TabSwitcherTabPanelProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode,
  forceMount?: boolean,
  disabled?: boolean,
  initiallyActive?: boolean,
}

export function TabSwitcherTabPanel({
  label,
  forceMount = false,
  disabled = false,
  initiallyActive = false,
  children,
  ...props
}: TabSwitcherTabPanelProps) {
  const { dispatch, tabs } = useTabSwitcherContext()
  const { subscribe, unsubscribe, activeId } = tabs
  const generatedId = useId()
  const id = props.id ?? 'tab-panel-' + generatedId
  const labelId = 'tab-list-button-' + id
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    subscribe({ id, label, labelId, disabled, ref })
  }, [disabled, id, label, labelId, ref, subscribe])

  useEffect(() => {
    return () => unsubscribe(id)
  }, [id, unsubscribe])

  const [hasAnnouncedInitiallyActive, setHasAnnouncedInitiallyActive] = useState(false)
  useEffect(() => {
    if (hasAnnouncedInitiallyActive) return
    if (initiallyActive) {
      dispatch({ type: 'select', id })
    }
    setHasAnnouncedInitiallyActive(true)
  }, [dispatch, hasAnnouncedInitiallyActive, id, initiallyActive])

  if (children == null) {
    return null
  }

  const isActive = activeId === id

  return (
    <div
      {...props}
      ref={ref}
      id={id}
      hidden={!isActive}
      className={clsx('tab-panel', props.className)}
      data-disabled={PropsUtil.dataAttributes.bool(disabled)}
      role="tabpanel"
      aria-labelledby={labelId}
    >
      <Visibility isVisible={isActive || forceMount}>
        {children}
      </Visibility>
    </div>
  )
}
