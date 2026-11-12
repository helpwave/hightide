import { FileInput, type FileInputProps } from '../../data-input/file/FileInput'
import type { FileInputItem } from '../../data-input/file/FileInput/fileInputItem'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, mergeBlur, type WiredKeys } from './createFormInputField'

export const FileInputField = createFormInputField<readonly FileInputItem[], Omit<FileInputProps, WiredKeys>>((field, extra) => (
  <FileInput
    {...extra}
    {...bindState(field)}
    onValueChange={field.onValueChange}
    onClose={() => {
      extra.onClose?.()
      field.onInteracted()
    }}
    inputRef={elementRef(field.ref)}
    inputProps={mergeBlur({ ...ariaProps(field as FormFieldInputProps<unknown>), ...extra.inputProps }, field.onInteracted)}
    triggerProps={{
      ...extra.triggerProps,
      onBlur: (event) => {
        extra.triggerProps?.onBlur?.(event)
        field.onInteracted()
      },
    }}
  />
))
