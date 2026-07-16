export type FormFieldInteractionStates = {
  invalid: boolean,
  disabled: boolean,
  readOnly: boolean,
  required: boolean,
}

export type FormFieldDataHandling<T> = {
  value: T,
  onValueChange: (value: T) => void,
  onEditComplete: (value: T) => void,
}
