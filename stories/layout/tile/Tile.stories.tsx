import type { Meta, StoryObj } from '@storybook/nextjs'
import { Info, X } from 'lucide-react'
import type { TileProps } from '../../../src'
import { Tile } from '../../../src'
import { action } from 'storybook/actions'

type TileExampleProps = Omit<TileProps, 'prefix' | 'suffix' | 'onClick'> & {
  prefix: boolean,
  suffix: boolean,
  isClickable: boolean,
}

/**
 * An Example for using the tile
 */
const TileExample = ({
                       prefix,
                       suffix,
                       isClickable,
                       ...restProps
                     }: TileExampleProps) => {
  return (
    <Tile
      {...restProps}
      prefix={prefix ? <Info size={24}/> : undefined}
      suffix={suffix ? <X size={24}/> : undefined}
      onClick={!isClickable ? undefined : action('Click')}
    />
  )
}

const meta = {
  title: 'Layout/Tile',
  component: TileExample,
} satisfies Meta<typeof TileExample>

export default meta
type Story = StoryObj<typeof meta>;

export const tile: Story = {
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
