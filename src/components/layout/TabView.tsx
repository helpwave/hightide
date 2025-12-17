import type { HTMLAttributes, ReactNode, KeyboardEvent } from 'react'
import { useId } from 'react'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import clsx from 'clsx'

export interface TabInfo {
  label: string,
}

export interface TabContextType {
  active: string | null,
  setActive: (id: string) => void,
  register: (id: string, label: string) => void,
  unregister: (id: string) => void,
  tabs?: TabInfo[],
}

const TabContext = createContext<TabContextType | null>(null)

export function useTabContext(): TabContextType {
  const ctx = useContext(TabContext)
  if (!ctx) throw new Error('useTabContext must be used inside a <TabView>')
  return ctx
}

type TabViewProps = HTMLAttributes<HTMLDivElement> & {
  outerDivProps?: HTMLAttributes<HTMLDivElement>,
  children?: ReactNode,
  onTabChanged?: (tabId: string) => void,
  initialTabIndex?: number,
}

type TabState = { id: string, label: string }
type RefMap = Record<string, HTMLButtonElement | null>

export function TabView({ children, outerDivProps, onTabChanged, initialTabIndex = 0, ...props }: TabViewProps) {
  const [tabs, setTabs] = useState<TabState[]>([])
  const [active, setActiveState] = useState<string | null>(null)
  const buttonRefs = useRef<RefMap>({})

  const setActive = (id: string) => {
    setActiveState(id)
    onTabChanged?.(id)
  }

  const register = (id: string, label: string) => {
    setTabs((prev) => {
      const exists = prev.some((t) => t.id === id)
      if (!exists) {
        const updated = [...prev, { id, label }]

        if (active === null && updated[initialTabIndex]) {
          setActive(updated[initialTabIndex].id)
        }

        return updated
      }
      return prev
    })
  }

  const unregister = (id: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== id))
    delete buttonRefs.current[id]
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const idx = tabs.findIndex((t) => t.id === id)
    if (idx === -1) return
    let nextIdx = idx

    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length
    else return

    const nextId = tabs[nextIdx].id
    setActive(nextId)
    buttonRefs.current[nextId]?.focus()
  }

  const value: TabContextType = { active, setActive, register, unregister, tabs }

  return (
    <TabContext.Provider value={value}>
      <div {...outerDivProps} className={clsx('w-full', props.className)}>
        <div role="tablist" {...props} className={clsx('flex-row-0')}>
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`${t.id}-panel`}
              id={`${t.id}-tab`}
              tabIndex={active === t.id ? 0 : -1}
              ref={(el) => {
                buttonRefs.current[t.id] = el
              }}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, t.id)}
              className={clsx(
                'flex-row-0 grow justify-center px-3 pb-2.25 typography-label-md font-bold border-b-2',
                active === t.id
                  ? 'border-primary'
                  : 'text-description hover:text-on-background'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {children}
      </div>
    </TabContext.Provider>
  )
}

type TabProps = HTMLAttributes<HTMLDivElement> & {
  id?: string,
  label: string,
}

export function Tab({ id: customId, label, children, ...props }: TabProps) {
  const { active, register, unregister } = useTabContext()
  const generatedId = useId()
  const id = customId ?? generatedId

  useEffect(() => {
    register(id, label)
    return () => unregister(id)
  }, [id, label])

  return (
    <div
      role="tabpanel"
      id={`${id}-panel`}
      aria-labelledby={`${id}-tab`}
      hidden={active !== id}
      className="mt-4 text-sm"
      {...props}
    >
      {active === id && children}
    </div>
  )
}