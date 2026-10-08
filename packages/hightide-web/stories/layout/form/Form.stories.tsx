import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import type { StorybookHelperSelectType } from '../../../src/storybook/helper'
import { StorybookHelper } from '../../../src/storybook/helper'
import { FormValidationUtils } from '@helpwave/hightide-utils/utils'
import { useEditCompletable } from '@helpwave/hightide-utils/hooks'
import { TextInput, type TextInputElementProps } from '../../../src/components/data-input/input/TextInput'
import { MultiSelect } from '../../../src/components/data-input/MultiSelect/MultiSelect'
import { Select } from '../../../src/components/data-input/Select/Select'
import { Textarea } from '../../../src/components/data-input/Textarea'
import { Button } from '../../../src/components/interaction/Button'
import { useCreateForm } from '../../../src/components/layout/form/useCreateForm'
import { Visibility } from '../../../src/components/layout/Visibility'
import { HelpwaveLogo } from '../../../src/components/branding/visualization/HelpwaveLogo'
import { useEffect, useMemo, useState, type FocusEvent, type Ref } from 'react'
import { FormField } from '../../../src/components/layout/form/FormField'
import { FormProvider } from '../../../src/components/layout/form/FormContext'
import { DateTimeInput } from '../../../src/components/data-input/input/DateTimeInput'

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
  onValidUpdate?: (value: { updatedKeys: (keyof FormValue)[], update: Partial<FormValue> }) => void,
  onValueTouched?: (value: { key: keyof FormValue, value: FormValue[keyof FormValue] }) => void,
  onUpdate?: (value: { updatedKeys: (keyof FormValue)[], update: Partial<FormValue> }) => void,
  disabled?: boolean,
}

const meta: Meta<StoryArgs> = {}

function FormTextInput({
  value,
  onValueUpdate,
  onValueCommit,
  invalid,
  disabled,
  readOnly,
  required,
  onBlur,
  ref,
  ...inputProps
}: {
  value?: string,
  onValueUpdate: (value: string) => void,
  onValueCommit: (value: string) => void,
  invalid?: boolean,
  disabled?: boolean,
  readOnly?: boolean,
  required?: boolean,
  ref?: Ref<HTMLInputElement>,
} & TextInputElementProps) {
  const edit = useEditCompletable({
    value: value ?? '',
    onEditComplete: onValueCommit,
    isTimerEnabled: false,
  })

  return (
    <TextInput
      ref={ref}
      value={value ?? ''}
      isInvalid={invalid}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isRequired={required}
      onValueChange={onValueUpdate}
      inputProps={{
        ...inputProps,
        onBlur: (event: FocusEvent<HTMLInputElement>) => {
          onBlur?.(event)
          edit.completeNow()
        },
      }}
    />
  )
}

export default meta
type Story = StoryObj<typeof meta>;

export const basic: Story = {
  args: {
    disabled: false,
    onValueChange: action('onValueChange'),
    onValueTouched: action('onValueTouched'),
    onUpdate: action('onValueUpdate'),
    onValidUpdate: action('onValidUpdate'),
    onSubmit: action('onSubmit'),
  },
  render: ({
    onSubmit,
    onValueChange,
    onValueTouched,
    onUpdate,
    onValidUpdate,
  }: StoryArgs) => {
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
        preferredDate: null,
      },
      validation: useMemo(() => ([
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
      ]), []),
      onFormSubmit: (finalValues) => {
        setState('sending')
        onSubmit?.(finalValues)
      },
      onValueChange: onValueChange,
      onUpdate: (updatedKeys, update) => onUpdate?.({ updatedKeys, update }),
      onValidUpdate: (updatedKeys, update) => onValidUpdate?.({ updatedKeys, update }),
    })

    useEffect(() => {
      return form.store.subscribe((state, previous) => {
        (Object.keys(state.touchedValues) as (keyof FormValue)[]).forEach((key) => {
          if (state.touchedValues[key] && !previous.touchedValues[key]) {
            onValueTouched?.({ key, value: state.values[key] })
          }
        })
      })
    }, [form.store, onValueTouched])

    return (
      <FormProvider state={form}>
        <form className="flex-col-4 w-full max-w-128" onSubmit={event => {
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
                <FormTextInput {...dataProps} {...focusableElementProps} {...interactionStates} placeholder="e.g. John Doe" />
              )}
            </FormField>

            <FormField<FormValue, 'email'>
              name="email"
              required={true}
              description="A email to contact you."
              label="Email"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <FormTextInput {...dataProps} {...focusableElementProps} {...interactionStates} placeholder="e.g. test@helpwave.de" />
              )}
            </FormField>

            <FormField<FormValue, 'favouriteFruit'>
              name="favouriteFruit"
              required={true}
              description="We will use this to include as many likes as possible."
              label="Your favourite Fruit"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <Select {...dataProps} {...focusableElementProps} {...interactionStates}>
                  {StorybookHelper.selectValues.map(value => (
                    <Select.Option key={value} value={value} label={value} />
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
                <MultiSelect {...dataProps} {...focusableElementProps} {...interactionStates}>
                  {StorybookHelper.selectValues.map(value => (
                    <MultiSelect.Option key={value} value={value} label={value} />
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
                <MultiSelect {...dataProps} {...focusableElementProps} {...interactionStates}>
                  {StorybookHelper.selectValues.map(value => (
                    <MultiSelect.Option key={value} value={value} label={value} />
                  ))}
                </MultiSelect>
              )}
            </FormField>

            <FormField<FormValue, 'preferredDate'>
              name="preferredDate"
              description="The date you would like to attend the event."
              label="Preferred Date"
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <DateTimeInput
                  {...dataProps}
                  {...focusableElementProps}
                  {...interactionStates}
                />
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
  },
  parameters: {
    docs: {
      source: {
        code: `
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
  validation: [
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
  ],
  onFormSubmit: (finalValues) => {
    setState('sending')
    onSubmit?.(finalValues)
  },
  onValueChange: onValueChange,
  onUpdate: (updatedKeys, update) => onUpdate?.({ updatedKeys, update }),
})

useEffect(() => {
  return form.store.subscribe((state, previous) => {
    (Object.keys(state.touchedValues) as (keyof FormValue)[]).forEach((key) => {
      if (state.touchedValues[key] && !previous.touchedValues[key]) {
        onValueTouched?.({ key, value: state.values[key] })
      }
    })
  })
}, [form.store, onValueTouched])

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
            <FormTextInput {...dataProps} {...focusableElementProps} {...interactionStates} placeholder="e.g. John Doe" />
          )}
        </FormField>

        <FormField<FormValue, 'email'>
          name="email"
          required={true}
          description="A email to contact you."
          label="Email"
        >
          {({ dataProps, focusableElementProps, interactionStates }) => (
            <FormTextInput {...dataProps} {...focusableElementProps} {...interactionStates} placeholder="e.g. test@helpwave.de" />
          )}
        </FormField>

        <FormField<FormValue, 'favouriteFruit'>
          name="favouriteFruit"
          required={true}
          description="We will use this to include as many likes as possible."
          label="Your favourite Fruit"
        >
          {({ dataProps, focusableElementProps, interactionStates }) => (
            <Select {...dataProps} {...focusableElementProps} {...interactionStates}>
              {StorybookHelper.selectValues.map(value => (
                <Select.Option key={value} value={value} />
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
            <MultiSelect {...dataProps} {...focusableElementProps} {...interactionStates}>
              {StorybookHelper.selectValues.map(value => (
                <MultiSelect.Option key={value} value={value} />
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
            <MultiSelect {...dataProps} {...focusableElementProps} {...interactionStates}>
              {StorybookHelper.selectValues.map(value => (
                <MultiSelect.Option key={value} value={value} />
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
        `.trim(),
        language: 'tsx',
      },
    },
  },
}
