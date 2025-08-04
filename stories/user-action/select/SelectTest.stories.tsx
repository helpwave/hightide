import type { Meta, StoryObj } from '@storybook/nextjs'
import { Select } from 'radix-ui'
import { useMemo, useState } from 'react'
import { range } from '../../../src/utils/array'
import { faker } from '@faker-js/faker'
import { CheckIcon, ChevronDown } from 'lucide-react'
import { Input } from '../../../src/components/user-action/input/Input'

const SelectTest = () => {
  const [selected, setSelected] = useState<string>('')

  const options = useMemo(() => {
    return range(100).map(() => faker.person.fullName()).sort((a, b) => a.localeCompare(b))
  }, [])

  console.log(selected)

  return (
    <>
      <Select.Root value={selected} onValueChange={setSelected}>
        <Select.Trigger className="flex-row-2 px-2 py-1 bg-menu-background text-menu-text rounded-md">
          <Select.Value placeholder="Select something..."/>
          <Select.Icon>
            <ChevronDown/>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            align="end"
            position="popper"
            className="flex-col-2 p-2 rounded-md shadow-hw-bottom bg-menu-background text-menu-text"
          >
            <Input></Input>
            <Select.ScrollUpButton />
            <Select.Viewport className="max-h-128">
              {options.map((item) => (
                <Select.Item
                  key={item}
                  value={item}
                  className="flex-row-2 py-1 px-2 items-center"
                >
                  <Select.ItemIndicator>
                    {item === selected && <CheckIcon/>}
                  </Select.ItemIndicator>
                  <Select.ItemText>
                    {item}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton/>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>

  )
}

const meta = {
  title: 'User Action/Select',
  component: SelectTest,
} satisfies Meta<typeof SelectTest>

export default meta
type Story = StoryObj<typeof meta>;

export const test: Story = {
  args: {},
}
