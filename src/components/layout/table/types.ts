import type { FilterFn, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
      className?: string,
      filterData?: {
        tags?: { tag: string, label: ReactNode }[],
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
      boolean: FilterFn<unknown>,
      tags: FilterFn<unknown>,
      generic: FilterFn<unknown>,
    }
  }