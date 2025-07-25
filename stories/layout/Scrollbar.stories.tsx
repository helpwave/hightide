import type { Meta, StoryObj } from '@storybook/nextjs'
import { ScrollArea } from '@/src/components/layout-and-navigation/ScrollArea'

const ScrollbarExample = ({ width, height }: { width: number, height: number }) => {
  return (
    <ScrollArea
      className="overflow-auto max-w-40 max-h-32"
    >
      <div className="bg-gray-300 rounded-lg" style={{ width, height }}/>
    </ScrollArea>
  )
}

const meta = {
  title: 'Layout',
  component: ScrollbarExample,
} satisfies Meta<typeof ScrollbarExample>

export default meta
type Story = StoryObj<typeof meta>;

export const scrollbar: Story = {
  args: {
    width: 500,
    height: 300,
  },
}
