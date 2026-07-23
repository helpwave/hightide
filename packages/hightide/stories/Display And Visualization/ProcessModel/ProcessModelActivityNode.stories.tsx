import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Check, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { action } from 'storybook/actions'
import { ProcessModelActivityNode } from '../../../src/components/display-and-visualization/process-model/ProcessModelActivityNode'
import { processModelLibrary } from '../../../src/components/display-and-visualization/process-model/processModelLibrary'
import type { ProcessModelGraphActivityNode } from '../../../src/components/display-and-visualization/process-model/types'
import { Select } from '../../../src/components/user-interaction/Select/Select'
import { SelectOption } from '../../../src/components/user-interaction/Select/SelectOption'

type ActivityNodeExample = {
  id: string,
  nodeId: string,
  optionLabel: string,
  nodeLabel: string,
  count: string,
  activityIcon?: ProcessModelGraphActivityNode['activityIcon'],
}

const activityNodeExamples: ActivityNodeExample[] = processModelLibrary.flatMap((entry) =>
  entry.graph.nodes
    .filter((node): node is ProcessModelGraphActivityNode => node.type === 'activity')
    .map((node) => ({
      id: `${entry.id}:${node.id}`,
      nodeId: node.id,
      optionLabel: `${entry.name} — ${node.label}`,
      nodeLabel: node.label,
      count: node.count,
      activityIcon: node.activityIcon,
    })))

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
  render: (args) => {
    const [exampleId, setExampleId] = useState(activityNodeExamples[0].id)
    const example = useMemo(
      () => activityNodeExamples.find((item) => item.id === exampleId) ?? activityNodeExamples[0],
      [exampleId]
    )
    const customIcon = example.activityIcon === 'check'
      ? <Check size={15} strokeWidth={2} className="process-model-activity-node-icon-svg" />
      : <Plus size={15} strokeWidth={2} className="process-model-activity-node-icon-svg" />

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2 text-sm font-medium text-on-surface">
          <span>Example node</span>
          <Select
            value={exampleId}
            onValueChange={setExampleId}
            showSearch={false}
          >
            {activityNodeExamples.map((item) => (
              <SelectOption key={item.id} value={item.id} label={item.optionLabel} />
            ))}
          </Select>
        </div>
        <div className="inline-block rounded-2xl bg-surface p-6">
          <div className="min-h-[52px]">
            <ProcessModelActivityNode
              {...args}
              nodeId={example.nodeId}
              label={example.nodeLabel}
              count={example.count}
              customIcon={customIcon}
            />
          </div>
        </div>
      </div>
    )
  },
}
