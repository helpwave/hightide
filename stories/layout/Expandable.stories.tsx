import type { Meta, StoryObj } from '@storybook/nextjs'
import { ExpandableUncontrolled, range, Tile } from '../../src'
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
    contentExpandedClassName: 'overflow-y-hidden',
    children: (
      <div className="flex-col-2 overflow-y-auto">
        {range(20).map(value => (<Tile key={value} title={`Item ${value}`}/>))}
      </div>
    )
  },
}
