import type { ComponentRef, Ref } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { TextInput, type TextInputElementProps } from '../TextInput'
import { useSearchBarContext } from './SearchBarContext'

export type SearchBarFieldProps = {
  inputRef?: Ref<ComponentRef<typeof TextInput.Input>>,
  inputProps?: TextInputElementProps,
}

export function SearchBarField({ inputRef, inputProps }: SearchBarFieldProps) {
  const translation = useHightideTranslation()
  const { state, dispatch, config } = useSearchBarContext()

  return (
    <TextInput
      value={state.value}
      isInvalid={config.isInvalid}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isRequired={config.isRequired}
      onValueChange={(next) => dispatch({ type: 'change', value: next })}
      inputRef={inputRef}
      inputProps={{
        ...inputProps,
        placeholder: inputProps?.placeholder ?? translation('search'),
        onBlur: (event) => {
          inputProps?.onBlur?.(event)
          dispatch({ type: 'commit', value: state.value })
        },
        className: clsx('search-bar-input', inputProps?.className),
      }}
    />
  )
}
