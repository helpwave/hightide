import type { Meta, StoryObj } from '@storybook/nextjs'
import { TabList, TabPanel, TabSwitcher } from '../../src/components/layout/TabSwitcher'


const meta = {
  component: TabSwitcher,
} satisfies Meta<typeof TabSwitcher>

export default meta
type Story = StoryObj<typeof meta>;

export const tabSwitcher: Story = {
  args: {
    children: undefined
  },
  render: ({ ...args }) => {
    return (
      <TabSwitcher {...args}>
        <TabList/>
        <TabPanel label="Custom">
          {'Customers'}
        </TabPanel>
        <TabPanel label="Test">
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
