import type { Meta, StoryObj } from '@storybook/nextjs'
import { Expandable, Tile } from '../../src'

const meta = {
  title: 'Layout',
  component: Expandable,
} satisfies Meta<typeof Expandable>

export default meta
type Story = StoryObj<typeof meta>;

export const expandable: Story = {
  args: {
    initialExpansion: false,
    disabled: false,
    clickOnlyOnHeader: true,
    label: (<h3 className="textstyle-label-lg">Label</h3>),
    children: (
      <div className="col">
        <Tile title={{ value: 'Item 1' }}/>
        <Tile title={{ value: 'Item 2' }}/>
        <Tile title={{ value: 'Item 3' }}/>
      </div>
    )
  },
}
