import type { InputProps } from '../../user-interaction/input/Input'
import { Input } from '../../user-interaction/input/Input'
import type { ConfirmModalProps } from './ConfirmModal'
import { ConfirmModal } from './ConfirmModal'

export type InputModalProps = ConfirmModalProps & {
  inputs: InputProps[],
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
      {inputs.map((inputProps, index) => <Input key={`input ${index}`} {...inputProps}/>)}
    </ConfirmModal>
  )
}
