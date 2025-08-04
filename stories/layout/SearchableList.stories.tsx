import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { SearchableList } from '../../src/components/layout-and-navigation/SearchableList'

const meta = {
  title: 'Layout/SearchableList',
  component: SearchableList<string>,
} satisfies Meta<typeof SearchableList<string>>

export default meta
type Story = StoryObj<typeof meta>;

export const searchableList: Story = {
  args: {
    list: ['Apple', 'Banana', 'Pineapple', 'Pear', 'Strawberry', 'Raspberry', 'Wildberry'],
    initialSearch: '',
    searchMapping: value => [value],
    itemMapper: value => (
      <div key={value.index} onClick={action(`Clicked on ${value}`)}>
        {value.value}
      </div>
    ),
    minimumItemsForSearch: 5,
    overwriteTranslation: {},
  },
}
