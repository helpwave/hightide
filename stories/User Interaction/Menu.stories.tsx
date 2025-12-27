import type { Meta, StoryObj } from '@storybook/nextjs'
import { Menu, MenuItem } from '../../src/components/user-interaction/Menu'
import { action } from 'storybook/actions'
import { Button } from '../../src/components/user-interaction/Button'
import { range } from '../../src/utils/array'

const meta = {
  component: Menu<HTMLButtonElement>,
} satisfies Meta<typeof Menu<HTMLButtonElement>>

export default meta
type Story = StoryObj<typeof meta>;

export const menu: Story = {
  args: {
    alignmentHorizontal: 'leftInside',
    alignmentVertical: 'bottomOutside',
  },
  render: ({ ...props }) => {
    return (
      <div className="flex-row-0 justify-center items-center min-h-60">
        <Menu<HTMLButtonElement>
          {...props}
          trigger={({ toggleOpen, disabled }, ref) => {
            return (
              <Button ref={ref} onClick={toggleOpen} disabled={disabled}>
              Open Menu
              </Button>
            )
          }}
        >
          {({ close }) =>
            range([1, 6]).map((index) => (
              <MenuItem key={index} onClick={() => {
                close()
                action(`Clicked Item  ${index}`)()
              }}>{`Item ${index}`}</MenuItem>
            ))
          }
        </Menu>
      </div>
    )
  }
}
