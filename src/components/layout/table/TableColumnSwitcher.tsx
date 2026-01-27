import { useMemo, useRef, useId } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, Pin, PinOff, ArrowLeftRightIcon } from 'lucide-react'
import type { ButtonProps } from '@/src/components/user-interaction/Button'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { PopUpProps } from '../popup/PopUp'
import { PopUp } from '../popup/PopUp'
import { PopUpRoot } from '../popup/PopUpRoot'
import { PopUpOpener } from '../popup/PopUpOpener'
import { Tooltip } from '../../user-interaction/Tooltip'
import { useTableStateWithoutSizingContext } from './TableContext'

export type TableColumnSwitcherPopUpProps = PopUpProps

export const TableColumnSwitcherPopUp = ({ ...props }: TableColumnSwitcherPopUpProps) => {
  const { table } = useTableStateWithoutSizingContext()
  const translation = useHightideTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const generatedId = useId()
  const ids = useMemo(() => ({
    popup: props.id ?? `table-column-picker-popup-${generatedId}`,
    label: `table-column-picker-label-${generatedId}`,
  }), [generatedId, props.id])

  const tableState = table.getState()
  const columnOrder = tableState.columnOrder
  const columnPinning = tableState.columnPinning

  const columns = useMemo(() => {
    const allColumns = table.getAllColumns()

    const leftPinned: typeof allColumns = []
    const unpinned: typeof allColumns = []
    const rightPinned: typeof allColumns = []

    const columnMap = new Map(allColumns.map(col => [col.id, col]))

    const processColumns = (columnIds: string[], targetArray: typeof allColumns) => {
      for (const columnId of columnIds) {
        const column = columnMap.get(columnId)
        if (column) {
          targetArray.push(column)
          columnMap.delete(columnId)
        }
      }
    }

    if (columnOrder.length > 0) {
      const leftPinnedIds = columnPinning?.left ?? []
      const rightPinnedIds = columnPinning?.right ?? []

      processColumns(leftPinnedIds, leftPinned)
      processColumns(rightPinnedIds, rightPinned)

      for (const columnId of columnOrder) {
        if (!leftPinnedIds.includes(columnId) && !rightPinnedIds.includes(columnId)) {
          const column = columnMap.get(columnId)
          if (column) {
            unpinned.push(column)
            columnMap.delete(columnId)
          }
        }
      }

      for (const column of columnMap.values()) {
        const pinState = column.getIsPinned()
        if (pinState === 'left') {
          leftPinned.push(column)
        } else if (pinState === 'right') {
          rightPinned.push(column)
        } else {
          unpinned.push(column)
        }
      }
    } else {
      for (const column of allColumns) {
        const pinState = column.getIsPinned()
        if (pinState === 'left') {
          leftPinned.push(column)
        } else if (pinState === 'right') {
          rightPinned.push(column)
        } else {
          unpinned.push(column)
        }
      }
    }

    return [...leftPinned, ...unpinned, ...rightPinned]
  }, [table, columnOrder, columnPinning])

  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    const currentColumns = columns.map(col => col.id)
    const currentIndex = currentColumns.indexOf(columnId)
    if (currentIndex === -1) return

    const column = table.getColumn(columnId)
    if (!column) return

    const isPinned = column.getIsPinned()
    if (isPinned) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= currentColumns.length) return

    const targetColumn = table.getColumn(currentColumns[newIndex])
    if (!targetColumn) return

    const targetIsPinned = targetColumn.getIsPinned()
    if (targetIsPinned !== isPinned) return

    const newOrder = [...currentColumns]
    const temp = newOrder[currentIndex]
    newOrder[currentIndex] = newOrder[newIndex]
    newOrder[newIndex] = temp

    table.setColumnOrder(newOrder)
  }

  const toggleColumnVisibility = (columnId: string) => {
    const column = table.getColumn(columnId)
    column?.toggleVisibility()
  }

  const pinColumn = (columnId: string, side: 'left' | 'right') => {
    const column = table.getColumn(columnId)
    if (!column || !column.getCanPin()) return
    column.pin(side)
  }

  const unpinColumn = (columnId: string) => {
    const column = table.getColumn(columnId)
    if (!column || !column.getCanPin()) return

    const pinState = column.getIsPinned()
    if (!pinState) return

    column.pin(false)

    const currentOrder = table.getState().columnOrder
    const unpinnedColumns = currentOrder.filter(id => {
      const col = table.getColumn(id)
      return col && !col.getIsPinned()
    })

    if (pinState === 'left') {
      const newOrder = [columnId, ...unpinnedColumns]
      table.setColumnOrder(newOrder)
    } else if (pinState === 'right') {
      const newOrder = [...unpinnedColumns, columnId]
      table.setColumnOrder(newOrder)
    }
  }

  const getColumnHeader = (columnId: string) => {
    const column = table.getColumn(columnId)
    const columnLabel = column?.columnDef.meta?.columnLabel
    if (columnLabel) {
      return columnLabel
    }
    const header = column?.columnDef.header
    if (typeof header === 'string') {
      return header
    }
    if (typeof header === 'function') {
      return columnId
    }
    return columnId
  }

  return (
    <PopUp
      {...props}
      ref={containerRef}
      id={ids.popup}
      options={{
        verticalAlignment: 'afterEnd',
        horizontalAlignment: 'center',
        ...props.options,
      }}

      role="dialog"
      aria-labelledby={ids.label}
      aria-describedby={ids.label}

      className="flex-col-1 p-2 items-start min-w-72"
    >
      <div className="flex-col-1">
        <span id={ids.label} className="typography-title-md font-semibold">
          {translation('columnPicker')}
        </span>
        <span className="text-description typography-label-sm mb-2">
          {translation('columnPickerDescription')}
        </span>
      </div>
      <div className="flex-col-1 overflow-y-auto w-full">
        {columns.map((column, index) => {
          const columnId = column.id
          const isVisible = column.getIsVisible()
          const pinState = column.getIsPinned()
          const isPinned = column.getCanPin() && !!pinState
          const prevColumn = index > 0 ? columns[index - 1] : null
          const nextColumn = index < columns.length - 1 ? columns[index + 1] : null
          const prevIsPinned = prevColumn?.getCanPin() && !!prevColumn.getIsPinned()
          const nextIsPinned = nextColumn?.getCanPin() && !!nextColumn.getIsPinned()
          const canMoveUp = index > 0 && !isPinned && !prevIsPinned
          const canMoveDown = index < columns.length - 1 && !isPinned && !nextIsPinned

          return (
            <div key={columnId} className="flex-row-2 items-center justify-between gap-2 w-full">
              <div className="flex-row-2 gap-1">
                {isPinned ? (
                  <>
                    <Tooltip tooltip={translation('pinToLeft')}>
                      <Button
                        layout="icon"
                        size="sm"
                        color="neutral"
                        coloringStyle="text"
                        disabled={pinState === 'left'}
                        onClick={() => pinColumn(columnId, 'left')}
                        aria-label={translation('pinLeft')}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip tooltip={translation('pinToRight')}>
                      <Button
                        layout="icon"
                        size="sm"
                        color="neutral"
                        coloringStyle="text"
                        disabled={pinState === 'right'}
                        onClick={() => pinColumn(columnId, 'right')}
                        aria-label={translation('pinRight')}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip tooltip={translation('increaseSortingPriority')}>
                      <Button
                        layout="icon"
                        size="sm"
                        color="neutral"
                        coloringStyle="text"
                        disabled={!canMoveUp}
                        onClick={() => moveColumn(columnId, 'up')}
                        aria-label={translation('moveUp')}
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip tooltip={translation('decreaseSortingPriority')}>
                      <Button
                        layout="icon"
                        size="sm"
                        color="neutral"
                        coloringStyle="text"
                        disabled={!canMoveDown}
                        onClick={() => moveColumn(columnId, 'down')}
                        aria-label={translation('moveDown')}
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                    </Tooltip>
                  </>
                )}
              </div>
              <div className="flex-1 typography-label-lg">
                {getColumnHeader(columnId)}
              </div>
              <>
                <Tooltip tooltip={translation('changeVisibility')}>
                  <Button
                    layout="icon"
                    size="sm"
                    color="neutral"
                    coloringStyle="text"
                    disabled={!column.getCanHide()}
                    onClick={() => toggleColumnVisibility(columnId)}
                    aria-label={isVisible ? translation('hideColumn') : translation('showColumn')}
                  >
                    {isVisible ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip tooltip={translation('changePinning')}>
                  <Button
                    layout="icon"
                    size="sm"
                    color="neutral"
                    coloringStyle="text"
                    disabled={!column.getCanPin()}
                    onClick={() => {
                      if(isPinned) {
                        unpinColumn(columnId)
                      } else {
                        pinColumn(columnId, 'left')
                      }
                    }}
                    aria-label={isPinned ? translation('unpin') : translation('pinLeft')}
                  >
                    {!isPinned ? ( <PinOff className="size-4" />) : ( <Pin className="size-4" />)}
                  </Button>
                </Tooltip>
              </>
            </div>
          )
        })}
      </div>
    </PopUp>
  )
}

export interface TableColumnSwitcherProps extends TableColumnSwitcherPopUpProps {
  buttonProps?: ButtonProps,
}

export const TableColumnSwitcher = ({ buttonProps, ...props }: TableColumnSwitcherProps) => {
  const translation = useHightideTranslation()

  return (
    <PopUpRoot>
      <PopUpOpener>
        {({ props }) => (
          <Tooltip tooltip={translation('changeColumnDisplay')}>
            <Button {...props} size="md" layout="icon" color="neutral" coloringStyle="solid" {...buttonProps}>
              <ArrowLeftRightIcon className="size-4" />
            </Button>
          </Tooltip>
        )}
      </PopUpOpener>
      <TableColumnSwitcherPopUp {...props} />
    </PopUpRoot>
  )
}