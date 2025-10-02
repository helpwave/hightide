import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import type { StorybookHelperSelectType } from '../../../src/storybook/helper'
import { StorybookHelper } from '../../../src/storybook/helper'
import { useState } from 'react'
import { FormElementWrapper, Input, MultiSelect, Select, SelectOption, Textarea } from '../../../src'
import { useTranslatedValidators } from '../../../src/hooks/useValidators'

type FormValue = {
  name: string,
  email: string,
  favouriteFruit?: StorybookHelperSelectType,
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
  const validators = useTranslatedValidators()
  const [state, setState] = useState<FormValue>({
    name: '',
    email: '',
    favouriteFruit: undefined,
    allergies: StorybookHelper.selectValues.filter((value, index) => index === 5),
    notes: '',
  })

  const setStatePropagator = (value: Partial<FormValue>) => {
    onChange(value)
    setState(prevState => ({ ...prevState, ...value }))
  }

  return (
    <div className="flex-col-8 w-full max-w-128">
      <span className="typography-title-lg">{'Fruit Salad Form'}</span>
      <FormElementWrapper
        disabled={disabled}
        required={true}
        error={validators.notEmpty(state.name) ?? validators.length(state.name, [4, 32])}
        description="Your name will not be visible to others."
        label="Your name"
      >
        {({ onTouched, ...bag }) => (
          <Input
            {...bag}
            value={state.name}
            onChangeText={name => {
              setStatePropagator({ name })
              onTouched()
            }}
            placeholder="e.g. John Doe"
          />
        )}
      </FormElementWrapper>
      <FormElementWrapper
        disabled={disabled}
        required={true}
        error={validators.notEmpty(state.email) ?? validators.email(state.email)}
        description="A email to contact you."
        label="Email"
      >
        {({ onTouched, ...bag }) => (
          <Input
            {...bag}
            value={state.email}
            onChangeText={email => {
              setStatePropagator({ email })
              onTouched()
            }}
            placeholder="e.g. test@helpwave.de"
          />
        )}
      </FormElementWrapper>
      <FormElementWrapper
        disabled={disabled}
        required={true}
        error={validators.notEmpty(state.favouriteFruit)}
        description="We will use this to include as many likes as possible."
        label="Your favourite Fruit"
      >
        {({ onTouched, ...bag }) => (
          <Select
            {...bag}
            value={state.favouriteFruit}
            onValueChanged={favouriteFruit => {
              setStatePropagator({ favouriteFruit: favouriteFruit as StorybookHelperSelectType })
              onTouched()
            }}
            buttonProps={{ onClick: () => onTouched() }}
          >
            {StorybookHelper.selectValues.map(value => (
              <SelectOption key={value} value={value}/>
            ))}
          </Select>
        )}
      </FormElementWrapper>
      <FormElementWrapper
        disabled={disabled}
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
        description="Anything else we should be aware of or you'd like us to know."
        label="Notes"
      >
        {(bag) => (
          <Textarea
            {...bag}
            placeholder="e.g. Please buy the delicious cranberry juice"
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
