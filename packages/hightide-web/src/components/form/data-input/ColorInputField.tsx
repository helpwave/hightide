import { ColorInput, type ColorInputProps } from '../../data-input/color/ColorInput'
import type { HexColor } from '../../data-input/color/ColorInput/hexColor'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, mergeBlur, type WiredKeys } from './createFormInputField'

export const ColorInputField = createFormInputField<HexColor, Omit<ColorInputProps, WiredKeys>>((field, extra) => (
  <ColorInput
    {...extra}
    {...bindState(field)}
    onValueChange={field.onValueChange}
    controlRef={elementRef(field.ref)}
    controlProps={mergeBlur({ ...ariaProps(field as FormFieldInputProps<unknown>), ...extra.controlProps }, field.onInteracted)}
  />
))
