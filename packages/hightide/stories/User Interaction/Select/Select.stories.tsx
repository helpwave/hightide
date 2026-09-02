import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import { Select } from '../../../src/components/user-interaction/Select/Select'
import type { SelectProps } from '../../../src'
import type { SelectOptionType } from '../../../src/components/user-interaction/Select/SelectContext'

const meta: Meta<typeof Select<User>> = {
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
      <Select.Option key={index} {...item} />
    )),
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
    placeholder: 'Select a user',
    selectedDisplay: (option:  SelectOptionType<User> | null) => {
      if (!option) return null
      const user = option.value.value
      return (
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className=" text-description">{user.email}</span>
        </div>
      )
    },
    children: users.map((user) => (
      <Select.Option
        key={user.uuid}
        value={user}
        valueId={user.uuid}
        label={user.name}
      >
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className=" text-description">{user.email}</span>
        </div>
      </Select.Option>
    )),
  },
  render: (args: SelectProps<User>) => {
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

export const selectComposed: Story = {
  args: {
    initialValue: undefined,
    disabled: false,
    invalid: false,
    showSearch: false,
    readOnly: false,
    required: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: (args: SelectProps<User>) => (
    <Select.Root
      initialValue={args.initialValue}
      disabled={args.disabled}
      invalid={args.invalid}
      showSearch={args.showSearch}
      readOnly={args.readOnly}
      required={args.required}
      onValueChange={args.onValueChange}
      onEditComplete={args.onEditComplete}
    >
      <Select.Trigger placeholder="Select…" />
      <Select.Content>
        {fruitOptions.map((item, index) => (
          <Select.Option key={index} {...item} />
        ))}
      </Select.Content>
    </Select.Root>
  ),
}
