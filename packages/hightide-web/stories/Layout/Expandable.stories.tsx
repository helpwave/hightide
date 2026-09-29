import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ExpandableSection } from '../../src/components/layout/ExpandableSection'
import { range } from '@helpwave/hightide-utils/utils'

const meta = {
  component: ExpandableSection,
} satisfies Meta<typeof ExpandableSection>

export default meta
type Story = StoryObj<typeof meta>;

export const expandable: Story = {
  args: {
    trigger: 'Label',
    disabled: false,
    onExpandedChange: action('onExpandedChange'),
  },
  render: (args) => (
    <ExpandableSection {...args} contentProps={{ className: 'expandable-content-h-40' }}>
      {range(5).map((value) => (
        <div key={value}>{`Item ${value}`}</div>
      ))}
    </ExpandableSection>
  ),
}
