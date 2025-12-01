import type { Meta, StoryObj } from '@storybook/nextjs'
import { Tab, TabView } from '../../src/components/layout/TabView'

const Example = () => {
  return (
    <TabView>
      <Tab label="Custom">
        {'Customers'}
      </Tab>
      <Tab label="Test">
        {'Test'}
      </Tab>
      <Tab label="Red">
        <div className="w-full h-full bg-red-400 text-white">
          {'Red'}
        </div>
      </Tab>
      <Tab label="Blue">
        <div className="w-full h-full bg-blue-400 text-white">
          {'Blue'}
        </div>
      </Tab>
    </TabView>
  )
}

const meta = {
  component: Example,
} satisfies Meta<typeof Example>

export default meta
type Story = StoryObj<typeof meta>;

export const tabView: Story = {
  args: {
  },
}
