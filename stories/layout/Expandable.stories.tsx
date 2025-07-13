import type { Meta, StoryObj } from '@storybook/nextjs'
import { ExpandableUncontrolled, Tile } from '../../src'
import { action } from 'storybook/actions'

const meta = {
  title: 'Layout',
  component: ExpandableUncontrolled,
} satisfies Meta<typeof ExpandableUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const expandable: Story = {
  args: {
    isExpanded: false,
    onChange: action('onChange'),
    disabled: false,
    clickOnlyOnHeader: true,
    label: (<h3 className="textstyle-label-lg">Label</h3>),
    children: (
      <div className="flex-col-2">
        <Tile title={{ value: 'Item 1' }}/>
        <Tile title={{ value: 'Item 2' }}/>
        <Tile title={{ value: 'Item 3' }}/>
      </div>
    )
  },
}
