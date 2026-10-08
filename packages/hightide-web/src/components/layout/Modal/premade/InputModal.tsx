import type { TextInputProps } from '../../../data-input/input/TextInput'
import { TextInput } from '../../../data-input/input/TextInput'
import type { ConfirmModalProps } from './ConfirmModal'
import { ConfirmModal } from './ConfirmModal'

export type InputModalProps = ConfirmModalProps & {
  inputs: TextInputProps[],
}

export const InputModal = ({
  inputs,
  buttonOverwrites,
  ...props
}: InputModalProps) => {
  return (
    <ConfirmModal
      buttonOverwrites={buttonOverwrites}
      {...props}
    >
      {inputs.map((inputProps, index) => <TextInput key={`input ${index}`} {...inputProps}/>)}
    </ConfirmModal>
  )
}
