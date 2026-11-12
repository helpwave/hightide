import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import type { FormFieldStateRule, FormValidator } from '@helpwave/hightide-utils/form'
import { FormValidationUtils } from '@helpwave/hightide-utils/utils'
import type { StorybookHelperSelectType } from '../../src/storybook/helper'
import { StorybookHelper } from '../../src/storybook/helper'
import { Button } from '../../src/components/interaction/Button'
import { Visibility } from '../../src/components/layout/Visibility'
import { HelpwaveLogo } from '../../src/components/branding/visualization/HelpwaveLogo'
import { FormInputField } from '../../src/components/form/data-input'
import { Form, useForm } from '../../src/components/form/Form'
import { useEffect, useRef, useState } from 'react'

type FormState = 'editing' | 'sending' | 'submitted'

type FormValue = {
  name?: string,
  email?: string,
  favouriteFruit?: StorybookHelperSelectType,
  allergies?: StorybookHelperSelectType[],
  contributions?: StorybookHelperSelectType[],
  notes?: string,
  preferredDate: Date | null,
}

type StoryArgs = {
  onSubmit?: (value: FormValue) => void,
  onValueChange?: (value: FormValue) => void,
  onValueInteracted?: (value: { key: keyof FormValue, value: FormValue[keyof FormValue] }) => void,
  onUpdate?: (value: { updatedKeys: (keyof FormValue)[], update: Partial<FormValue> }) => void,
  disabled?: boolean,
}

const initialValues: FormValue = {
  name: '',
  email: '',
  favouriteFruit: undefined,
  allergies: StorybookHelper.selectValues.filter((_, index) => index === 5),
  contributions: [],
  notes: '',
  preferredDate: null,
}

const validators: FormValidator<FormValue>[] = [
  {
    dependsOn: ['name'],
    validatorFn: (values) => ({
      name: FormValidationUtils.string.notEmpty(values.name) ?? FormValidationUtils.string.length(values.name, [4, 32]),
    }),
  },
  {
    dependsOn: ['email'],
    validatorFn: (values) => ({
      email: FormValidationUtils.string.notEmpty(values.email) ?? FormValidationUtils.string.email(values.email),
    }),
  },
  {
    dependsOn: ['favouriteFruit'],
    validatorFn: (values) => ({
      favouriteFruit: FormValidationUtils.string.notEmpty(values.favouriteFruit),
    }),
  },
  {
    dependsOn: ['contributions'],
    validatorFn: (values) => ({
      contributions: FormValidationUtils.selection.notEmpty(values.contributions) ?? FormValidationUtils.selection.bounds(values.contributions, [2, 4]),
    }),
  },
]

const fieldStateRules: FormFieldStateRule<FormValue>[] = [
  { field: 'name', isRequired: true },
  { field: 'email', isRequired: true },
  { field: 'favouriteFruit', isRequired: true },
  { field: 'contributions', isRequired: true },
]

function ResetFormButton({ label, after, color = 'negative' }: { label: string, after?: () => void, color?: 'negative' | 'primary' }) {
  const form = useForm<FormValue>()
  return (
    <Button
      color={color}
      type="button"
      onClick={() => {
        form.reset()
        after?.()
      }}
    >
      {label}
    </Button>
  )
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

export const basic: Story = {
  args: {
    disabled: false,
    onValueChange: action('onValueChange'),
    onValueInteracted: action('onValueInteracted'),
    onUpdate: action('onValueUpdate'),
    onSubmit: action('onSubmit'),
  },
  render: ({
    onSubmit,
    onValueChange,
    onValueInteracted,
    onUpdate,
  }: StoryArgs) => {
    const [state, setState] = useState<FormState>('editing')
    useEffect(() => {
      if (state === 'sending') {
        setTimeout(() => setState('submitted'), 2000)
      }
    }, [state])

    const valuesRef = useRef(initialValues)

    return (
      <Form<FormValue>
        initialValues={initialValues}
        validators={validators}
        fieldStateRules={fieldStateRules}
        onValueChange={(next) => {
          const previous = valuesRef.current
          const updatedKeys = (Object.keys(next) as (keyof FormValue)[]).filter((key) => previous[key] !== next[key])
          valuesRef.current = next
          onValueChange?.(next)
          if (updatedKeys.length === 0) return undefined
          const update = Object.fromEntries(updatedKeys.map((key) => [key, next[key]])) as Partial<FormValue>
          onUpdate?.({ updatedKeys, update })
          return undefined
        }}
        onStateEvent={(event) => {
          if (event.type !== 'interacted') return
          onValueInteracted?.({ key: event.name, value: valuesRef.current[event.name] })
        }}
        onSubmit={(finalValues) => {
          setState('sending')
          onSubmit?.(finalValues)
        }}
      >
        <Form.Form className="flex-col-4 w-full max-w-128">
          <span className="typography-title-lg">{'Fruit Salad Form'}</span>

          <Visibility isVisible={state !== 'submitted'}>
            <FormInputField.TextInput<FormValue, 'name'>
              name="name"
              description="Your name will not be visible to others."
              label="Your name"
              inputProps={{ placeholder: 'e.g. John Doe' }}
            />

            <FormInputField.TextInput<FormValue, 'email'>
              name="email"
              description="A email to contact you."
              label="Email"
              inputProps={{ placeholder: 'e.g. test@helpwave.de' }}
            />

            <FormInputField.Select<FormValue, 'favouriteFruit'>
              name="favouriteFruit"
              description="We will use this to include as many likes as possible."
              label="Your favourite Fruit"
              options={StorybookHelper.selectValues.map(value => ({ value, label: value }))}
            />

            <FormInputField.MultiSelect<FormValue, 'contributions'>
              name="contributions"
              description="Please specify which ingredients you are bringing."
              label="Your contribution"
              options={StorybookHelper.selectValues.map(value => ({ value, label: value }))}
            />

            <FormInputField.MultiSelect<FormValue, 'allergies'>
              name="allergies"
              description="The ingredients you are allergic to."
              label="Allergies"
              options={StorybookHelper.selectValues.map(value => ({ value, label: value }))}
            />

            <FormInputField.DateTimeInput<FormValue, 'preferredDate'>
              name="preferredDate"
              description="The date you would like to attend the event."
              label="Preferred Date"
            />

            <FormInputField.Textarea<FormValue, 'notes'>
              name="notes"
              description="Anything else we should be aware of or you'd like us to know."
              label="Notes"
              inputProps={{ placeholder: 'e.g. Please buy the delicious cranberry juice' }}
            />

            <div className="flex gap-4 mt-4">
              <ResetFormButton label="Reset" />
              <Button
                type="submit"
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
            <ResetFormButton
              label="Next Submission"
              color="primary"
              after={() => setState('editing')}
            />
          </Visibility>
        </Form.Form>
      </Form>
    )
  },
}
