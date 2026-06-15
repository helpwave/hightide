import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useMemo, useState } from 'react'
import { ProcessModelTraceReplay } from '@/src/components/display-and-visualization/process-model/ProcessModelTraceReplay'
import {
  getProcessModelLibraryEntry,
  processModelLibrary
} from '@/src/components/display-and-visualization/process-model/processModelLibrary'
import type { ProcessModelGraphWithTraces } from '@/src/components/display-and-visualization/process-model/types'
import { Select } from '@/src/components/user-interaction/Select/Select'
import { SelectOption } from '@/src/components/user-interaction/Select/SelectOption'

const meta: Meta<typeof ProcessModelTraceReplay> = {
  component: ProcessModelTraceReplay,
}

export default meta
type Story = StoryObj<typeof meta>;

export const processModelTraceReplay: Story = {
  render: () => {
    const [modelId, setModelId] = useState(processModelLibrary[0].id)
    const graph = useMemo(() => {
      const g = getProcessModelLibraryEntry(modelId)?.graph
      return g as ProcessModelGraphWithTraces
    }, [modelId])
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full max-w-[900px] flex-row items-center gap-2 text-sm font-medium text-on-surface">
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
        <ProcessModelTraceReplay key={modelId} graph={graph} />
      </div>
    )
  },
}
