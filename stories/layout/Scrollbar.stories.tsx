import type { Meta, StoryObj } from '@storybook/nextjs'
import { ScrollArea } from '@/src/components/layout-and-navigation/ScrollArea'
import { action } from 'storybook/actions'
import type { ScrollAreaProps } from '../../src/components/layout-and-navigation/ScrollArea'
import { range } from '../../src/utils/array'

const ScrollbarExample = ({
                            ...props
                          }: ScrollAreaProps) => {
  return (
    <div className="flex-row-4">
      <ScrollArea
        {...props}
        className="overflow-auto max-w-60 min-w-40 max-h-32"
      >
        <div className="flex-col-1">
          {range(500).map((index) => (
            <button
              key={index}
              onClick={action(`Clicked Item ${index}`)}
              className="hover:bg-primary/20 focus:bg-primary/20 rounded-md mx-1 first:mt-1 mb-1"
            >
              {`Item ${index}`}
            </button>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea
        {...props}
        className="overflow-auto max-w-40 max-h-32"
      >
        <div className="flex-row-2 p-2">
          {range(20).map((index) => (
            <button key={index} onClick={action(`Clicked Item ${index}`)}>
              {`Item ${index}`}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
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
    scrollbarSize: 'md',
    scrollbarType: 'auto',
    scrollbarAxis: 'both',
  },
}
