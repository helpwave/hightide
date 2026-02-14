import type { CSSProperties, Dispatch, HTMLAttributes, KeyboardEvent, PropsWithChildren, ReactNode, RefObject, SetStateAction } from 'react'
import { useCallback, useId, useState } from 'react'
import { createContext, useContext, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { PropsUtil } from '@/src/utils/propsUtil'
import { createPortal } from 'react-dom'
import { Visibility } from './Visibility'
import { useControlledState } from '@/src/hooks'

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

type PortalState = {
  id: string,
  ref: RefObject<HTMLElement>,
}

export interface TabContextType {
  tabs: {
    activeId: string | null,
    setActiveId: Dispatch<SetStateAction<string | null>>,
    subscribe: (info: TabInfo) => () => void,
    infos?: TabInfo[],
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

export interface TabSwitcherProps extends PropsWithChildren {
  activeId?: string,
  onActiveIdChange?: (activeId: string | null) => void,
  initialActiveId?: string,
}

//
// TabSwitcher
//

/**
 * The controlling component of several Tabpanels.
 *
 * The uncontrolled mode only works if the Tabpanels do not remount.
 */
export function TabSwitcher({ children, activeId: controlledActiveId, onActiveIdChange, initialActiveId }: TabSwitcherProps) {
  const [activeId, setActiveId] = useControlledState<string | null>({
    value: controlledActiveId,
    defaultValue: initialActiveId ?? null,
    onValueChange: onActiveIdChange,
  })
  const [tabInfos, setTabInfos] = useState<TabInfo[]>([])
  const [portalState, setPortalState] = useState<PortalState>(null)

  const subscribe = useCallback((info: TabInfo) => {
    const id = info.id
    setTabInfos(prevState => {
      const existingIndex = prevState.findIndex(t => t.id === id)
      const infos = existingIndex >= 0
        ? prevState.map((t, i) => (i === existingIndex ? { ...t, ...info } : t))
        : [...prevState, info]
      return sortByDomOrder(infos)
    })
    return () => {
      setTabInfos(prevState => {
        return prevState.filter(t => t.id !== id)
      })
    }
  }, [])


  useEffect(() => {
    const active = tabInfos.find(value => value.id === activeId)
    if(!active || !active.disabled) return
    const firstEnabled = tabInfos.find(value => !value.disabled)
    if(firstEnabled) {
      setActiveId(firstEnabled.id)
    } else {
      setActiveId(null)
    }
  }, [activeId, setActiveId, tabInfos])

  const registerPortal = useCallback((state: PortalState) => {
    setPortalState(state)
  }, [])

  const changeActiveId = useCallback((activeId: string) => {
    const info = tabInfos.find(value => value.id === activeId)
    if(info && info.disabled) return
    setActiveId(activeId)
  }, [setActiveId, tabInfos])

  const resolvedActiveId = () => {
    const active = tabInfos.find(value => value.id === activeId)
    if(!!active && !active.disabled) return activeId
    const firstEnabled = tabInfos.find(value => !value.disabled)
    if(firstEnabled) return firstEnabled.id
    return tabInfos[0]?.id ?? null
  }

  return (
    <TabContext.Provider
      value={{
        tabs: {
          activeId: resolvedActiveId(),
          setActiveId: changeActiveId,
          subscribe,
          infos: tabInfos,
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
  const { infos, activeId, setActiveId: setActive } = tabs
  const refs = useRef<Record<string, HTMLLIElement | null>>({})

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const idx = infos.findIndex((tab) => tab.id === activeId)
    if (idx === -1) return

    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) return

    let nextIdx = idx
    for (let i = 0; i < infos.length; i++) {
      nextIdx = (nextIdx + step + infos.length) % infos.length
      if (!infos[nextIdx].disabled) break
    }
    if (infos[nextIdx].disabled) return

    const nextId = infos[nextIdx].id
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
      style={{ '--tab-count': infos.length, ...props.style } as CSSProperties}
    >
      {infos.map((tabInfo) => {
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
            aria-controls={tabInfo.id}
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
  initiallyActive?: boolean,
}

//
// TabPanel
//
export function TabPanel({ label, forceMount = false, disabled = false, initiallyActive = false, ...props }: TabPanelProps) {
  const { tabs, portal } = useTabContext()
  const { subscribe, activeId, setActiveId } = tabs
  const generatedId = useId()
  const id = props.id ?? 'tab-panel-' + generatedId
  const labelId = 'tab-list-button-' + generatedId
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return subscribe({ id, label, labelId, disabled, ref })
  }, [id, label, labelId, disabled, subscribe])

  const [hasAnnouncedIntialliyActive, setHasAnnouncedIntialliyActive] = useState(false)
  useEffect(() => {
    if(!hasAnnouncedIntialliyActive) {
      if(initiallyActive) {
        setActiveId(id)
      }
      setHasAnnouncedIntialliyActive(true)
    }
  }, [hasAnnouncedIntialliyActive, id, initiallyActive, setActiveId])

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