import type { Meta, StoryObj } from '@storybook/nextjs'
import { SearchableList } from '../../src'

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
    itemMapper: value => <span>{value}</span>,
    className: '',
    overwriteTranslation: {},
  },
}
