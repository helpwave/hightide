import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import type { StorybookHelperSelectType } from '@/src/storybook/helper'
import { StorybookHelper } from '@/src/storybook/helper'
import { useTranslatedValidators } from '@/src/hooks/useValidators'
import { Input } from '@/src/components/user-interaction/input/Input'
import { MultiSelect } from '@/src/components/user-interaction/select/MultiSelect'
import { Select } from '@/src/components/user-interaction/select/Select'
import { SelectOption } from '@/src/components/user-interaction/select/SelectComponents'
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
import { DateTimeInput } from '@/src/components/user-interaction/input/DateTimeInput'

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
  validationBehaviour?: FormValidationBehaviour,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

export const basic: Story = {
  args: {
    disabled: false,
    validationBehaviour: 'touched',
    onValueChange: action('onValueChange'),
    onValueTouched: action('onValueTouched'),
    onUpdate: action('onValueUpdate'),
    onValidUpdate: action('onValidUpdate'),
    onSubmit: action('onSubmit'),
  },
  render: ({
    validationBehaviour,
    onSubmit,
    onValueChange,
    onValueTouched,
    onUpdate,
    onValidUpdate,
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
        preferredDate: null,
      },
      validators: useMemo(() => ({
        name: (val) => validators.notEmpty(val) ?? validators.length(val, [4, 32]),
        email: (val) => validators.notEmpty(val) ?? validators.email(val),
        favouriteFruit: (val) => validators.notEmpty(val),
        contributions: (val) => validators.notEmpty(val?.length) ?? validators.selection(val, [2, 4]),
      }), [validators]),
      onFormSubmit: (finalValues) => {
        setState('sending')
        onSubmit?.(finalValues)
      },
      onValueChange: onValueChange,
      onUpdate: (updatedKeys, update) => onUpdate?.({ updatedKeys, update }),
      onValidUpdate: (updatedKeys, update) => onValidUpdate?.({ updatedKeys, update }),
    })

    useEffect(() => {
      const unsubscribe = form.store.subscribe('ALL', (event) => {
        if (event.type === 'onTouched') {
          onValueTouched?.({ key: event.key, value: event.value })
        }
      })
      return () => unsubscribe()
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
              validationBehaviour={validationBehaviour}
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
              validationBehaviour={validationBehaviour}
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
              validationBehaviour={validationBehaviour}
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
              validationBehaviour={validationBehaviour}
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
              validationBehaviour={validationBehaviour}
            >
              {({ dataProps, focusableElementProps, interactionStates }) => (
                <MultiSelect {...dataProps as FormFieldDataHandling<string[]>} {...focusableElementProps} {...interactionStates}>
                  {StorybookHelper.selectValues.map(value => (
                    <SelectOption key={value} value={value} />
                  ))}
                </MultiSelect>
              )}
            </FormField>

            <FormField<FormValue, 'preferredDate'>
              name="preferredDate"
              description="The date you would like to attend the event."
              label="Preferred Date"
              validationBehaviour={validationBehaviour}
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
              validationBehaviour={validationBehaviour}
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
  onFormSubmit: (finalValues) => {
    setState('sending')
    onSubmit?.(finalValues)
  },
  onValueChange: onValueChange,
  onUpdate: (updatedKeys, update) => onUpdate?.({ updatedKeys, update }),
})

useEffect(() => {
  const unsubscribe = form.store.subscribe('ALL', (event) => {
    if (event.type === 'onTouched') {
      onValueTouched?.({ key: event.key, value: event.value })
    }
  })
  return () => unsubscribe()
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
        `.trim(),
        language: 'tsx',
      },
    },
  },
}
