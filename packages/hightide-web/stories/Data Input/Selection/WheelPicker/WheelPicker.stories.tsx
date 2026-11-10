import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { range } from '@helpwave/hightide-utils/utils'

import { WheelPicker } from '../../../../src/components/data-input/selection/WheelPicker'

const meta = {
  component: WheelPicker<number>,
} satisfies Meta<typeof WheelPicker<number>>

export default meta
type Story = StoryObj<typeof meta>

export const wheelPicker: Story = {
  args: {
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: false,
    isLooping: false,
    visibleRows: 1,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    onLoop: action('onLoop'),
  },
  render: function WheelPickerStory({
    isDisabled,
    isInvalid,
    isReadOnly,
    isRequired,
    isLooping,
    visibleRows,
    onValueChange,
    onStateEvent,
    onLoop,
  }) {
    const [value, setValue] = useState(55)
    return (
      <WheelPicker
        value={value}
        onValueChange={(next) => {
          setValue(next ?? 0)
          onValueChange?.(next)
        }}
        onStateEvent={onStateEvent}
        onLoop={onLoop}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isLooping={isLooping}
        visibleRows={visibleRows}
      >
        {range(60).map((item) => (
          <WheelPicker.Option key={item} value={item} valueId={String(item)}>
            {item}
          </WheelPicker.Option>
        ))}
      </WheelPicker>
    )
  },
}
