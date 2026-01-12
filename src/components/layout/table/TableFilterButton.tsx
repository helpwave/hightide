import { Button } from '../../user-interaction/Button'
import { Input } from '../../user-interaction/input/Input'
import { FilterIcon } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Column } from '@tanstack/react-table'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Visibility } from '../Visibility'
import { DateTimeInput } from '../../user-interaction/input/DateTimeInput'
import { FormFieldLayout } from '../../form/FieldLayout'
import { PopUp } from '../PopUp'

export type TableFilterType = 'text' | 'range' | 'dateRange'

export type TableFilterButtonProps<T = unknown> = {
  filterType: TableFilterType,
  column: Column<T>,
}

export const TableFilterButton = <T, >({
  filterType,
  column,
}: TableFilterButtonProps<T>) => {
  const translation = useHightideTranslation()
  const columnFilterValue = column.getFilterValue()
  const [filterValue, setFilterValue] = useState<unknown>(columnFilterValue)
  const hasFilter = !!filterValue
  const anchorRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDateTimeInputOpen, setIsDateTimeInputOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const id = useId()
  const ids = useMemo(() => ({
    button: `table-filter-button-${id}`,
    popup: `table-filter-popup-${id}`,
    label: `table-filter-label-${id}`,
  }), [id])
  const [temporaryMinDateValue, setTemporaryMinDateValue] = useState<Date | null>(null)
  const [temporaryMaxDateValue, setTemporaryMaxDateValue] = useState<Date | null>(null)

  useEffect(() => {
    setFilterValue(columnFilterValue)
  }, [columnFilterValue])


  // we need to avoid the race condition of setting to false before the useOutsideClick hook is called
  const setIsDateTimeInputOpenWrapper = useCallback((isOpen: boolean) => {
    if(isOpen) {
      setIsDateTimeInputOpen(isOpen)
    } else {
      setTimeout(() => {
        setIsDateTimeInputOpen(isOpen)
      }, 50)
    }
  }, [])

  return (
    <>
      <Button
        ref={anchorRef}
        id={ids.button}
        layout="icon"
        color="neutral"
        size="xs"

        onClick={() => setIsOpen(!isOpen)}

        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? ids.popup : undefined}
        aria-labelledby={ids.label}

        className="relative"
      >
        <FilterIcon className="size-4"/>
        <Visibility isVisible={hasFilter}>
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
        </Visibility>
      </Button>
      <PopUp
        ref={containerRef}
        id={ids.popup}
        isOpen={isOpen}
        options={{
          verticalAlignment: 'afterEnd',
          horizontalAlignment: 'center',
        }}
        anchor={anchorRef}
        outsideClickOptions={{ refs: [anchorRef], active: !isDateTimeInputOpen }}

        onClose={() => setIsOpen(false)}

        role="dialog"
        aria-labelledby={ids.label}

        className="flex-col-2 p-2 items-start"
      >
        <span id={ids.label} className="typography-label-lg font-semibold">{translation('filter')}</span>
        {filterType === 'text' && (
          <Input
            value={(filterValue ?? '') as string}
            autoFocus={true}
            placeholder={translation('text')+'...'}
            onValueChange={setFilterValue}
          />
        )}
        {filterType === 'range' && (
          <div className="flex-row-2 items-center">
            <FormFieldLayout
              label={translation('min')}
            >
              {({ ariaAttributes, interactionStates, id }) => (
                <Input
                  {...ariaAttributes}
                  {...interactionStates}
                  id={id}
                  value={(filterValue as [number, number])?.[0]?.toString() ?? ''}
                  type="number"
                  placeholder={translation('value')}
                  onValueChange={text => {
                    const num = Number(text)
                    setFilterValue((old: [number, number]) => [num, old?.[1]])
                  }}
                  className="input-indicator-hidden w-28"
                />
              )}
            </FormFieldLayout>
            <FormFieldLayout
              label={translation('max')}
            >
              {({ ariaAttributes, interactionStates, id }) => (
                <Input
                  {...ariaAttributes}
                  {...interactionStates}
                  id={id}
                  value={(filterValue as [number, number])?.[1]?.toString() ?? ''}
                  type="number"
                  placeholder={translation('value')}
                  onValueChange={text => {
                    const num = Number(text)
                    setFilterValue((old: [number, number]) => [old?.[0], num])
                  }}
                  className="input-indicator-hidden w-28"
                />
              )}
            </FormFieldLayout>
          </div>
        )}
        {filterType === 'dateRange' && (
          <>
            <DateTimeInput
              value={temporaryMinDateValue ?? (filterValue as [Date, Date])?.[0] ?? null}
              placeholder={translation('startDate')}
              onValueChange={value => setTemporaryMinDateValue(value)}
              onEditComplete={value => {
                setFilterValue((old: [Date, Date]) => {
                  if(value && old?.[1] && value > old?.[1]) {
                    if(!old?.[0]) {
                      return [old?.[1], value]
                    }
                    const diff = old?.[1].getTime() - old?.[0].getTime()
                    return [value, new Date(value.getTime() + diff)]
                  }
                  return [value, old?.[1]]
                })
                setTemporaryMinDateValue(null)
              }}
              allowRemove={true}
              onDialogOpeningChange={setIsDateTimeInputOpenWrapper}
              outsideClickCloses={false}
              className="min-w-60"
            />
            <DateTimeInput
              value={temporaryMaxDateValue ?? (filterValue as [Date, Date])?.[1] ?? null}
              placeholder={translation('endDate')}
              onValueChange={value => setTemporaryMaxDateValue(value)}
              onEditComplete={value => {
                setFilterValue((old: [Date, Date]) => {
                  if(value && old?.[0] && value < old?.[0]) {
                    if(!old?.[1]) {
                      return [value, old?.[0]]
                    }
                    const diff = old?.[1].getTime() - old?.[0].getTime()
                    return [new Date(value.getTime() - diff), value]
                  }
                  return [old?.[0], value]
                })
              }}
              allowRemove={true}
              onDialogOpeningChange={setIsDateTimeInputOpenWrapper}
              outsideClickCloses={false}
              className="min-w-60"
            />
          </>
        )}
        <div className="flex-row-2 justify-end w-full">
          {hasFilter && (
            <Button color="negative" size="sm" onClick={() => {
              column.setFilterValue(undefined)
              setIsOpen(false)
            }}>
              {translation('remove')}
            </Button>
          )}
          <Button size="sm" onClick={() => {
            column.setFilterValue(filterValue)
            setIsOpen(false)
          }}>
            {translation('apply')}
          </Button>
        </div>
      </PopUp>
    </>
  )
}