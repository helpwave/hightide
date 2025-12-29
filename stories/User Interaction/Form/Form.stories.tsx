import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import type { StorybookHelperSelectType } from '../../../src/storybook/helper'
import { StorybookHelper } from '../../../src/storybook/helper'
import { useTranslatedValidators } from '../../../src/hooks/useValidators'
import { Input } from '../../../src/components/user-interaction/input/Input'
import { MultiSelect, Select, SelectOption } from '../../../src/components/user-interaction/Select'
import { Textarea } from '../../../src/components/user-interaction/Textarea'
import { Button } from '../../../src/components/user-interaction/Button'
import { Form } from '../../../src/components/form/Form'
import { Visibility } from '../../../src/components/layout/Visibility'
import { HelpwaveLogo } from '../../../src/components/branding/HelpwaveLogo'
import { useEffect, useMemo, useState } from 'react'
import type { FormValidationBehaviour } from '../../../src/components/form/FormStore'
import { FormFieldWrapper } from '../../../src/components/form/FormFieldWrapper'
import { FormContext } from '../../../src/components/form/FormContext'

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
  validationBehaviour?: FormValidationBehaviour,
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

    return (
      <Form<FormValue>
        initialValues={{
          name: '',
          email: '',
          favouriteFruit: undefined,
          allergies: StorybookHelper.selectValues.filter((_, index) => index === 5),
          contributions: [],
          notes: '' ,
        }}
        validators={useMemo(() => ({
          name: (val) => validators.notEmpty(val) ?? validators.length(val, [4, 32]),
          email: (val) => validators.notEmpty(val) ?? validators.email(val),
          favouriteFruit: (val) => validators.notEmpty(val),
          contributions: (val) => validators.notEmpty(val?.length) ?? validators.selection(val, [2, 4]),
        }), [validators])}
        validationBehaviour={validationBehaviour}
        onFormSubmit={(finalValues) => {
          setState('sending')
          onSubmit?.(finalValues)
        }}
        onValueChange={onValueChange}
        className="flex-col-8 w-full max-w-128"
      >
        <span className="typography-title-lg">{'Fruit Salad Form'}</span>

        <Visibility isVisible={state !== 'submitted'}>
          <FormFieldWrapper
            name="name"
            required={true}
            description="Your name will not be visible to others."
            label="Your name"
          >
            <Input placeholder="e.g. John Doe" />
          </FormFieldWrapper>

          <FormFieldWrapper
            name="email"
            required={true}
            description="A email to contact you."
            label="Email"
          >
            <Input placeholder="e.g. test@helpwave.de" />
          </FormFieldWrapper>

          <FormFieldWrapper
            name="favouriteFruit"
            required={true}
            description="We will use this to include as many likes as possible."
            label="Your favourite Fruit"
          >
            <Select>
              {StorybookHelper.selectValues.map(value => (
                <SelectOption key={value} value={value}/>
              ))}
            </Select>
          </FormFieldWrapper>

          <FormFieldWrapper
            name="contributions"
            required={true}
            description="Please specify which ingredients you are bringing."
            label="Your contribution"
          >
            <MultiSelect>
              {StorybookHelper.selectValues.map(value => (
                <SelectOption key={value} value={value}/>
              ))}
            </MultiSelect>
          </FormFieldWrapper>

          <FormFieldWrapper
            name="allergies"
            description="The ingredients you are allergic to."
            label="Allergies"
          >
            <MultiSelect>
              {StorybookHelper.selectValues.map(value => (
                <SelectOption key={value} value={value}/>
              ))}
            </MultiSelect>
          </FormFieldWrapper>

          <FormFieldWrapper
            name="notes"
            description="Anything else we should be aware of or you'd like us to know."
            label="Notes"
          >
            <Textarea
              placeholder="e.g. Please buy the delicious cranberry juice"
            />
          </FormFieldWrapper>

          <FormContext.Consumer>
            {(context) => (
              <div className="flex gap-4 mt-4">
                <Button
                  color="negative"
                  onClick={context?.reset}
                >
                  {'Reset'}
                </Button>
                <Button
                  onClick={context?.submit}
                  disabled={state === 'sending'}
                >
                  {'Submit'}
                </Button>
              </div>
            )}
          </FormContext.Consumer>
        </Visibility>

        <Visibility isVisible={state === 'sending'}>
          <div className="flex-col-2 items-center">
            <HelpwaveLogo size="lg" animate="loading" />
            {'Sending'}
          </div>
        </Visibility>

        <Visibility isVisible={state === 'submitted'}>
          <span className="text-positive">
            {'Your Submission was sucessful'}
          </span>
          <FormContext.Consumer>
            {(context) => (
              <Button
                onClick={() => {
                  context?.store.reset()
                  setState('editing')
                }}
              >
                {'Next Submission'}
              </Button>
            )}
          </FormContext.Consumer>
        </Visibility>
      </Form>
    )
  }
}
