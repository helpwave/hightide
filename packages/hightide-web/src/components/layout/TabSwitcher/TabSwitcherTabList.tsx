import type { CSSProperties, HTMLAttributes, KeyboardEvent } from 'react'
import { useRef } from 'react'
import clsx from 'clsx'
import { useTabSwitcherContext } from './TabSwitcherContext'
import { TabSwitcherTabListItem } from './TabSwitcherTabListItem'

export type TabSwitcherTabListProps = HTMLAttributes<HTMLUListElement>

export function TabSwitcherTabList({ ...props }: TabSwitcherTabListProps) {
  const { config, dispatch, tabs } = useTabSwitcherContext()
  const { infos, activeId } = tabs
  const refs = useRef<Record<string, HTMLLIElement | null>>({})

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    props.onKeyDown?.(event)
    if (event.defaultPrevented) return
    const index = infos.findIndex((tab) => tab.id === activeId)
    if (index === -1) return

    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) return

    let nextIndex = index
    for (let cursor = 0; cursor < infos.length; cursor++) {
      nextIndex = (nextIndex + step + infos.length) % infos.length
      if (!infos[nextIndex].disabled) break
    }
    if (infos[nextIndex].disabled) return

    const nextId = infos[nextIndex].id
    dispatch({ type: 'select', id: nextId })
    refs.current[nextId]?.focus()
  }

  return (
    <ul
      {...props}
      className={clsx('tab-list', props.className)}
      data-style-variant={config.variant}
      onKeyDown={onKeyDown}
      role="tablist"
      aria-orientation="horizontal"
      style={{ '--tab-count': infos.length, ...props.style } as CSSProperties}
    >
      {infos.map((info) => (
        <TabSwitcherTabListItem
          key={info.id}
          ref={(element) => {
            refs.current[info.id] = element
          }}
          info={info}
          isActive={activeId === info.id}
        />
      ))}
    </ul>
  )
}
