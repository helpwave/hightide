import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import type { StorybookHelperSelectType } from '../../../src/storybook/helper'
import { StorybookHelper } from '../../../src/storybook/helper'
import { useTranslatedValidators } from '../../../src/hooks/useValidators'
import { FormElementWrapper } from '../../../src/components/form/FormElementWrapper'
import { Input } from '../../../src/components/user-interaction/input/Input'
import { MultiSelect, Select, SelectOption } from '../../../src/components/user-interaction/Select'
import { Textarea } from '../../../src/components/user-interaction/Textarea'
import { Button } from '../../../src/components/user-interaction/Button'
import type { ValidationBehaviour } from '../../../src/components/form/useForm'
import { useForm } from '../../../src/components/form/useForm'
import { Visibility } from '../../../src/components/layout/Visibility'
import { HelpwaveLogo } from '../../../src/components/branding/HelpwaveLogo'
import { useEffect, useState } from 'react'

type FormState = 'editing' | 'sending' | 'submitted'

type FormValue = {
  name?: string,
  email?: string,
  favouriteFruit?: StorybookHelperSelectType,
  allergies?: StorybookHelperSelectType[],
  contributions?: StorybookHelperSelectType[],
  notes?: string,
}

type StoryArgs = {
  onSubmit?: (value: FormValue) => void,
  onValueChange?: (value: FormValue) => void,
  disabled?: boolean,
  validationBehaviour?: ValidationBehaviour,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

export const basic: Story = {
  args: {
    onValueChange: action('onValueChange'),
    disabled: false,
    validationBehaviour: 'touched'
  },
  render: ({
    onValueChange,
    onSubmit,
    validationBehaviour,
  } ) => {
    const validators = useTranslatedValidators()

    const [state, setState] = useState<FormState>('editing')

    useEffect(() => {
      if(state === 'sending') {
        setTimeout(() => setState('submitted'), 2000)
      }
    }, [state])

    const {
      values,
      isInvalid,
      itemProps,
      submit,
      reset,
      registerRef
    } = useForm<FormValue>({
      initialValues: {
        name: '',
        email: '',
        favouriteFruit: undefined,
        allergies: StorybookHelper.selectValues.filter((_, index) => index === 5),
        contributions: [],
        notes: '' ,
      },
      validators: {
        name: (val) => validators.notEmpty(val) ?? validators.length(val, [4, 32]),
        email: (val) => validators.notEmpty(val) ?? validators.email(val),
        favouriteFruit: (val) => validators.notEmpty(val),
        contributions: (val) => validators.notEmpty(val?.length) ?? validators.selection(val, [2, 4]),
      },
      validationBehaviour,
      onSubmit: (finalValues) => {
        onSubmit?.(finalValues)
        setState('sending')
      },
    })

    // Sync state changes to Storybook actions
    useEffect(() => onValueChange?.(values), [values, onValueChange])

    return (
      <>
        <Visibility isVisible={state !== 'submitted'}>
          <form className="flex-col-8 w-full max-w-128">
            <span className="typography-title-lg">{'Fruit Salad Form'}</span>

            <FormElementWrapper
              required={true}
              description="Your name will not be visible to others."
              label="Your name"
              {...itemProps.name}
            >
              <Input
                ref={registerRef('name')}
                placeholder="e.g. John Doe"
              />
            </FormElementWrapper>

            <FormElementWrapper
              required={true}
              description="A email to contact you."
              label="Email"
              {...itemProps.email}
            >
              <Input
                ref={registerRef('email')}
                placeholder="e.g. test@helpwave.de"
              />
            </FormElementWrapper>

            <FormElementWrapper
              required={true}
              description="We will use this to include as many likes as possible."
              label="Your favourite Fruit"
              {...itemProps.favouriteFruit}
            >
              <Select ref={registerRef('favouriteFruit')}>
                {StorybookHelper.selectValues.map(value => (
                  <SelectOption key={value} value={value}/>
                ))}
              </Select>
            </FormElementWrapper>

            <FormElementWrapper
              required={true}
              description="Please specify which ingredients you are bringing."
              label="Your contribution"
              {...itemProps.contributions}
            >
              <MultiSelect
                ref={registerRef('contributions')}
              >
                {StorybookHelper.selectValues.map(value => (
                  <SelectOption key={value} value={value}/>
                ))}
              </MultiSelect>
            </FormElementWrapper>

            <FormElementWrapper
              description="The ingredients you are allergic to."
              label="Allergies"
              {...itemProps.allergies}
            >
              <MultiSelect ref={registerRef('allergies')}>
                {StorybookHelper.selectValues.map(value => (
                  <SelectOption key={value} value={value}/>
                ))}
              </MultiSelect>
            </FormElementWrapper>

            <FormElementWrapper
              description="Anything else we should be aware of or you'd like us to know."
              label="Notes"
              {...itemProps.notes}
            >
              <Textarea
                ref={registerRef('notes')}
                placeholder="e.g. Please buy the delicious cranberry juice"
              />
            </FormElementWrapper>

            <Visibility isVisible={state === 'sending'}>
              <div className="flex-col-2 items-center">
                <HelpwaveLogo size="lg" animate="loading" />
                {'Sending'}
              </div>
            </Visibility>

            <Visibility isVisible={isInvalid}>
              <span className="text-negative">{'There are errors'}</span>
            </Visibility>

            <div className="flex gap-4 mt-4">
              <Button
                color="negative"
                onClick={reset}
              >
                {'Reset'}
              </Button>
              <Button
                onClick={submit}
                disabled={state === 'sending'}
              >
                {'Submit'}
              </Button>
            </div>
          </form>
        </Visibility>
        <Visibility isVisible={state === 'submitted'}>
          <span className="text-positive">
            {'Your Submission was sucessful'}
          </span>
          <Button
            onClick={() => {
              reset()
              setState('editing')
            }}
          >
            {'Next Submission'}
          </Button>
        </Visibility>
      </>
    )
  }
}