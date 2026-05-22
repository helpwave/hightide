import type { Meta, StoryObj } from '@storybook/nextjs'
import { useMemo, useState } from 'react'
import { ProcessModelCanvas } from '@/src/components/display-and-visualization/process-model/ProcessModelCanvas'
import {
  getProcessModelLibraryEntry,
  processModelLibrary
} from '@/src/components/display-and-visualization/process-model/processModelLibrary'
import { Select } from '@/src/components/user-interaction/Select/Select'
import { SelectOption } from '@/src/components/user-interaction/Select/SelectOption'

const meta: Meta<typeof ProcessModelCanvas> = {
  component: ProcessModelCanvas,
}

export default meta
type Story = StoryObj<typeof meta>;

export const processModelCanvas: Story = {
  render: () => {
    const [modelId, setModelId] = useState(processModelLibrary[0].id)
    const graph = useMemo(
      () => getProcessModelLibraryEntry(modelId)?.graph ?? processModelLibrary[0].graph,
      [modelId]
    )
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2 text-sm font-medium text-on-surface">
          <span>Example model</span>
          <Select
            value={modelId}
            onValueChange={setModelId}
            showSearch={false}
          >
            {processModelLibrary.map((entry) => (
              <SelectOption key={entry.id} value={entry.id} label={entry.name} />
            ))}
          </Select>
        </div>
        <ProcessModelCanvas graph={graph} />
      </div>
    )
  },
}

export const processModelCanvasHighlighted: Story = {
  render: () => (
    <ProcessModelCanvas
      graph={processModelLibrary[0].graph}
      activeNodeId="task-900"
      visitedNodeIds={new Set(['start', 'assign-1108'])}
    />
  ),
}
