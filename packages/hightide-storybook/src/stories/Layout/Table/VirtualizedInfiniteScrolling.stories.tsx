import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@helpwave/hightide-utils'
import { Table } from '@/src/components/layout/table/Table'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { TableCell } from '@/src/components/layout/table/TableCell'
import { TableColumnSwitcher } from '@/src/components/layout/table/TableColumnSwitcher'
import { Chip } from '@/src/components/display-and-visualization/Chip'
import { useHightideTranslation } from '@helpwave/hightide-utils'

type Person = {
  id: string,
  name: string,
  age: number,
  email: string,
  city: string,
  status: 'active' | 'inactive' | 'pending',
  visits: number,
  joined: Date,
}

const statuses = ['active', 'inactive', 'pending'] as const

faker.seed(20260624)

const TOTAL_ROWS = 5000
const FETCH_SIZE = 50
const BOTTOM_THRESHOLD_PX = 500

const allRows: Person[] = range(TOTAL_ROWS).map((index) => ({
  id: String(index + 1),
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 99 }),
  email: faker.internet.email(),
  city: faker.location.city(),
  status: faker.helpers.arrayElement(statuses),
  visits: faker.number.int({ min: 0, max: 1000 }),
  joined: faker.date.past({ years: 10 }),
}))

const fetchPage = async (pageIndex: number): Promise<Person[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  const start = pageIndex * FETCH_SIZE
  return allRows.slice(start, start + FETCH_SIZE)
}

const meta: Meta = {}

export default meta
type Story = StoryObj<typeof meta>

export const virtualizedInfiniteScrolling: Story = {
  render: () => {
    const translation = useHightideTranslation()

    const [pages, setPages] = useState<Person[][]>([])
    const [isFetching, setIsFetching] = useState(false)
    const isFetchingRef = useRef(false)
    const loadedPagesRef = useRef(0)

    const flatData = useMemo(() => pages.flat(), [pages])
    const totalFetched = flatData.length

    const fetchNextPage = useCallback(async () => {
      if (isFetchingRef.current) return
      if (loadedPagesRef.current * FETCH_SIZE >= TOTAL_ROWS) return
      isFetchingRef.current = true
      setIsFetching(true)
      const pageIndex = loadedPagesRef.current
      const rows = await fetchPage(pageIndex)
      setPages((prev) => [...prev, rows])
      loadedPagesRef.current = pageIndex + 1
      isFetchingRef.current = false
      setIsFetching(false)
    }, [])

    useEffect(() => {
      void fetchNextPage()
    }, [fetchNextPage])

    const fetchMoreOnBottomReached = useCallback((element: HTMLDivElement | null) => {
      if (!element) return
      const { scrollHeight, scrollTop, clientHeight } = element
      if (scrollHeight - scrollTop - clientHeight < BOTTOM_THRESHOLD_PX && !isFetchingRef.current && totalFetched < TOTAL_ROWS) {
        void fetchNextPage()
      }
    }, [fetchNextPage, totalFetched])

    return (
      <Table
        table={{
          data: flatData,
          isUsingFillerRows: true,
          initialState: { pagination: { pageIndex: 0, pageSize: TOTAL_ROWS } },
        }}
        paginationOptions={{ showPagination: false }}
        displayProps={{
          virtualized: { scroll: 'container', estimateRowHeight: 48 },
          tableHeaderProps: { isSticky: true },
          containerProps: {
            className: 'max-h-128 min-h-128',
            onScroll: (event) => fetchMoreOnBottomReached(event.currentTarget),
          },
        }}
        header={(
          <div className="flex-row-2 items-center justify-between w-full">
            <span className="typography-title-md">Virtualized infinite scrolling</span>
            <div className="flex-row-2 items-center">
              <span className="text-description typography-label-md">{`${totalFetched} of ${TOTAL_ROWS} rows loaded`}</span>
              <TableColumnSwitcher/>
            </div>
          </div>
        )}
        footer={isFetching ? (
          <span className="text-description typography-label-md">Fetching more…</span>
        ) : null}
      >
        <TableColumn id="id" header="ID" accessorKey="id" sortingFn="alphanumeric" size={80} minSize={70} maxSize={120}/>
        <TableColumn id="name" header={translation('name')} accessorKey="name" sortingFn="text" size={200} minSize={160} maxSize={320} filterType="text"/>
        <TableColumn id="age" header={translation('age')} accessorKey="age" sortingFn="alphanumeric" size={110} minSize={90} maxSize={160} filterType="number"/>
        <TableColumn id="email" header="Email" accessorKey="email" sortingFn="text" size={280} minSize={200} maxSize={400} filterType="text"/>
        <TableColumn id="city" header="City" accessorKey="city" sortingFn="text" size={180} minSize={140} maxSize={300} filterType="text"/>
        <TableColumn
          id="status"
          header="Status"
          accessorKey="status"
          sortingFn="text"
          size={150}
          minSize={120}
          maxSize={220}
          filterType="singleTag"
          cell={({ cell }) => (<Chip>{cell.getValue() as string}</Chip>)}
          meta={{ filterData: { tags: statuses.map((status) => ({ tag: status, label: status })) } }}
        />
        <TableColumn id="visits" header="Visits" accessorKey="visits" sortingFn="alphanumeric" size={120} minSize={100} maxSize={180} filterType="number"/>
        <TableColumn
          id="joined"
          header="Joined"
          accessorKey="joined"
          sortingFn="datetime"
          size={200}
          minSize={160}
          maxSize={300}
          filterType="date"
          cell={({ cell }) => (<TableCell>{(cell.getValue() as Date).toLocaleDateString()}</TableCell>)}
        />
      </Table>
    )
  },
}
