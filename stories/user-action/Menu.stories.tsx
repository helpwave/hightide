import type { Meta, StoryObj } from '@storybook/nextjs'
import type { MenuProps } from '../../src'
import { range } from '../../src'
import { Menu, MenuItem, SolidButton } from '../../src'
import { action } from 'storybook/actions'

type MenuExampleProps = Omit<MenuProps<HTMLDivElement>, 'trigger'>

const MenuExample = ({
                       ...props
                     }: MenuExampleProps) => {

  return (
    <div className="flex-row-0 justify-center items-center min-h-60">
      <Menu<HTMLButtonElement>
        {...props}
        trigger={(onClick, ref) => {
          return (
            <SolidButton ref={ref} onClick={onClick}>
              Open Menu
            </SolidButton>
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
