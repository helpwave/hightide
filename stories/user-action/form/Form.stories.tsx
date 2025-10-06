import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import type { StorybookHelperSelectType } from '../../../src/storybook/helper'
import { StorybookHelper } from '../../../src/storybook/helper'
import { useState } from 'react'
import { useTranslatedValidators } from '../../../src/hooks/useValidators'
import { FormElementWrapper } from '../../../src/components/form/FormElementWrapper'
import { Input } from '../../../src/components/user-action/input/Input'
import { MultiSelect, Select, SelectOption } from '../../../src/components/user-action/select/Select'
import { Textarea } from '../../../src/components/user-action/Textarea'

type FormValue = {
  name: string,
  email: string,
  favouriteFruit?: StorybookHelperSelectType,
  allergies: StorybookHelperSelectType[],
  contributions: StorybookHelperSelectType[],
  notes: string,
}

type FormExampleProps = {
  onChange?: (value: Partial<FormValue>) => void,
  disabled?: boolean,
  isTouched?: boolean,
}

const FormExample = ({
                       disabled,
                       isTouched,
                       onChange,
                     }: FormExampleProps) => {
  const validators = useTranslatedValidators()
  const [state, setState] = useState<FormValue>({
    name: '',
    email: '',
    favouriteFruit: undefined,
    allergies: StorybookHelper.selectValues.filter((value, index) => index === 5),
    contributions: [],
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
        required={true}
        disabled={disabled}
        isShowingError={isTouched}
        error={validators.notEmpty(state.name) ?? validators.length(state.name, [4, 32])}
        description="Your name will not be visible to others."
        label="Your name"
      >
        {({ isShowingError: _, setIsShowingError, ...properties }) => (
          <Input
            {...properties}
            value={state.name}
            onChangeText={name => {
              setStatePropagator({ name })
              setIsShowingError()
            }}
            placeholder="e.g. John Doe"
          />
        )}
      </FormElementWrapper>
      <FormElementWrapper
        required={true}
        disabled={disabled}
        isShowingError={isTouched}
        error={validators.notEmpty(state.email) ?? validators.email(state.email)}
        description="A email to contact you."
        label="Email"
      >
        {({ isShowingError: _, setIsShowingError, ...bag }) => (
          <Input
            {...bag}
            value={state.email}
            onChangeText={email => {
              setStatePropagator({ email })
              setIsShowingError()
            }}
            placeholder="e.g. test@helpwave.de"
          />
        )}
      </FormElementWrapper>
      <FormElementWrapper
        required={true}
        disabled={disabled}
        isShowingError={isTouched}
        error={validators.notEmpty(state.favouriteFruit)}
        description="We will use this to include as many likes as possible."
        label="Your favourite Fruit"
      >
        {({ setIsShowingError, ...bag }) => (
          <Select
            {...bag}
            value={state.favouriteFruit}
            onValueChanged={favouriteFruit => {
              setStatePropagator({ favouriteFruit: favouriteFruit as StorybookHelperSelectType })
              setIsShowingError()
            }}
            buttonProps={{ onClick: () => setIsShowingError() }}
          >
            {StorybookHelper.selectValues.map(value => (
              <SelectOption key={value} value={value}/>
            ))}
          </Select>
        )}
      </FormElementWrapper>
      <FormElementWrapper
        required={true}
        disabled={disabled}
        isShowingError={isTouched}
        description="Please specify which ingredients you are bringing."
        label="Your contribution"
        error={validators.notEmpty(state.contributions.length) ?? validators.selection(state.contributions, [2, 4])}
      >
        {({ isShowingError: _, setIsShowingError, ...bag }) => (
          <MultiSelect
            {...bag}
            values={state.contributions}
            onValuesChanged={contributions => {
              setStatePropagator({ contributions: contributions as StorybookHelperSelectType[] })
              setIsShowingError()
            }}
          >
            {StorybookHelper.selectValues.map(value => (
              <SelectOption key={value} value={value}/>
            ))}
          </MultiSelect>
        )}
      </FormElementWrapper>
      <FormElementWrapper
        disabled={disabled}
        isShowingError={isTouched}
        description="The ingredients you are allergic to."
        label="Allergies"
      >
        {(bag) => (
          <MultiSelect
            {...bag}
            values={state.allergies}
            onValuesChanged={allergies => setStatePropagator({ allergies: allergies as StorybookHelperSelectType[] })}
          >
            {StorybookHelper.selectValues.map(value => (
              <SelectOption key={value} value={value}/>
            ))}
          </MultiSelect>
        )}
      </FormElementWrapper>
      <FormElementWrapper
        disabled={disabled}
        isShowingError={isTouched}
        description="Anything else we should be aware of or you'd like us to know."
        label="Notes"
      >
        {({ isShowingError: _, setIsShowingError, ...bag }) => (
          <Textarea
            {...bag}
            placeholder="e.g. Please buy the delicious cranberry juice"
            value={state.notes}
            onChangeText={notes => {
              setStatePropagator({ notes })
              setIsShowingError()
            }}
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
    isTouched: false,
  },
}
