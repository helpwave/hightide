import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import { Select } from '@/src/components/user-interaction/Select/Select'
import { SelectOption } from '@/src/components/user-interaction/Select/SelectOption'

const meta: Meta<typeof Select> = {
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
    disabled: false,
    invalid: false,
    showSearch: false,
    readOnly: false,
    required: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    children: fruitOptions.map((item, index) => (
      <SelectOption key={index} {...item} />
    )),
  },
}

export interface User {
  uuid: string
  name: string
  email: string
}

const users: User[] = [
  { uuid: '1', name: 'Alice Chen', email: 'alice@example.com' },
  { uuid: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { uuid: '3', name: 'Carol Jones', email: 'carol@example.com' },
  { uuid: '4', name: 'David Lee', email: 'david@example.com' },
  { uuid: '5', name: 'Eve Wilson', email: 'eve@example.com' },
]

function compareUser(a: User | null, b: User | null): boolean {
  if (a === null || b === null) return a === b
  return a.uuid === b.uuid
}

export const selectWithUser: Story = {
  args: {
    value: undefined,
    initialValue: undefined,
    disabled: false,
    invalid: false,
    showSearch: true,
    readOnly: false,
    required: false,
    compareFunction: compareUser,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    buttonProps: {
      placeholder: 'Select a user',
      selectedDisplay: (option) => {
        if (!option) return null
        const user = option.value as User
        return (
          <div className="flex flex-col">
            <span>{user.name}</span>
            <span className="typography-body-sm text-description">{user.email}</span>
          </div>
        )
      },
    },
    children: users.map((user) => (
      <SelectOption
        key={user.uuid}
        id={user.uuid}
        value={user}
        label={user.name}
      >
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="typography-body-sm text-description">{user.email}</span>
        </div>
      </SelectOption>
    )),
  },
  render: (args) => {
    const [value, setValue] = useState<User | null>(args.value ?? null)
    useEffect(() => {
      setValue(args.value ?? null)
    }, [args.value])
    return (
      <Select<User>
        {...args}
        value={value}
        onValueChange={(v) => {
          args.onValueChange?.(v)
          setValue(v)
        }}
        onEditComplete={(v) => {
          args.onEditComplete?.(v)
          setValue(v)
        }}
      />
    )
  },
}
