import { CheckboxField } from './CheckboxField'
import { ColorInputField } from './ColorInputField'
import { ComboboxField } from './ComboboxField'
import { DateTimeInputField } from './DateTimeInputField'
import { FileInputField } from './FileInputField'
import { FlexibleDateTimeInputField } from './FlexibleDateTimeInputField'
import { InsideLabelInputField } from './InsideLabelInputField'
import { MultiSelectField } from './MultiSelectField'
import { NumberInputField } from './NumberInputField'
import { NumberStepperInputField } from './NumberStepperInputField'
import { SelectField } from './SelectField'
import { SwitchField } from './SwitchField'
import { TextareaField } from './TextareaField'
import { TextInputField } from './TextInputField'

export const FormInputField = {
  TextInput: TextInputField,
  Textarea: TextareaField,
  NumberInput: NumberInputField,
  NumberStepperInput: NumberStepperInputField,
  InsideLabelInput: InsideLabelInputField,
  Checkbox: CheckboxField,
  Switch: SwitchField,
  Select: SelectField,
  MultiSelect: MultiSelectField,
  Combobox: ComboboxField,
  ColorInput: ColorInputField,
  DateTimeInput: DateTimeInputField,
  FlexibleDateTimeInput: FlexibleDateTimeInputField,
  FileInput: FileInputField,
}
