import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { range } from '@helpwave/hightide-utils/utils'
import { Button } from '../../src/components/interaction/Button'
import { Menu } from '../../src/components/interaction/Menu'

const meta = {
  component: Menu,
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const menu: Story = {
  args: {
    contentProps: {
      options: {
        horizontalAlignment: 'afterStart',
        verticalAlignment: 'afterEnd',
      },
      onOutsideClick: action('onOutsideClick'),
    },
    trigger: (bag) => (
      <Button ref={bag.ref} onClick={bag.onClick} disabled={bag.disabled}>
        Open Menu
      </Button>
    ),
    children: (
      <>
        {range([1, 6]).map((index) => (
          <Menu.Item
            key={index}
            title={`Item ${index}`}
            onClick={() => action(`Clicked Item ${index}`)()}
          />
        ))}
        <Menu.NavigationItem title="Docs" href="/docs" />
      </>
    ),
  },
  decorators: (Story) => {
    return (
      <div className="flex-row-0 justify-center items-center min-h-60">
        <Story/>
      </div>
    )
  },
}
