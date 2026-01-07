import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import type { StorybookHelperSelectType } from '@/src/storybook/helper'
import { StorybookHelper } from '@/src/storybook/helper'
import { useTranslatedValidators } from '@/src/hooks/useValidators'
import { Input } from '@/src/components/user-interaction/input/Input'
import { MultiSelect, Select, SelectOption } from '@/src/components/user-interaction/Select'
import { Textarea } from '@/src/components/user-interaction/Textarea'
import { Button } from '@/src/components/user-interaction/Button'
import { useCreateForm } from '@/src/components/form/useCreateForm'
import { Visibility } from '@/src/components/layout/Visibility'
import { HelpwaveLogo } from '@/src/components/branding/HelpwaveLogo'
import { useEffect, useMemo, useState } from 'react'
import type { FormValidationBehaviour } from '@/src/components/form/FormStore'
import type { FormFieldDataHandling } from '@/src/components/form/FormField'
import { FormField } from '@/src/components/form/FormField'
import { FormProvider } from '@/src/components/form/FormContext'

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
  }) => {
    const validators = useTranslatedValidators()

    const [state, setState] = useState<FormState>('editing')
    useEffect(() => {
      if (state === 'sending') {
        setTimeout(() => setState('submitted'), 2000)
      }
    }, [state])

    const form = useCreateForm<FormValue>({
      initialValues: {
        name: '',
        email: '',
        favouriteFruit: undefined,
        allergies: StorybookHelper.selectValues.filter((_, index) => index === 5),
        contributions: [],
        notes: '',
      },
      validators: useMemo(() => ({
        name: (val) => validators.notEmpty(val) ?? validators.length(val, [4, 32]),
        email: (val) => validators.notEmpty(val) ?? validators.email(val),
        favouriteFruit: (val) => validators.notEmpty(val),
        contributions: (val) => validators.notEmpty(val?.length) ?? validators.selection(val, [2, 4]),
      }), [validators]),
      validationBehaviour: validationBehaviour,
      onFormSubmit: (finalValues) => {
        setState('sending')
        onSubmit?.(finalValues)
      },
      onValueChange: onValueChange
    })

    /*
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
    */

    return (
      <FormProvider state={form}>


        <form className="flex-col-8 w-full max-w-128" onSubmit={event => {
          event.preventDefault()
          form.submit()
        }}>
          <span className="typography-title-lg">{'Fruit Salad Form'}</span>

          <Visibility isVisible={state !== 'submitted'}>
            <FormField<FormValue, 'name'>
              name="name"
              required={true}
              description="Your name will not be visible to others."
              label="Your name"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <Input {...dataProps} {...focusableElementProps} {...interactionStates} placeholder="e.g. John Doe" />
              )}
            </FormField>

            <FormField<FormValue, 'email'>
              name="email"
              required={true}
              description="A email to contact you."
              label="Email"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <Input {...dataProps} {...focusableElementProps} {...interactionStates} placeholder="e.g. test@helpwave.de" />
              )}
            </FormField>

            <FormField<FormValue, 'favouriteFruit'>
              name="favouriteFruit"
              required={true}
              description="We will use this to include as many likes as possible."
              label="Your favourite Fruit"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <Select {...dataProps as FormFieldDataHandling<string>} {...focusableElementProps} {...interactionStates}>
                  {StorybookHelper.selectValues.map(value => (
                    <SelectOption key={value} value={value} />
                  ))}
                </Select>
              )}
            </FormField>

            <FormField<FormValue, 'contributions'>
              name="contributions"
              required={true}
              description="Please specify which ingredients you are bringing."
              label="Your contribution"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <MultiSelect {...dataProps as FormFieldDataHandling<string[]>} {...focusableElementProps} {...interactionStates}>
                  {StorybookHelper.selectValues.map(value => (
                    <SelectOption key={value} value={value} />
                  ))}
                </MultiSelect>
              )}
            </FormField>

            <FormField<FormValue, 'allergies'>
              name="allergies"
              description="The ingredients you are allergic to."
              label="Allergies"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <MultiSelect {...dataProps as FormFieldDataHandling<string[]>} {...focusableElementProps} {...interactionStates}>
                  {StorybookHelper.selectValues.map(value => (
                    <SelectOption key={value} value={value} />
                  ))}
                </MultiSelect>
              )}
            </FormField>

            <FormField<FormValue, 'notes'>
              name="notes"
              description="Anything else we should be aware of or you'd like us to know."
              label="Notes"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <Textarea
                  {...dataProps} {...focusableElementProps} {...interactionStates}
                  placeholder="e.g. Please buy the delicious cranberry juice"
                />
              )}
            </FormField>

            <div className="flex gap-4 mt-4">
              <Button
                color="negative"
                onClick={form.reset}
              >
                {'Reset'}
              </Button>
              <Button
                onClick={form.submit}
                disabled={state === 'sending'}
              >
                {'Submit'}
              </Button>
            </div>
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
            <Button
              onClick={() => {
                form.reset()
                setState('editing')
              }}
            >
              {'Next Submission'}
            </Button>
          </Visibility>
        </form>
      </FormProvider>
    )
  }
}
