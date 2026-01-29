import type { Dispatch, HTMLAttributes, KeyboardEvent, PropsWithChildren, ReactNode, RefObject, SetStateAction } from 'react'
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
    register: (info: TabInfo) => void,
    unregister: (id: string) => void,
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

  const register = (info: TabInfo) => {
    setState(prevState => ({
      activeId: prevState.activeId ?? info.id,
      infos: [...prevState.infos, info],
    }))
  }
  const unregister = useCallback((id: string) => {
    setState(prevState => {
      const infos = prevState.infos.filter(value => value.id !== id)
      let activeId = prevState.activeId
      if (activeId === id) {
        const index = prevState.infos.findIndex(value => value.id === id)
        if (infos.length > 0) {
          const newIndex = index % infos.length
          activeId = infos[newIndex].id
        } else {
          activeId = null
        }
      }
      return {
        activeId,
        infos,
      }
    })
  }, [])

  const registerPortal = useCallback((state: PortalState) => {
    setPortalState(state)
  }, [])

  return (
    <TabContext.Provider
      value={{
        tabs: {
          activeId: state.activeId,
          setActiveId: (activeId: string) => {
            setState(prevState => ({ ...prevState, activeId }))
          },
          register,
          unregister,
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

    let nextIdx = idx
    if (e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % info.length
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + info.length) % info.length
    } else {
      return
    }

    const nextId = info[nextIdx].id
    setActive(nextId)
    refs.current[nextId]?.focus()
  }

  return (
    <ul
      {...props}
      className={clsx('tab-list', props.className)}
      onKeyDown={onKeyDown}
      role="tablist"
      aria-orientation="horizontal"
    >
      {info.map((tabInfo) => (
        <li
          key={tabInfo.id}
          ref={(el) => {
            refs.current[tabInfo.id] = el
          }}
          id={tabInfo.labelId}
          className="tab-list-item"
          {...PropsUtil.aria.click(() => setActive(tabInfo.id))}
          data-active={PropsUtil.dataAttributes.bool(activeId === tabInfo.id)}

          role="tab"
          aria-selected={activeId === tabInfo.id}
          aria-controls={activeId}
          tabIndex={activeId === tabInfo.id ? 0 : -1}
        >
          {tabInfo.label}
        </li>
      ))}
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

type TabProps = HTMLAttributes<HTMLDivElement> & {
  label: string,
}

//
// TabPanel
//
export function TabPanel({ label, ...props }: TabProps) {
  const { tabs, portal } = useTabContext()
  const { register, unregister, activeId } = tabs
  const generatedId = useId()
  const id = props.id ?? 'tab-panel-' + generatedId
  const labelId = 'tab-list-button-' + generatedId

  useEffect(() => {
    register({ id, label, labelId })
    return () => unregister(id)
  }, [id, label, labelId, register, unregister])

  const isActive = activeId === id

  const content = (
    <div
      {...props}
      id={id}
      hidden={!isActive}
      className={clsx('tab-panel', props.className)}
      role="tabpanel"
      aria-labelledby={labelId}
    >
      <Visibility isVisible={isActive}>
        {props.children}
      </Visibility>
    </div>
  )

  if (portal.element) {
    return createPortal(content, portal.element)
  }

  return content
}