import type { FilterFn, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
      className?: string,
      filterData?: {
        tags?: { tag: string, label: string, display?: ReactNode }[],
      },
      columnLabel?: string,
    }

    interface TableMeta<TData> {
      headerRowClassName?: string,
      bodyRowClassName?: ((value: TData) => string) | string,
    }

    interface FilterFns {
      text: FilterFn<unknown>,
      number: FilterFn<unknown>,
      date: FilterFn<unknown>,
      dateTime: FilterFn<unknown>,
      boolean: FilterFn<unknown>,
      multiTags: FilterFn<unknown>,
      singleTag: FilterFn<unknown>,
      generic: FilterFn<unknown>,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableOptions<TData extends RowData> {
      columnSizingTarget?: number,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableOptionsResolved<TData extends RowData> {
      columnSizingTarget?: number,
    }
  }