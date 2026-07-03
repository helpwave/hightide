import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@/src/utils/array'
import { VirtualizedCardGrid } from '@/src/components/layout/virtualization/VirtualizedCardGrid'
import { Chip } from '@/src/components/display-and-visualization/Chip'

type Item = {
  id: string,
  name: string,
  city: string,
  status: 'active' | 'inactive' | 'pending',
  visits: number,
}

const statuses = ['active', 'inactive', 'pending'] as const

faker.seed(20260703)

const TOTAL_ITEMS = 4000
const FETCH_SIZE = 60

const allItems: Item[] = range(TOTAL_ITEMS).map((index) => ({
  id: String(index + 1),
  name: faker.person.fullName(),
  city: faker.location.city(),
  status: faker.helpers.arrayElement(statuses),
  visits: faker.number.int({ min: 0, max: 1000 }),
}))

const fetchPage = async (pageIndex: number): Promise<Item[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const start = pageIndex * FETCH_SIZE
  return allItems.slice(start, start + FETCH_SIZE)
}

const ItemCard = ({ item }: { item: Item }) => (
  <div className="surface coloring-solid rounded-lg p-4 flex-col-2 h-full">
    <div className="flex-row-2 items-center justify-between">
      <span className="typography-title-sm truncate">{item.name}</span>
      <Chip>{item.status}</Chip>
    </div>
    <span className="text-description typography-label-md">{item.city}</span>
    <span className="text-description typography-label-sm">{`#${item.id} · ${item.visits} visits`}</span>
  </div>
)

const useInfinitePages = () => {
  const [pages, setPages] = useState<Item[][]>([])
  const [isFetching, setIsFetching] = useState(false)
  const isFetchingRef = useRef(false)
  const loadedPagesRef = useRef(0)

  const items = useMemo(() => pages.flat(), [pages])

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current) return
    if (loadedPagesRef.current * FETCH_SIZE >= TOTAL_ITEMS) return
    isFetchingRef.current = true
    setIsFetching(true)
    const rows = await fetchPage(loadedPagesRef.current)
    setPages((prev) => [...prev, rows])
    loadedPagesRef.current += 1
    isFetchingRef.current = false
    setIsFetching(false)
  }, [])

  useEffect(() => {
    void loadMore()
  }, [loadMore])

  return { items, isFetching, loadMore }
}

const meta: Meta<typeof VirtualizedCardGrid> = {
  component: VirtualizedCardGrid,
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * `scroll: 'container'` — the grid scrolls inside its own capped box. Best when
 * the list should keep a fixed height regardless of how much data is loaded.
 */
export const containerScroll: Story = {
  render: () => {
    const { items, isFetching, loadMore } = useInfinitePages()
    return (
      <div className="flex-col-2">
        <div className="flex-row-2 items-center justify-between">
          <span className="typography-title-md">Container scroll</span>
          <span className="text-description typography-label-md">{`${items.length} of ${TOTAL_ITEMS} loaded`}</span>
        </div>
        <VirtualizedCardGrid<Item>
          items={items}
          getItemKey={(item) => item.id}
          minCardWidthPx={280}
          scroll="container"
          containerClassName="max-h-128 overflow-y-auto rounded-lg border border-divider p-2"
          onReachBottom={loadMore}
          renderItem={(item) => <ItemCard key={item.id} item={item} />}
        />
        {isFetching && (<span className="text-description typography-label-md">Fetching more…</span>)}
      </div>
    )
  },
}

/**
 * `scroll: 'page'` — the grid scrolls together with the nearest scrollable
 * ancestor (here the bordered box, in a real app the `AppPage` content area), so
 * the whole page expands and scrolls as one. The grid stays virtualized against
 * that outer scroll container.
 */
export const pageScroll: Story = {
  render: () => {
    const { items, isFetching, loadMore } = useInfinitePages()
    return (
      <div className="max-h-128 overflow-y-auto rounded-lg border border-divider p-4 flex-col-4">
        <div className="flex-row-2 items-center justify-between sticky top-0 bg-background py-2 z-10">
          <span className="typography-title-md">Page scroll (outer container)</span>
          <span className="text-description typography-label-md">{`${items.length} of ${TOTAL_ITEMS} loaded`}</span>
        </div>
        <p className="text-description typography-body-md">
          The heading and this paragraph scroll away with the grid — the grid does not own its
          own scroll box, it rides the outer scroll container.
        </p>
        <VirtualizedCardGrid<Item>
          items={items}
          getItemKey={(item) => item.id}
          minCardWidthPx={280}
          scroll="page"
          onReachBottom={loadMore}
          renderItem={(item) => <ItemCard key={item.id} item={item} />}
        />
        {isFetching && (<span className="text-description typography-label-md">Fetching more…</span>)}
      </div>
    )
  },
}

/**
 * Below `virtualizeThreshold` items the grid renders every card without
 * virtualization, so small lists stay simple and fully present in the DOM.
 */
export const smallListNotVirtualized: Story = {
  render: () => {
    const items = useMemo(() => allItems.slice(0, 12), [])
    return (
      <div className="flex-col-2">
        <span className="typography-title-md">Small list (not virtualized)</span>
        <VirtualizedCardGrid<Item>
          items={items}
          getItemKey={(item) => item.id}
          minCardWidthPx={280}
          renderItem={(item) => <ItemCard key={item.id} item={item} />}
        />
      </div>
    )
  },
}
