import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'
import { Checkbox, Switch, Text } from '../src'

const meta = {
  title: 'Components/Toggles',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Switches: Story = {
  render: () => {
    const [on, setOn] = useState(true)
    return (
      <View style={{ gap: 12 }}>
        <Switch value={on} onValueChange={setOn} />
        <Switch initialValue={false} size="sm" />
        <Switch initialValue disabled />
      </View>
    )
  },
}

export const Checkboxes: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Checkbox value={checked} onValueChange={setChecked} />
        <Checkbox indeterminate />
        <Checkbox initialValue={false} isRounded />
        <Checkbox initialValue disabled />
        <Text variant="bodyMd">checked / mixed / rounded / disabled</Text>
      </View>
    )
  },
}
