import type { Meta, StoryObj } from '@storybook/nextjs'
import { Info, X } from 'lucide-react'
import type { TileProps } from '../../src'
import { Tile } from '../../src'

type TileExampleProps = Omit<TileProps, 'prefix' | 'suffix'> & {
  prefix: boolean,
  suffix: boolean,
}

/**
 * An Example for using the tile
 */
const TileExample = ({
                       prefix,
                       suffix,
                       ...restProps
                     }: TileExampleProps) => {
  return (
    <Tile
      {...restProps}
      prefix={prefix ? <Info size={20}/> : undefined}
      suffix={suffix ? <X size={20}/> : undefined}
    />
  )
}

const meta = {
  title: 'Layout',
  component: TileExample,
} satisfies Meta<typeof TileExample>

export default meta
type Story = StoryObj<typeof meta>;

export const tile: Story = {
  args: {
    title: { value: 'Title' },
    description: { value: 'Description Text', className: 'textstyle-description' },
    prefix: true,
    suffix: true,
    className: ''
  },
}
