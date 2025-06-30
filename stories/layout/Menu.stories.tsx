import type { Meta, StoryObj } from '@storybook/nextjs'
import type { MenuProps } from '../../src'
import { Menu, MenuItem } from '../../src'
import { action } from 'storybook/actions'

type MenuExampleProps = Omit<MenuProps<HTMLButtonElement>, 'trigger' | 'children'>

const MenuExample = ({ alignment, menuClassName, showOnHover } : MenuExampleProps) => {
  return (
    <Menu<HTMLButtonElement>
      alignment={alignment}
      showOnHover={showOnHover}
      menuClassName={menuClassName}
      trigger={(onClick, ref) => (
        <button
          ref={ref}
          onClick={onClick}
          className="btn-md bg-primary text-on-primary"
        >
          Open
        </button>
      )}
    >
      <MenuItem onClick={action('Clicked Action 1')}>
        Action 1
      </MenuItem>
      <MenuItem onClick={action('Clicked Action 2')}>
        Action 2
      </MenuItem>
      <MenuItem onClick={action('Clicked Action 3')}>
        Action 3
      </MenuItem>
    </Menu>
  )
}

const meta = {
  title: 'Layout',
  component: MenuExample,
} satisfies Meta<typeof MenuExample>

export default meta
type Story = StoryObj<typeof meta>;

export const menu: Story = {
  args: {
    alignment: 'tl',
    showOnHover: true,
  },
}
