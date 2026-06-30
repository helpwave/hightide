import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { Drawer } from '@/src/components/layout/drawer/Drawer'
import { Button } from '@/src/components/user-interaction/Button'


const meta: Meta = {
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>;

export const drawer: Story = {
  args: {
    isOpen: true,
    alignment: 'left',
    titleElement: 'This is the Title',
    description: 'Some descriptive Text',

    children: (
      <div className="flex-col-2 w-full min-h-1000 bg-faded rounded-lg">
      </div>
    ),

    footer: (
      <div className="flex-row-2 w-full">
        <Button>
          {'Do something'}
        </Button>
      </div>
    ),

    forceMount: false,
    onClose: action('onClose'),
    noScrolling: false
  },
  render: ({ children, noScrolling, ...args }) => {
    return (
      <Drawer {...args} noScrolling={noScrolling}>
        {!noScrolling ? children : (
          <div className="h-full overflow-auto">
            {children}
          </div>
        )}
      </Drawer>
    )
  }
}
