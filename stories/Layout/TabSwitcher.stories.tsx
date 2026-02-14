import type { Meta, StoryObj } from '@storybook/nextjs'
import type { TabSwitcherProps } from '@/src/components/layout/TabSwitcher'
import { TabList, TabPanel, TabSwitcher } from '@/src/components/layout/TabSwitcher'
import { useState } from 'react'
import { Button } from '@/src'
import { action } from 'storybook/actions'


type StoryArgs = Omit<TabSwitcherProps, 'children'> & {
  disableTestTab: boolean,
  initallyShowRed: boolean,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

export const tabSwitcher: Story = {
  args: {
    disableTestTab: false,
    initallyShowRed: true,
    onActiveIdChange: action('onActiveIdChange')
  },
  render: ({ disableTestTab, initallyShowRed, ...args }) => {
    const [clicks, setClicks] = useState(1)
    return (
      <TabSwitcher {...args}>
        <TabList/>
        <TabPanel label="Custom">
          {'Customers'}
        </TabPanel>
        <TabPanel label="Test" disabled={disableTestTab}>
          {'Test'}
        </TabPanel>
        <TabPanel label={`Red (${clicks})`} initiallyActive={initallyShowRed}>
          <div className="w-full h-full bg-red-400 text-white">
            {`${clicks} Clicks`}
            <Button onClick={() => setClicks(prev => prev + 1)}>{'+1'}</Button>
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
