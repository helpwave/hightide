import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TabSwitcherProps } from '../../src/components/layout/TabSwitcher'
import { TabSwitcher } from '../../src/components/layout/TabSwitcher'
import { useState } from 'react'
import { Button } from '../../src/components/interaction/Button'
import { action } from 'storybook/actions'


type StoryArgs = Omit<TabSwitcherProps, 'children'> & {
  disableTestTab: boolean,
  initallyShowRed: boolean,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

const renderTabs: Story['render'] = ({ disableTestTab, initallyShowRed, ...args }) => {
  const [clicks, setClicks] = useState(1)
  return (
    <TabSwitcher {...args}>
      <TabSwitcher.TabList />
      <TabSwitcher.TabPanel label="Custom">
        {'Customers'}
      </TabSwitcher.TabPanel>
      <TabSwitcher.TabPanel label="Test" disabled={disableTestTab}>
        {'Test'}
      </TabSwitcher.TabPanel>
      <TabSwitcher.TabPanel label={`Red (${clicks})`} initiallyActive={initallyShowRed}>
        <div className="w-full h-full bg-red-400 text-white">
          {`${clicks} Clicks`}
          <Button onClick={() => setClicks(prev => prev + 1)}>{'+1'}</Button>
        </div>
      </TabSwitcher.TabPanel>
      <TabSwitcher.TabPanel label="Blue">
        <div className="w-full h-full bg-blue-400 text-white">
          {'Blue'}
        </div>
      </TabSwitcher.TabPanel>
    </TabSwitcher>
  )
}

export const tabSwitcher: Story = {
  args: {
    disableTestTab: false,
    initallyShowRed: true,
    variant: 'underline',
    onActiveIdChange: action('onActiveIdChange')
  },
  render: renderTabs,
}

export const segmentedChips: Story = {
  args: {
    disableTestTab: false,
    initallyShowRed: true,
    variant: 'segmented-chips',
    onActiveIdChange: action('onActiveIdChange')
  },
  render: renderTabs,
}
