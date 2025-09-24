import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import type { StorybookHelperSelectType } from '../../../src/storybook/helper'
import { StorybookHelper } from '../../../src/storybook/helper'
import { useState } from 'react'
import { MultiSelect, Select, SelectOption } from '../../../src/components/user-action/select/Select'
import { FormElementWrapper } from '../../../src/components/form/FormElementWrapper'
import { Input } from '../../../src/components/user-action/input/Input'
import { Textarea } from '../../../src/components/user-action/Textarea'

type FormValue = {
  name: string,
  favouriteFruit: StorybookHelperSelectType,
  allergies: string[],
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
    allergies: StorybookHelper.selectValues.filter((value, index) => index === 5),
    notes: 'I don\'t like pineapple',
  })

  const setStatePropagator = (value: Partial<FormValue>) => {
    onChange(value)
    setState(prevState => ({ ...prevState, ...value }))
  }

  const requiredValidator = (value: string) => {
    if (!value) {
      return 'This field is required'
    }
    return undefined
  }

  const lengthValidator = (value: string | undefined, length: [number | undefined, number | undefined]) => {
    const [min, max] = length

    if (min !== undefined && (!value || value.length < min)) {
      return `Must be at least ${min} characters long.`
    }

    if (max !== undefined && value && value.length > max) {
      return `Must be at most ${max} characters long.`
    }

    return undefined
  }


  return (
    <div className="flex-col-4 w-full">
      <span className="typography-title-sm">{'Fruit Salad Form'}</span>
      <FormElementWrapper
        disabled={disabled}
        required={true}
        error={requiredValidator(state.name) ?? lengthValidator(state.name, [4, 32])}
        description="Your name will not be visible to others."
        label="Your name"
      >
        {(bag) => (
          <Input
            {...bag}
            value={state.name}
            onChangeText={name => setStatePropagator({ name })}
          />
        )}
      </FormElementWrapper>
      <FormElementWrapper
        disabled={disabled}
        required={true}
        error={requiredValidator(state.favouriteFruit)}
        description="We will use this to include as many likes as possible."
        label="Your favourite Fruit"
      >
        {(bag) => (
          <Select
            {...bag}
            value={state.favouriteFruit}
            onValueChanged={favouriteFruit => setStatePropagator({ favouriteFruit: favouriteFruit as StorybookHelperSelectType })}
          >
            {StorybookHelper.selectValues.map(value => (
              <SelectOption key={value} value={value}/>
            ))}
          </Select>
        )}
      </FormElementWrapper>
      <FormElementWrapper
        disabled={disabled}
        required={false}
        description="The ingredients you are allergic to."
        label="Allergies"
      >
        {(bag) => (
          <MultiSelect
            {...bag}
            values={state.allergies}
            onValuesChanged={allergies => setStatePropagator({ allergies })}
          >
            {StorybookHelper.selectValues.map(value => (
              <SelectOption key={value} value={value}/>
            ))}
          </MultiSelect>
        )}
      </FormElementWrapper>
      <FormElementWrapper
        disabled={disabled}
        required={false}
        description="Anything else we should be aware of."
        label="Notes"
      >
        {(bag) => (
          <Textarea
            {...bag}
            value={state.notes}
            onChangeText={notes => setStatePropagator({ notes })}
          />
        )}
      </FormElementWrapper>
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
