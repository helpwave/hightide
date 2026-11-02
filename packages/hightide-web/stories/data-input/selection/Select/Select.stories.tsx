import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import { Select } from '../../../../src/components/data-input/selection/Select/Select'
import type { SelectProps } from '../../../../src/components/data-input/selection/Select/SelectComponent'
import type { SelectOptionData } from '../../../../src/components/data-input/selection/Select/SelectContext'

const meta: Meta<typeof Select<string>> = {
  component: Select,
}

export default meta
type Story = StoryObj<typeof meta>;

const fruitOptions = [
  { value: 'Apple', label: 'Apple' },
  { value: 'Pear', label: 'Pear', disabled: true },
  { value: 'Strawberry', label: 'Strawberry' },
  { value: 'Pineapple', label: 'Pineapple' },
  { value: 'Blackberry', label: 'Blackberry' },
  { value: 'Blueberry', label: 'Blueberry', disabled: true },
  { value: 'Banana', label: 'Banana' },
  { value: 'Kiwi', label: 'Kiwi', disabled: true },
  { value: 'Maracuja', label: 'Maracuja', disabled: true },
  { value: 'Wildberry', label: 'Wildberry', disabled: true },
  { value: 'Watermelon', label: 'Watermelon' },
  { value: 'Honeymelon', label: 'Honeymelon' },
  { value: 'Papja', label: 'Papja' }
].sort((a, b) => a.value.localeCompare(b.value))

export const select: Story = {
  args: {
    initialValue: undefined,
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    options: fruitOptions,
  },
}

export const controlledValue: Story = {
  args: {
    options: fruitOptions,
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
  render: function ControlledValue(args) {
    const [value, setValue] = useState('none')

    return (
      <Select
        {...args}
        value={value}
        onValueChange={(next) => {
          if(next === 'none') return
          args.onValueChange?.(next)
          setValue(next)
        }}
      />
    )
  },
}

export interface User {
  uuid: string,
  name: string,
  email: string,
}

const users: User[] = [
  { uuid: '1', name: 'Alice Chen', email: 'alice@example.com' },
  { uuid: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { uuid: '3', name: 'Carol Jones', email: 'carol@example.com' },
  { uuid: '4', name: 'David Lee', email: 'david@example.com' },
  { uuid: '5', name: 'Eve Wilson', email: 'eve@example.com' },
]

function compareUser(a: User, b: User): boolean {
  return a.uuid === b.uuid
}

export const selectWithUser: StoryObj<typeof Select<User>> = {
  args: {
    value: undefined,
    initialValue: undefined,
    isDisabled: false,
    isInvalid: false,
    searchableThreshold: 5,
    isReadOnly: false,
    isRequired: false,
    compareFunction: compareUser,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    placeholder: 'Select a user',
    selectedDisplay: (option: SelectOptionData<User> | null) => {
      if (!option) return null
      const user = option.value
      return (
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className=" text-description">{user.email}</span>
        </div>
      )
    },
    options: users.map((user) => ({
      id: user.uuid,
      value: user,
      label: user.name,
      visual: {
        content: (
          <div className="flex flex-col">
            <span>{user.name}</span>
            <span className=" text-description">{user.email}</span>
          </div>
        ),
      },
    })),
  },
  render: (args: SelectProps<User>) => {
    const [value, setValue] = useState<User | undefined>(args.value)
    useEffect(() => {
      setValue(args.value)
    }, [args.value])
    return (
      <Select<User>
        {...args}
        value={value}
        onValueChange={(v) => {
          args.onValueChange?.(v)
          setValue(v)
        }}
        onStateEvent={(event) => {
          args.onStateEvent?.(event)
          if (event.type === 'commit') setValue(event.value)
        }}
      />
    )
  },
}

export const selectComposed: Story = {
  args: {
    initialValue: undefined,
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
  render: (args: SelectProps<string>) => (
    <Select.StateManager
      options={fruitOptions}
      initialValue={args.initialValue}
      isDisabled={args.isDisabled}
      isInvalid={args.isInvalid}
      searchableThreshold={args.searchableThreshold}
      isReadOnly={args.isReadOnly}
      isRequired={args.isRequired}
      onValueChange={args.onValueChange}
      onStateEvent={args.onStateEvent}
    >
      <Select.Trigger placeholder="Select…" />
      <Select.PopUp>
        <Select.Searchbar />
        <Select.List />
      </Select.PopUp>
    </Select.StateManager>
  ),
}
