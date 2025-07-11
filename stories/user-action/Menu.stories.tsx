import type { Meta, StoryObj } from '@storybook/nextjs'
import type { MenuProps } from '../../src'
import { Menu, MenuItem, SolidButton } from '../../src'

type MenuExampleProps = Omit<MenuProps<HTMLDivElement>, 'trigger'>

const MenuExample = ({
                       ...props
                     }: MenuExampleProps) => {

  return (
    <Menu<HTMLDivElement>
      {...props}
      trigger={(onClick, ref) => {
        return (
          <SolidButton ref={ref} onClick={onClick}>
            Open Menu
          </SolidButton>
        )
      }}
    >
      <MenuItem>Item 1</MenuItem>
      <MenuItem>Item 2</MenuItem>
      <MenuItem>Item 3</MenuItem>
      <MenuItem>Item 4</MenuItem>
      <MenuItem>Item 5</MenuItem>
    </Menu>
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
    alignmentHorizontal: 'e',
    alignmentVertical: 'b'
  },
}
