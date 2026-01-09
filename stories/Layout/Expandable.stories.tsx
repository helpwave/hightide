import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { ExpandableContent, ExpandableRoot, ExpandableHeader } from '@/src/components/layout/Expandable'
import { range } from '@/src/utils/array'

const meta = {
  component: ExpandableRoot,
} satisfies Meta<typeof ExpandableRoot>

export default meta
type Story = StoryObj<typeof meta>;

export const expandable: Story = {
  args: {
    isExpanded: false,
    disabled: false,
    allowContainerToggle: true,
    onChange: action('onChange'),
  },
  render: (args) => (
    <ExpandableRoot {...args}>
      <ExpandableHeader>
        {'Label'}
      </ExpandableHeader>
      <ExpandableContent className="expandable-content-h-40">
        {range(5).map((value) => (
          <div key={value}>{`Item ${value}`}</div>
        ))}
      </ExpandableContent>
    </ExpandableRoot>
  ),
}
