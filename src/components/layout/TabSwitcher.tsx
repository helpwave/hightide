import type { CSSProperties, Dispatch, HTMLAttributes, KeyboardEvent, PropsWithChildren, ReactNode, RefObject, SetStateAction } from 'react'
import { useCallback, useId, useState } from 'react'
import { createContext, useContext, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { PropsUtil } from '@/src/utils/propsUtil'
import { createPortal } from 'react-dom'
import { Visibility } from './Visibility'

export interface TabInfo {
  id: string,
  labelId: string,
  label: ReactNode,
  disabled?: boolean,
  ref: RefObject<HTMLElement>,
}

function sortByDomOrder(infos: TabInfo[]): TabInfo[] {
  return infos.slice().sort((a, b) => {
    const elA = a.ref.current
    const elB = b.ref.current
    if (!elA && !elB) return 0
    if (!elA) return 1
    if (!elB) return -1
    return (elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1
  })
}

function getNextEnabledIdInOrder(sortedInfos: TabInfo[], currentActiveId: string | null): string | null {
  const enabled = sortedInfos.filter(t => !t.disabled)
  if (enabled.length === 0) return null
  const currentIndex = sortedInfos.findIndex(t => t.id === currentActiveId)
  const startIndex = currentIndex >= 0 ? (currentIndex + 1) % sortedInfos.length : 0
  for (let i = 0; i < sortedInfos.length; i++) {
    const idx = (startIndex + i) % sortedInfos.length
    if (!sortedInfos[idx].disabled) return sortedInfos[idx].id
  }
  return null
}

type TabState = {
  activeId: string | null,
  infos: TabInfo[],
}

type PortalState = {
  id: string,
  ref: RefObject<HTMLElement>,
}

export interface TabContextType {
  tabs: {
    activeId: string | null,
    setActiveId: Dispatch<SetStateAction<string | null>>,
    subscribe: (info: TabInfo) => () => void,
    info?: TabInfo[],
  },
  portal: {
    id: string | null,
    element: HTMLElement | null,
    setPortal: (state: PortalState | null) => void,
  },
}

const TabContext = createContext<TabContextType | null>(null)

export function useTabContext(): TabContextType {
  const context = useContext(TabContext)
  if (!context) throw new Error('useTabContext must be used inside a <TabView>')
  return context
}

export type TabSwitcherProps = PropsWithChildren

//
// TabSwitcher
//
export function TabSwitcher({ children }: TabSwitcherProps) {
  const [state, setState] = useState<TabState>({
    activeId: null,
    infos: [],
  })
  const [portalState, setPortalState] = useState<PortalState>(null)

  const subscribe = useCallback((info: TabInfo) => {
    const id = info.id
    setState(prevState => {
      const existingIndex = prevState.infos.findIndex(t => t.id === id)
      const infos = existingIndex >= 0
        ? prevState.infos.map((t, i) => (i === existingIndex ? { ...t, ...info } : t))
        : [...prevState.infos, info]
      const ordered = sortByDomOrder(infos)
      const activeIsDisabled = prevState.activeId !== null && infos.some(t => t.id === prevState.activeId && t.disabled)
      const activeId = activeIsDisabled
        ? getNextEnabledIdInOrder(ordered, prevState.activeId)
        : prevState.activeId ?? (info.disabled ? getNextEnabledIdInOrder(ordered, null) : id)
      return { activeId, infos: ordered }
    })
    return () => {
      setState(prevState => {
        const infos = prevState.infos.filter(t => t.id !== id)
        const activeTab = prevState.activeId !== null ? infos.find(t => t.id === prevState.activeId) : null
        const activeIsUnregisteredOrDisabled = prevState.activeId === id || (activeTab?.disabled === true)
        const nextId = prevState.activeId === id
          ? getNextEnabledIdInOrder(prevState.infos, id)
          : getNextEnabledIdInOrder(infos, prevState.activeId)
        const activeId = activeIsUnregisteredOrDisabled ? nextId : prevState.activeId
        return { activeId, infos }
      })
    }
  }, [])

  const registerPortal = useCallback((state: PortalState) => {
    setPortalState(state)
  }, [])

  const setActiveId = useCallback((activeId: string) => {
    setState(prevState => ({ ...prevState, activeId }))
  }, [])

  return (
    <TabContext.Provider
      value={{
        tabs: {
          activeId: state.activeId,
          setActiveId,
          subscribe,
          info: state.infos,
        },
        portal: {
          id: portalState?.id ?? null,
          element: portalState?.ref.current ?? null,
          setPortal: registerPortal,
        }
      }}
    >
      {children}
    </TabContext.Provider>
  )
}

//
// TabList
//
type TabListProps = HTMLAttributes<HTMLUListElement>

export function TabList({ ...props }: TabListProps) {
  const { tabs } = useTabContext()
  const { info, activeId, setActiveId: setActive } = tabs
  const refs = useRef<Record<string, HTMLLIElement | null>>({})

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const idx = info.findIndex((tab) => tab.id === activeId)
    if (idx === -1) return

    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) return

    let nextIdx = idx
    for (let i = 0; i < info.length; i++) {
      nextIdx = (nextIdx + step + info.length) % info.length
      if (!info[nextIdx].disabled) break
    }
    if (info[nextIdx].disabled) return

    const nextId = info[nextIdx].id
    setActive(nextId)
    refs.current[nextId]?.focus()
  }

  return (
    <ul
      {...props}
      data-name={props['data-name'] ?? 'tab-list'}
      onKeyDown={onKeyDown}
      role="tablist"
      aria-orientation="horizontal"
      style={{ '--tab-count': info.length, ...props.style } as CSSProperties}
    >
      {info.map((tabInfo) => {
        const isDisabled = !!tabInfo.disabled
        const isActive = activeId === tabInfo.id
        return (
          <li
            key={tabInfo.id}
            ref={(el) => {
              refs.current[tabInfo.id] = el
            }}
            id={tabInfo.labelId}


            {...(isDisabled ? {} : PropsUtil.aria.click(() => setActive(tabInfo.id)))}

            data-name="tab-list-item"
            data-active={PropsUtil.dataAttributes.bool(isActive)}
            data-disabled={PropsUtil.dataAttributes.bool(isDisabled)}

            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            aria-controls={activeId}
            tabIndex={isActive && !isDisabled ? 0 : -1}
          >
            {tabInfo.label}
          </li>
        )
      })}
    </ul>
  )
}


//
// TabView
//
type TabViewProps = HTMLAttributes<HTMLDivElement>

export function TabView({ ...props }: TabViewProps) {
  const generated = useId()
  const id = props.id ?? 'tab-view-' + generated
  const { portal } = useTabContext()
  const { setPortal } = portal
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPortal({ id, ref })
    return () => setPortal(null)
  }, [id, setPortal])

  return (
    <div
      {...props}
      ref={ref}
      id={id}
      className={clsx('tab-view', props.className)}
    />
  )
}

type TabPanelProps = HTMLAttributes<HTMLDivElement> & {
  label: string,
  forceMount?: boolean,
  disabled?: boolean,
}

//
// TabPanel
//
export function TabPanel({ label, forceMount = false, disabled = false, ...props }: TabPanelProps) {
  const { tabs, portal } = useTabContext()
  const { subscribe, activeId } = tabs
  const generatedId = useId()
  const id = props.id ?? 'tab-panel-' + generatedId
  const labelId = 'tab-list-button-' + generatedId
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return subscribe({ id, label, labelId, disabled, ref })
  }, [id, label, labelId, disabled, subscribe])

  const isActive = activeId === id

  const content = (
    <div
      {...props}
      ref={ref}
      id={id}
      hidden={!isActive}

      data-name={props['data-name'] ?? 'tab-panel'}
      data-disabled={PropsUtil.dataAttributes.bool(disabled)}

      role="tabpanel"
      aria-labelledby={labelId}
    >
      <Visibility isVisible={isActive || forceMount}>
        {props.children}
      </Visibility>
    </div>
  )

  if (portal.element) {
    return createPortal(content, portal.element)
  }

  return content
}