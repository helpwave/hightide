import type { Meta, StoryObj } from '@storybook/nextjs'
import { Plus } from 'lucide-react'
import { action } from 'storybook/actions'
import { ProcessModelActivityNode } from '@/src/components/display-and-visualization/process-model/ProcessModelActivityNode'

const meta: Meta<typeof ProcessModelActivityNode> = {
  component: ProcessModelActivityNode,
}

export default meta
type Story = StoryObj<typeof meta>;

export const processModelActivityNode: Story = {
  args: {
    nodeId: 'demo-activity',
    label: 'Task added',
    count: '172',
    active: false,
    visited: false,
    className: '',
    customIcon: <Plus size={15} strokeWidth={2} className="process-model-activity-node-icon-svg" />,
    onClick: action('onClick'),
    onPointerEnter: action('onPointerEnter'),
    onPointerLeave: action('onPointerLeave'),
  },
  render: (args) => (
    <div className="inline-block rounded-2xl bg-surface p-6">
      <div className="min-h-[52px]">
        <ProcessModelActivityNode {...args} />
      </div>
    </div>
  ),
}
