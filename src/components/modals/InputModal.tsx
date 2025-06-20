import type { InputProps } from '../user-action/Input'
import { Input } from '../user-action/Input'
import type { ConfirmDialogProps } from '../dialogs/ConfirmDialog'
import { ConfirmDialog } from '../dialogs/ConfirmDialog'

export type InputModalProps = ConfirmDialogProps & {
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
    <ConfirmDialog
      buttonOverwrites={buttonOverwrites}
      {...restProps}
    >
      {inputs.map((inputProps, index) => <Input key={`input ${index}`} {...inputProps}/>)}
    </ConfirmDialog>
  )
}
