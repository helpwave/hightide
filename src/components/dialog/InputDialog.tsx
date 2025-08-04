import type { InputProps } from '../user-action/input/Input'
import { Input } from '../user-action/input/Input'
import type { ConfirmDialogProps } from '@/src/components/dialog/ConfirmDialog'
import { ConfirmDialog } from '@/src/components/dialog/ConfirmDialog'

export type InputModalProps = ConfirmDialogProps & {
  inputs: InputProps[],
}

/**
 * A modal for receiving multiple inputs
 */
export const InputDialog = ({
                             inputs,
                             buttonOverwrites,
                             ...props
                           }: InputModalProps) => {
  return (
    <ConfirmDialog
      buttonOverwrites={buttonOverwrites}
      {...props}
    >
      {inputs.map((inputProps, index) => <Input key={`input ${index}`} {...inputProps}/>)}
    </ConfirmDialog>
  )
}
