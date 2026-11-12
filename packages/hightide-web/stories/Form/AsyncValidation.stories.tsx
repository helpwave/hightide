import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import type { FormError, FormEvent, FormFieldStateRule, FormValidator } from '@helpwave/hightide-utils/form'
import { FormValidationUtils } from '@helpwave/hightide-utils/utils'
import { Button } from '../../src/components/interaction/Button'
import { Visibility } from '../../src/components/layout/Visibility'
import { LoadingSpinner } from '../../src/components/visualization/LoadingSpinner'
import { TextInput } from '../../src/components/data-input/text/TextInput'
import { FormInputField } from '../../src/components/form/data-input'
import { ariaProps, bindState, elementRef, mergeBlur, useFormInputInteraction } from '../../src/components/form/data-input/createFormInputField'
import { FormField, type FormFieldInputProps } from '../../src/components/form/FormField'
import { Form, useFormObserver, type FormContextType } from '../../src/components/form/Form'
import { type ReactNode, useMemo, useRef } from 'react'

type RegistrationValue = {
  username: string,
  email: string,
  password: string,
  passwordRepeat: string,
}

const registrationInitialValues: RegistrationValue = {
  username: '',
  email: '',
  password: '',
  passwordRepeat: '',
}

const passwordError = (value: string | undefined): FormError | undefined => {
  const password = value ?? ''
  if (!password) return { code: 'validationErrorNotEmpty' }
  if (password.length < 8) return { code: 'validationErrorTooShort', information: { min: 8 } }
  if (!/[0-9]/.test(password)) return { code: 'passwordNumber' }
  if (!/[A-Z]/.test(password)) return { code: 'passwordUpper' }
  if (!/[a-z]/.test(password)) return { code: 'passwordLower' }
  if (!/[^A-Za-z0-9]/.test(password)) return { code: 'passwordSymbol' }
}

const registrationValidators: FormValidator<RegistrationValue>[] = [
  {
    dependsOn: ['username'],
    validatorFn: (values) => ({
      username: FormValidationUtils.string.notEmpty(values.username),
    }),
  },
  {
    dependsOn: ['email'],
    validatorFn: (values) => ({
      email: FormValidationUtils.string.notEmpty(values.email) ?? FormValidationUtils.string.email(values.email),
    }),
  },
  {
    dependsOn: ['password'],
    validatorFn: (values) => ({
      password: passwordError(values.password),
    }),
  },
  {
    dependsOn: ['password', 'passwordRepeat'],
    validatorFn: (values) => ({
      passwordRepeat: FormValidationUtils.string.notEmpty(values.passwordRepeat) ?? (
        values.passwordRepeat === values.password ? undefined : { code: 'passwordMismatch' }
      ),
    }),
  },
]

const registrationFieldStateRules: FormFieldStateRule<RegistrationValue>[] = [
  { field: 'username', isRequired: true },
  { field: 'email', isRequired: true },
  { field: 'password', isRequired: true },
  { field: 'passwordRepeat', isRequired: true },
]

const registrationErrorText = (error: FormError) => {
  switch (error.code) {
  case 'validationErrorNotEmpty':
    return 'The field cannot be empty.'
  case 'validationErrorTooShort':
    return 'Use at least 8 characters.'
  case 'passwordNumber':
    return 'Include at least one number.'
  case 'passwordUpper':
    return 'Include at least one uppercase letter.'
  case 'passwordLower':
    return 'Include at least one lowercase letter.'
  case 'passwordSymbol':
    return 'Include at least one character that is not a letter or a number.'
  case 'passwordMismatch':
    return 'The repeated password must match the password.'
  case 'usernameTaken':
    return 'This username is already used.'
  default:
    return error.code
  }
}

const randomDigits = (length: number) => (
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
)

let usernameCheckId = 0

const startUsernameCheck = (form: FormContextType<RegistrationValue>) => {
  usernameCheckId += 1
  const id = usernameCheckId
  const current = form.store.getSnapshot().validationRunnerError.username
  const running = { id, isRunning: true, errors: [] as FormError[] }
  form.dispatch({
    type: current ? 'updateValidationRunner' : 'addValidationRunner',
    name: 'username',
    value: running,
  })
  window.setTimeout(() => {
    const latest = form.store.getSnapshot().validationRunnerError.username
    if (latest?.id !== id) return
    const value = form.store.getSnapshot().values.username.trim()
    form.dispatch({
      type: 'updateValidationRunner',
      name: 'username',
      value: {
        id,
        isRunning: false,
        errors: value.length < 4 ? [{ code: 'usernameTaken' }] : [],
      },
    })
  }, 3000)
}

function RegistrationTextControl({
  field,
  type,
  placeholder,
}: {
  field: FormFieldInputProps<string>,
  type?: string,
  placeholder?: string,
}) {
  const interaction = useFormInputInteraction({ delay: 600 }, field.onInteracted)
  return (
    <TextInput
      {...bindState(field)}
      onValueChange={(value) => {
        field.onValueChange(value)
        interaction.schedule()
        return undefined
      }}
      inputRef={elementRef(field.ref)}
      inputProps={mergeBlur({ ...ariaProps(field), type, placeholder }, interaction.interactNow)}
    />
  )
}

function RegistrationTextField<K extends 'username' | 'password' | 'passwordRepeat'>({
  name,
  label,
  description,
  type,
  placeholder,
  footer,
}: {
  name: K,
  label: string,
  description?: string,
  type?: string,
  placeholder?: string,
  footer?: ReactNode,
}) {
  return (
    <FormField.StateManager<RegistrationValue, K>
      name={name}
      label={label}
      description={description}
    >
      <FormField.Layout>
        <FormField.Label />
        <FormField.Description />
        <FormField.Wrapper<RegistrationValue, K>>
          {(field) => (
            <RegistrationTextControl
              field={field}
              type={type}
              placeholder={placeholder}
            />
          )}
        </FormField.Wrapper>
        <FormField.Error>
          {(error) => registrationErrorText(error)}
        </FormField.Error>
        {footer}
      </FormField.Layout>
    </FormField.StateManager>
  )
}

function UsernameAvailability({
  onSuggest,
}: {
  onSuggest: (form: FormContextType<RegistrationValue>, suggestion: string) => void,
}) {
  const observed = useFormObserver<RegistrationValue>()
  const runner = observed?.validationRunnerError.username
  const username = observed?.values.username ?? ''
  const failed = !!runner && !runner.isRunning && runner.errors.length > 0
  const suggestions = useMemo(() => {
    if (!failed) return []
    return [0, 1, 2].map(() => `${username}${randomDigits(5)}`)
  }, [failed, username])

  if (!observed) return null

  return (
    <div className="flex-col-2">
      <Visibility isVisible={!!runner?.isRunning}>
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <span>{'Checking username'}</span>
        </div>
      </Visibility>
      <Visibility isVisible={failed}>
        <Form.Consumer>
          {(form) => {
            if (!form) return null
            const registrationForm = form as unknown as FormContextType<RegistrationValue>
            return (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={`${suggestion}-${index}`}
                    type="button"
                    variant="outlined"
                    size="sm"
                    onClick={() => onSuggest(registrationForm, suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )
          }}
        </Form.Consumer>
      </Visibility>
    </div>
  )
}

function AsyncValidationStory() {
  const formRef = useRef<FormContextType<RegistrationValue> | null>(null)

  const applySuggestion = (form: FormContextType<RegistrationValue>, suggestion: string) => {
    form.updateValues({ username: suggestion })
    startUsernameCheck(form)
  }

  return (
    <Form<RegistrationValue>
      initialValues={registrationInitialValues}
      validators={registrationValidators}
      fieldStateRules={registrationFieldStateRules}
      onValueChange={() => undefined}
      onStateEvent={(event: FormEvent<RegistrationValue>) => {
        if (event.type !== 'interacted' || event.name !== 'username') return
        const form = formRef.current
        if (!form) return
        startUsernameCheck(form)
      }}
      onSubmit={action('onSubmit')}
    >
      <Form.Consumer>
        {(form) => {
          formRef.current = form as unknown as FormContextType<RegistrationValue> | null
          return null
        }}
      </Form.Consumer>
      <Form.Form className="flex-col-4 w-full max-w-128">
        <span className="typography-title-lg">{'Create an account'}</span>
        <RegistrationTextField
          name="username"
          label="Username"
          description="Usernames shorter than 4 characters are already used."
          placeholder="At least 4 characters"
          footer={<UsernameAvailability onSuggest={applySuggestion} />}
        />
        <FormInputField.TextInput<RegistrationValue, 'email'>
          name="email"
          label="Email"
          inputProps={{ placeholder: 'name@example.com' }}
        />
        <RegistrationTextField
          name="password"
          label="Password"
          description="At least 8 characters, with a number, an uppercase letter, a lowercase letter, and a symbol."
          type="password"
          placeholder="Password"
        />
        <RegistrationTextField
          name="passwordRepeat"
          label="Repeat password"
          type="password"
          placeholder="Repeat password"
        />
        <Button type="submit">{'Create account'}</Button>
      </Form.Form>
    </Form>
  )
}

const meta: Meta = {}

export default meta
type Story = StoryObj<typeof meta>;

export const asyncValidation: Story = {
  render: () => <AsyncValidationStory />,
}
