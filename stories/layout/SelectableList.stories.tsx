import type { Meta, StoryObj } from '@storybook/nextjs'
import { ArrayUtil, range, SelectableList, useSearch } from '../../src'
import { useCallback, useMemo, useState } from 'react'
import { faker } from '@faker-js/faker'
import { action } from 'storybook/actions'
import { CheckIcon } from 'lucide-react'
import { Input } from '@/src'

const fullOptions = range(20).map(() => faker.string.uuid()).map((value, index) => ({
  id: value,
  label: value,
  searchTags: [value],
  disabled: index % 4 === 0,
}))

console.log(range(20), ArrayUtil.moveItems(range(20), -4))

const SelectableListExample = () => {
  const [state, setState] = useState<string>()
  const [selected, setSelected] = useState<string>()

  const options = useMemo(() =>
    fullOptions.map((option) => ({
      ...option,
      label: (
        <div className="flex-row-2 items-center px-2 py-1">
          <div className="min-w-6 min-h-6 max-w-6 max-h-6">
            {selected === option.id && (<CheckIcon className="h-full w-full"/>)}
          </div>
          {option.label}
        </div>
      ),
    })), [selected])

  const { result, search, setSearch } = useSearch({
    list: options,
    searchMapping: item => item.searchTags,
    sortingFunction: (a, b) => a.id.localeCompare(b.id),
  })

  return (
    <div className="flex-col-2">
      <Input value={search} onChangeText={setSearch} autoFocus={true}/>
      <SelectableList
        highlightedId={state}
        onHighlightedChange={value => {
          setState(value)
          action('change')(value)
        }}
        onSelected={(id) => {
          action('onSelected')(id)
          setSelected(id)
        }}
        items={result}
      />
    </div>
  )
}


const meta = {
  title: 'Layout/SearchableList',
  component: SelectableListExample,
} satisfies Meta<typeof SelectableListExample>

export default meta
type Story = StoryObj<typeof meta>;

export const selectableList: Story = {
  args: {},
}
