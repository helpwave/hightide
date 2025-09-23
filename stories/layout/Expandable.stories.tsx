import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { ExpandableUncontrolled } from '../../src/components/layout-and-navigation/Expandable'
import { range } from '../../src/utils/array'

const meta = {
  title: 'Layout',
  component: ExpandableUncontrolled,
} satisfies Meta<typeof ExpandableUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const expandable: Story = {
  args: {
    isExpanded: false,
    disabled: false,
    clickOnlyOnHeader: true,
    label: (<span className="typography-label-lg">Label</span>),
    contentExpandedClassName: 'overflow-y-hidden',
    children: (
      <div className="flex-col-2 overflow-y-auto">
        {range(20).map(value => (<div  key={value}>{`Item ${value}`}</div>))}
      </div>
    ),
    onChange: action('onChange'),
  },
}
