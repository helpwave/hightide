import type { Meta, StoryObj } from '@storybook/nextjs'
import type { MenuProps } from '../../src/components/user-action/Menu'
import { Menu, MenuItem } from '../../src/components/user-action/Menu'
import { action } from 'storybook/actions'
import { Button } from '../../src/components/user-action/Button'
import { range } from '../../src/utils/array'

type MenuExampleProps = Omit<MenuProps<HTMLDivElement>, 'trigger'>

const MenuExample = ({
                       ...props
                     }: MenuExampleProps) => {

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

const meta = {
  title: 'User Action',
  component: MenuExample,
} satisfies Meta<typeof MenuExample>

export default meta
type Story = StoryObj<typeof meta>;

export const menu: Story = {
  args: {
    alignmentHorizontal: 'leftInside',
    alignmentVertical: 'bottomOutside',
  },
}
