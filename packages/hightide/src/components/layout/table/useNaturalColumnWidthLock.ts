import type { RefObject } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { Table } from '@tanstack/react-table'

export type UseNaturalColumnWidthLockOptions<T> = {
  table: Table<T>,
  tableRef: RefObject<HTMLTableElement | null>,
  enabled: boolean,
}

export function useNaturalColumnWidthLock<T>({
  table,
  tableRef,
  enabled,
}: UseNaturalColumnWidthLockOptions<T>): boolean {
  const [isLocked, setIsLocked] = useState(false)
  const autoLockedWidthsRef = useRef<Map<string, number>>(new Map())

  useLayoutEffect(() => {
    if (!enabled) {
      setIsLocked(false)
      return
    }
    const element = tableRef.current
    if (!element) return

    const columns = table.getVisibleLeafColumns()
    const sizing = table.getState().columnSizing
    const missing = columns.filter(column => sizing[column.id] === undefined)
    if (missing.length === 0) {
      setIsLocked(columns.length > 0)
      return
    }
    setIsLocked(false)
    if (table.getRowModel().rows.length === 0) return
    if (element.getBoundingClientRect().width === 0) return
    if (getComputedStyle(element).tableLayout !== 'auto') return

    const headerCells = element.querySelectorAll<HTMLTableCellElement>('th[data-name="table-header-cell"]')
    if (headerCells.length !== columns.length) return
    const measured: Record<string, number> = {}
    columns.forEach((column, index) => {
      const width = headerCells[index]?.getBoundingClientRect().width
      if (width !== undefined && width > 0 && sizing[column.id] === undefined) {
        measured[column.id] = Math.round(width)
        autoLockedWidthsRef.current.set(column.id, measured[column.id])
      }
    })
    if (Object.keys(measured).length === 0) return
    table.setColumnSizing(prev => ({ ...measured, ...prev }))
  })

  useLayoutEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    let frame: number | null = null
    const handleResize = () => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(() => {
        frame = null
        const autoLocked = autoLockedWidthsRef.current
        if (autoLocked.size === 0) return
        autoLockedWidthsRef.current = new Map()
        setIsLocked(false)
        table.setColumnSizing(prev => {
          const next = { ...prev }
          for (const [id, width] of autoLocked) {
            if (next[id] === width) delete next[id]
          }
          return next
        })
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [enabled, table])

  return isLocked
}
