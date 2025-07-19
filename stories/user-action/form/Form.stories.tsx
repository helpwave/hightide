import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
// @ts-ignore
import type { StorybookHelperSelectType } from '../../helper'
import { StorybookHelper } from '../../helper'
import type { MultiSelectOption } from '../../../src'
import { MultiSelect } from '../../../src'
import { Select } from '../../../src'
import { Textarea } from '../../../src'
import { useState } from 'react'
import { Input } from '../../../src'

type FormValue = {
  name: string,
  favouriteFruit: StorybookHelperSelectType,
  allergies: MultiSelectOption<StorybookHelperSelectType>[],
  notes: string,
}

type FormExampleProps = {
  onChange?: (value: Partial<FormValue>) => void,
  disabled?: boolean,
}

const FormExample = ({
  disabled,
  onChange,
}: FormExampleProps) => {
  const [state, setState] = useState<FormValue>({
    name: 'John Doe',
    favouriteFruit: 'Strawberry',
    allergies: StorybookHelper.selectValues.map(value => ({
      value,
      label: value,
      searchTags: [value],
      selected: value === 'Mango'
    })),
    notes: 'I don\'t like pineapple',
  })

  const setStatePropagator = (value: Partial<FormValue>) => {
    onChange(value)
    setState(prevState => ({ ...prevState, ...value }))
  }

  return (
    <div className="flex-col-2 w-full">
      <h4 className="textstyle-title-lg">{'Fruit Salad Form'}</h4>
      <Input
        value={state.name}
        onChangeText={name => setStatePropagator({ name })}
        disabled={disabled}
        label={{ name: 'Your name' }}
      />
      <Select<StorybookHelperSelectType>
        value={state.favouriteFruit}
        options={StorybookHelper.selectValues.map(value => ({
          value,
          label: value,
          searchTags: [value]
        }))}
        onChange={favouriteFruit => setStatePropagator({ favouriteFruit })}
        disabled={disabled}
        label={{ name: 'Your favourite Fruit' }}
      />
      <MultiSelect<StorybookHelperSelectType>
        options={state.allergies}
        onChange={allergies => setStatePropagator({ allergies })}
        disabled={disabled}
        label={{ name: 'Allergies' }}
      />
      <Textarea
        value={state.notes}
        onChangeText={notes => setStatePropagator({ notes })}
        disabled={disabled}
        label={{ name: 'Addtional Notes' }}
      />
    </div>
  )
}

const meta = {
  title: 'User Action/Form',
  component: FormExample,
} satisfies Meta<typeof FormExample>

export default meta
type Story = StoryObj<typeof meta>;

export const basic: Story = {
  args: {
    onChange: action('onChange'),
    disabled: false,
  },
}
