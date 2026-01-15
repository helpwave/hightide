import type { PropsWithChildren } from 'react'
import type { ButtonColor } from '@/src/components/user-interaction/Button'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import clsx from 'clsx'
import type { DialogProps } from '@/src/components/layout/dialog/Dialog'
import { Dialog } from '@/src/components/layout/dialog/Dialog'

export type ConfirmDialogType = 'positive' | 'negative' | 'neutral' | 'primary'

type ButtonOverwriteType = {
  text?: string,
  color?: ButtonColor,
  disabled?: boolean,
}

export type ConfirmDialogProps = Omit<DialogProps, 'onClose'> & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onCancel: () => void,
  onConfirm: () => void,
  onDecline?: () => void,
  confirmType?: ConfirmDialogType,
  /**
   * Order: Cancel, Decline, Confirm
   */
  buttonOverwrites?: [ButtonOverwriteType, ButtonOverwriteType, ButtonOverwriteType],
}

/**
 * A Dialog for asking the user for confirmation
 */
export const ConfirmDialog = ({
  children,
  onCancel,
  onConfirm,
  onDecline,
  confirmType = 'positive',
  buttonOverwrites,
  className,
  ...restProps
}: PropsWithChildren<ConfirmDialogProps>) => {
  const translation = useHightideTranslation()

  const mapping: Record<ConfirmDialogType, ButtonColor> = {
    neutral: 'neutral',
    negative: 'negative',
    positive: 'positive',
    primary: 'primary',
  }

  return (
    <Dialog {...restProps} onClose={onCancel} className={clsx('justify-between', className)}>
      <div className="flex-col-2 grow">
        {children}
      </div>
      <div className="flex-row-4 mt-3 justify-end">
        {onCancel && (
          <Button
            color={buttonOverwrites?.[0].color ?? 'neutral'}
            onClick={onCancel}
            disabled={buttonOverwrites?.[0].disabled ?? false}
          >
            {buttonOverwrites?.[0].text ?? translation('cancel')}
          </Button>
        )}
        {onDecline && (
          <Button
            color={buttonOverwrites?.[1].color ?? 'negative'}
            onClick={onDecline}

            disabled={buttonOverwrites?.[1].disabled ?? false}
          >
            {buttonOverwrites?.[1].text ?? translation('decline')}
          </Button>
        )}
        <Button
          color={buttonOverwrites?.[2].color ?? mapping[confirmType]}
          onClick={onConfirm}
          disabled={buttonOverwrites?.[2].disabled ?? false}
        >
          {buttonOverwrites?.[2].text ?? translation('confirm')}
        </Button>
      </div>
    </Dialog>
  )
}
