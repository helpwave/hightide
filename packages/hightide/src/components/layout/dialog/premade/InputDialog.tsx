import type { InputProps } from '../../../user-interaction/input/Input'
import { Input } from '../../../user-interaction/input/Input'
import type { ConfirmDialogProps } from '@/src/components/layout/dialog/premade/ConfirmDialog'
import { ConfirmDialog } from '@/src/components/layout/dialog/premade/ConfirmDialog'

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
