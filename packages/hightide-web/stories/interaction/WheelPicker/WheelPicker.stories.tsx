import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { range } from '@helpwave/hightide-utils/utils'

import { WheelPicker } from '../../../src/components/interaction/WheelPicker'

const meta = {
  component: WheelPicker<number>,
} satisfies Meta<typeof WheelPicker<number>>

export default meta
type Story = StoryObj<typeof meta>

export const wheelPicker: Story = {
  args: {
    disabled: false,
    visibleRows: 1,
  },
  render: function WheelPickerStory({ disabled, visibleRows }) {
    const [value, setValue] = useState(55)
    return (
      <WheelPicker value={value} onValueChange={setValue} disabled={disabled} visibleRows={visibleRows}>
        {range(60).map((item) => (
          <WheelPicker.Option key={item} value={item} valueId={String(item)}>
            {item}
          </WheelPicker.Option>
        ))}
      </WheelPicker>
    )
  },
}
