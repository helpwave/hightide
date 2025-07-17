import type { Meta, StoryObj } from '@storybook/nextjs'
import { ListTile, SearchableList } from '../../src'
import { action } from 'storybook/actions'

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
      <ListTile title={value} onClick={action(`Clicked on ${value}`)}/>
    ),
    minimumItemsForSearch: 5,
    overwriteTranslation: {},
  },
}
