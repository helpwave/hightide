import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@helpwave/hightide-utils'
import { Table } from '@/src/components/layout/table/Table'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { Chip } from '@/src/components/display-and-visualization/Chip'

type Person = {
  id: string,
  name: string,
  city: string,
  status: 'active' | 'inactive' | 'pending',
  visits: number,
}

const statuses = ['active', 'inactive', 'pending'] as const

faker.seed(20260703)

const TOTAL_ROWS = 5000
const FETCH_SIZE = 50

const allRows: Person[] = range(TOTAL_ROWS).map((index) => ({
  id: String(index + 1),
  name: faker.person.fullName(),
  city: faker.location.city(),
  status: faker.helpers.arrayElement(statuses),
  visits: faker.number.int({ min: 0, max: 1000 }),
}))

const fetchPage = async (pageIndex: number): Promise<Person[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  const start = pageIndex * FETCH_SIZE
  return allRows.slice(start, start + FETCH_SIZE)
}

const meta: Meta = {}

export default meta
type Story = StoryObj<typeof meta>

/**
 * The virtualized table with `scroll: 'page'` — it virtualizes against the
 * nearest scrollable ancestor (here the bordered box, in a real app the
 * `AppPage` content area) instead of its own capped box, and drives infinite
 * scroll through the built-in `onReachBottom` option. This is the same shared
 * scroll handling the `VirtualizedCardGrid` uses.
 */
export const pageScrollTable: Story = {
  render: () => {
    const [pages, setPages] = useState<Person[][]>([])
    const [isFetching, setIsFetching] = useState(false)
    const isFetchingRef = useRef(false)
    const loadedPagesRef = useRef(0)

    const flatData = useMemo(() => pages.flat(), [pages])

    const fetchNextPage = useCallback(async () => {
      if (isFetchingRef.current) return
      if (loadedPagesRef.current * FETCH_SIZE >= TOTAL_ROWS) return
      isFetchingRef.current = true
      setIsFetching(true)
      const rows = await fetchPage(loadedPagesRef.current)
      setPages((prev) => [...prev, rows])
      loadedPagesRef.current += 1
      isFetchingRef.current = false
      setIsFetching(false)
    }, [])

    useEffect(() => {
      void fetchNextPage()
    }, [fetchNextPage])

    return (
      <div className="max-h-128 overflow-y-auto rounded-lg border border-divider p-4 flex-col-4">
        <p className="text-description typography-body-md">
          This paragraph scrolls away with the table — the table rides the outer scroll container
          and loads more rows as you approach the bottom.
        </p>
        <Table
          table={{
            data: flatData,
            isUsingFillerRows: true,
            initialState: { pagination: { pageIndex: 0, pageSize: TOTAL_ROWS } },
          }}
          paginationOptions={{ showPagination: false }}
          displayProps={{
            virtualized: { scroll: 'page', estimateRowHeight: 48, onReachBottom: fetchNextPage },
            tableHeaderProps: { isSticky: true },
          }}
          footer={isFetching ? (
            <span className="text-description typography-label-md">Fetching more…</span>
          ) : null}
        >
          <TableColumn id="id" header="ID" accessorKey="id" sortingFn="alphanumeric" size={80} minSize={70} maxSize={120}/>
          <TableColumn id="name" header="Name" accessorKey="name" sortingFn="text" size={220} minSize={160} maxSize={320} filterType="text"/>
          <TableColumn id="city" header="City" accessorKey="city" sortingFn="text" size={200} minSize={140} maxSize={300} filterType="text"/>
          <TableColumn
            id="status"
            header="Status"
            accessorKey="status"
            sortingFn="text"
            size={150}
            minSize={120}
            maxSize={220}
            cell={({ cell }) => (<Chip>{cell.getValue() as string}</Chip>)}
          />
          <TableColumn id="visits" header="Visits" accessorKey="visits" sortingFn="alphanumeric" size={120} minSize={100} maxSize={180} filterType="number"/>
        </Table>
      </div>
    )
  },
}
