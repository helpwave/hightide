import type { InputProps } from '../user-action/input/Input'
import { Input } from '../user-action/input/Input'
import type { ConfirmModalProps } from './ConfirmModal'
import { ConfirmModal } from './ConfirmModal'

export type InputModalProps = ConfirmModalProps & {
  inputs: InputProps[],
}

/**
 * A modal for receiving multiple inputs
 */
export const InputModal = ({
                             inputs,
                             buttonOverwrites,
                             ...restProps
                           }: InputModalProps) => {
  return (
    <ConfirmModal
      buttonOverwrites={buttonOverwrites}
      {...restProps}
    >
      {inputs.map((inputProps, index) => <Input key={`input ${index}`} {...inputProps}/>)}
    </ConfirmModal>
  )
}
