import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import clsx from 'clsx'
import type { FormFieldStateRule, FormValidator } from '@helpwave/hightide-utils/form'
import { FormValidationUtils } from '@helpwave/hightide-utils/utils'
import { useStateStoreSelector } from '@helpwave/hightide-utils/hooks'
import { Button } from '../../src/components/interaction/Button'
import { Visibility } from '../../src/components/layout/Visibility'
import { Card } from '../../src/components/layout/Card'
import { FormInputField } from '../../src/components/form/data-input'
import { Form, useForm } from '../../src/components/form/Form'

type CheckoutMode = 'consumer' | 'company'

type CheckoutValue = {
  mode: CheckoutMode,
  name: string,
  email: string,
  phone: string,
  address: string,
  companyName: string,
  companyCode: string,
  taxNumber: string,
}

const checkoutInitialValues: CheckoutValue = {
  mode: 'consumer',
  name: '',
  email: '',
  phone: '',
  address: '',
  companyName: '',
  companyCode: '',
  taxNumber: '',
}

const requiredForMode = (
  mode: CheckoutMode,
  activeMode: CheckoutMode,
  value: string | undefined
) => (
  mode === activeMode ? FormValidationUtils.string.notEmpty(value) : undefined
)

const checkoutValidators: FormValidator<CheckoutValue>[] = [
  {
    dependsOn: ['mode', 'name'],
    validatorFn: (values) => ({
      name: requiredForMode(values.mode, 'consumer', values.name),
    }),
  },
  {
    dependsOn: ['mode', 'phone'],
    validatorFn: (values) => ({
      phone: requiredForMode(values.mode, 'consumer', values.phone),
    }),
  },
  {
    dependsOn: ['mode', 'address'],
    validatorFn: (values) => ({
      address: requiredForMode(values.mode, 'consumer', values.address),
    }),
  },
  {
    dependsOn: ['email'],
    validatorFn: (values) => ({
      email: FormValidationUtils.string.notEmpty(values.email) ?? FormValidationUtils.string.email(values.email),
    }),
  },
  {
    dependsOn: ['mode', 'companyName'],
    validatorFn: (values) => ({
      companyName: requiredForMode(values.mode, 'company', values.companyName),
    }),
  },
  {
    dependsOn: ['mode', 'companyCode'],
    validatorFn: (values) => ({
      companyCode: requiredForMode(values.mode, 'company', values.companyCode),
    }),
  },
  {
    dependsOn: ['mode', 'taxNumber'],
    validatorFn: (values) => ({
      taxNumber: requiredForMode(values.mode, 'company', values.taxNumber),
    }),
  },
]

const checkoutFieldStateRules: FormFieldStateRule<CheckoutValue>[] = [
  {
    field: 'name',
    dependsOn: ['mode'],
    isDisabled: (values) => values.mode !== 'consumer',
    isRequired: (values) => values.mode === 'consumer',
  },
  {
    field: 'phone',
    dependsOn: ['mode'],
    isDisabled: (values) => values.mode !== 'consumer',
    isRequired: (values) => values.mode === 'consumer',
  },
  {
    field: 'address',
    dependsOn: ['mode'],
    isDisabled: (values) => values.mode !== 'consumer',
    isRequired: (values) => values.mode === 'consumer',
  },
  { field: 'email', isRequired: true },
  {
    field: 'companyName',
    dependsOn: ['mode'],
    isDisabled: (values) => values.mode !== 'company',
    isRequired: (values) => values.mode === 'company',
  },
  {
    field: 'companyCode',
    dependsOn: ['mode'],
    isDisabled: (values) => values.mode !== 'company',
    isRequired: (values) => values.mode === 'company',
  },
  {
    field: 'taxNumber',
    dependsOn: ['mode'],
    isDisabled: (values) => values.mode !== 'company',
    isRequired: (values) => values.mode === 'company',
  },
]

const checkoutModes: { value: CheckoutMode, title: string, description: string }[] = [
  { value: 'consumer', title: 'Consumer', description: 'Name, email, phone, and address' },
  { value: 'company', title: 'Company', description: 'Company name, email, company code, and tax number' },
]

function CheckoutModeCards() {
  const form = useForm<CheckoutValue>()
  const mode = useStateStoreSelector(form.store, (state) => state.values.mode)

  return (
    <div role="radiogroup" aria-label="Checkout type" className="flex gap-4">
      {checkoutModes.map((option) => {
        const selected = mode === option.value
        return (
          <Card
            key={option.value}
            size="sm"
            role="radio"
            aria-checked={selected}
            tabIndex={0}
            className={clsx('flex-1 cursor-pointer', selected && 'outline outline-2 outline-primary')}
            onClick={() => form.updateValues({ mode: option.value })}
            onKeyDown={(event) => {
              if (event.key !== ' ' && event.key !== 'Enter') return
              event.preventDefault()
              form.updateValues({ mode: option.value })
            }}
          >
            <span className="typography-title-sm">{option.title}</span>
            <span>{option.description}</span>
          </Card>
        )
      })}
    </div>
  )
}

function CheckoutFields() {
  const form = useForm<CheckoutValue>()
  const flags = useStateStoreSelector(form.store, (state) => state.fieldFlags)
  const show = (field: keyof CheckoutValue) => !flags[field]?.isDisabled

  return (
    <>
      <CheckoutModeCards />
      <Visibility isVisible={show('name')}>
        <FormInputField.TextInput<CheckoutValue, 'name'>
          name="name"
          label="Name"
        />
      </Visibility>
      <Visibility isVisible={show('companyName')}>
        <FormInputField.TextInput<CheckoutValue, 'companyName'>
          name="companyName"
          label="Company name"
        />
      </Visibility>
      <FormInputField.TextInput<CheckoutValue, 'email'>
        name="email"
        label="Email"
      />
      <Visibility isVisible={show('phone')}>
        <FormInputField.TextInput<CheckoutValue, 'phone'>
          name="phone"
          label="Phone"
        />
      </Visibility>
      <Visibility isVisible={show('companyCode')}>
        <FormInputField.TextInput<CheckoutValue, 'companyCode'>
          name="companyCode"
          label="German company code"
        />
      </Visibility>
      <Visibility isVisible={show('address')}>
        <FormInputField.TextInput<CheckoutValue, 'address'>
          name="address"
          label="Address"
        />
      </Visibility>
      <Visibility isVisible={show('taxNumber')}>
        <FormInputField.TextInput<CheckoutValue, 'taxNumber'>
          name="taxNumber"
          label="Tax number"
        />
      </Visibility>
    </>
  )
}

function CheckoutForm() {
  return (
    <Form<CheckoutValue>
      initialValues={checkoutInitialValues}
      validators={checkoutValidators}
      fieldStateRules={checkoutFieldStateRules}
      onValueChange={() => undefined}
      onStateEvent={() => undefined}
      onSubmit={action('onSubmit')}
    >
      <Form.Form className="flex-col-4 w-full max-w-128">
        <span className="typography-title-lg">{'Checkout'}</span>
        <CheckoutFields />
        <Button type="submit">{'Continue'}</Button>
      </Form.Form>
    </Form>
  )
}

const meta: Meta = {}

export default meta
type Story = StoryObj<typeof meta>;

export const checkout: Story = {
  render: () => <CheckoutForm />,
}
