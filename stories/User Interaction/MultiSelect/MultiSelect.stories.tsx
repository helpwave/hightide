import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { useEffect, useState } from 'react'
import { MultiSelect } from '@/src/components/user-interaction/MultiSelect/MultiSelect'
import { MultiSelectOption } from '@/src/components/user-interaction/MultiSelect/MultiSelectOption'

const meta: Meta<typeof MultiSelect> = {
  component: MultiSelect,
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
    disabled: false,
    invalid: false,
    showSearch: true,
    readOnly: false,
    required: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    children: fruitOptions.map((item, index) => (
      <MultiSelectOption key={index} {...item} />
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

function compareUser(a: User, b: User): boolean {
  return a.uuid === b.uuid
}

export const multiSelectWithUser: Story = {
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
      placeholder: 'Select users',
      selectedDisplay: (values: User[]) => (
        <div className="flex flex-col gap-1">
          {values.map((user) => (
            <div key={user.uuid} className="flex flex-col">
              <span>{user.name}</span>
              <span className="typography-body-sm text-description">{user.email}</span>
            </div>
          ))}
        </div>
      ),
    },
    children: users.map((user) => (
      <MultiSelectOption
        key={user.uuid}
        id={user.uuid}
        value={user}
        label={user.name}
      >
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="typography-body-sm text-description">{user.email}</span>
        </div>
      </MultiSelectOption>
    )),
  },
  render: (args) => {
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
        onEditComplete={(v) => {
          args.onEditComplete?.(v)
          setValue(v)
        }}
      />
    )
  },
}
