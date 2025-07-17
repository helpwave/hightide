import type { Meta, StoryObj } from '@storybook/nextjs'
import { Info, X } from 'lucide-react'
import type { ListTileProps } from '../../../src'
import { ListTile } from '../../../src'
import { action } from 'storybook/actions'

type ListTileExampleProps = Omit<ListTileProps, 'prefix' | 'suffix' | 'onClick'> & {
  prefix: boolean,
  suffix: boolean,
  isClickable: boolean,
}

/**
 * An Example for using the tile
 */
const ListTileExample = ({
                       prefix,
                       suffix,
                       isClickable,
                       ...restProps
                     }: ListTileExampleProps) => {
  return (
    <ListTile
      {...restProps}
      prefix={prefix ? <Info size={24}/> : undefined}
      suffix={suffix ? <X size={24}/> : undefined}
      onClick={!isClickable ? undefined : action('Click')}
    />
  )
}

const meta = {
  title: 'Layout/Tile',
  component: ListTileExample,
} satisfies Meta<typeof ListTileExample>

export default meta
type Story = StoryObj<typeof meta>;

export const listTile: Story = {
  args: {
    title: 'Title',
    description: 'Description Text',
    isClickable: true,
    disabled: false,
    isSelected: false,
    prefix: false,
    suffix: false,
  },
}
