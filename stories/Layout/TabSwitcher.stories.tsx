import type { Meta, StoryObj } from '@storybook/nextjs'
import type { TabSwitcherProps } from '@/src/components/layout/TabSwitcher'
import { TabList, TabPanel, TabSwitcher } from '@/src/components/layout/TabSwitcher'


type StoryArgs = Omit<TabSwitcherProps, 'children'> & {
  disableTestTab: boolean,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

export const tabSwitcher: Story = {
  args: {
    disableTestTab: false,
  },
  render: ({ disableTestTab, ...args }) => {
    return (
      <TabSwitcher {...args}>
        <TabList/>
        <TabPanel label="Custom">
          {'Customers'}
        </TabPanel>
        <TabPanel label="Test" disabled={disableTestTab}>
          {'Test'}
        </TabPanel>
        <TabPanel label="Red">
          <div className="w-full h-full bg-red-400 text-white">
            {'Red'}
          </div>
        </TabPanel>
        <TabPanel label="Blue">
          <div className="w-full h-full bg-blue-400 text-white">
            {'Blue'}
          </div>
        </TabPanel>
      </TabSwitcher>
    )
  }
}
