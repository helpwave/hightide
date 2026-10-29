import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { MultiSelect } from '../../../../src/components/data-input/selection/MultiSelect/MultiSelect'
import type { MultiSelectProps } from '../../../../src/components/data-input/selection/MultiSelect/MultiSelectComponent'

const meta: Meta<typeof MultiSelect<User>> = {
  component: MultiSelect<User>,
}

export default meta
type Story = StoryObj<typeof meta>;

const fruitOptions = [
  { value: 'Apple', label: 'Apple' },
  { value: 'Banana', label: 'Banana', disabled: true },
  { value: 'Cherry', label: 'Cherry' },
  { value: 'Dragonfruit', label: 'Dragonfruit', className: '!text-red-400' },
  { value: 'Elderberry', label: 'Elderberry' },
  { value: 'Fig', label: 'Fig' },
  { value: 'Grapefruit', label: 'Grapefruit' },
  { value: 'Honeydew', label: 'Honeydew' },
  { value: 'Indianfig', label: 'Indianfig' },
  { value: 'Jackfruit', label: 'Jackfruit' },
  { value: 'Kiwifruit', label: 'Kiwifruit' },
  { value: 'Lemon', label: 'Lemon', disabled: true }
].sort((a, b) => a.value.localeCompare(b.value))

export const multiSelect: Story = {
  args: {
    initialValue: ['Apple', 'Cherry'],
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    children: fruitOptions.map((item, index) => (
      <MultiSelect.Option key={index} {...item} />
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

function compareUser(a: User, b: User): boolean {
  return a.uuid === b.uuid
}

export const multiSelectWithUser: Story = {
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
    placeholder: 'Select users',
    selectedDisplay: (values: User[]) => (
      <div className="flex flex-col gap-1">
        {values.map((user) => (
          <div key={user.uuid} className="flex flex-col">
            <span>{user.name}</span>
            <span className="text-description">{user.email}</span>
          </div>
        ))}
      </div>
    ),
    children: users.map((user) => (
      <MultiSelect.Option
        key={user.uuid}
        value={user}
        valueId={user.uuid}
        label={user.name}
      >
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-description">{user.email}</span>
        </div>
      </MultiSelect.Option>
    )),
  },
  render: (args: MultiSelectProps<User>) => {
    const [value, setValue] = useState<User[]>(args.value as User[] | undefined ?? [])

    useEffect(() => {
      setValue(args.value as User[] | undefined ?? [])
    }, [args.value])

    const initialValue = args.initialValue as User[] | undefined ?? []

    return (
      <MultiSelect<User>
        {...args}
        initialValue={initialValue}
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

export const multiSelectComposed: Story = {
  args: {
    initialValue: ['Apple', 'Cherry'],
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRequired: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
  render: (args: MultiSelectProps<User>) => (
    <MultiSelect.Root
      initialValue={args.initialValue}
      isDisabled={args.isDisabled}
      isInvalid={args.isInvalid}
      searchableThreshold={args.searchableThreshold}
      isReadOnly={args.isReadOnly}
      isRequired={args.isRequired}
      onValueChange={args.onValueChange}
      onStateEvent={args.onStateEvent}
    >
      <MultiSelect.Trigger placeholder="Select…" />
      <MultiSelect.Content>
        {fruitOptions.map((item, index) => (
          <MultiSelect.Option key={index} {...item} />
        ))}
      </MultiSelect.Content>
    </MultiSelect.Root>
  ),
}
