import type { PropsWithChildren } from 'react'
import type { SolidButtonColor } from '../user-action/Button'
import { SolidButton } from '../user-action/Button'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import clsx from 'clsx'
import type { DialogProps } from '../layout-and-navigation/Overlay'
import { Dialog } from '../layout-and-navigation/Overlay'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'

type ConfirmDialogTranslation = FormTranslationType

export type ConfirmDialogType = 'positive' | 'negative' | 'neutral' | 'primary'

type ButtonOverwriteType = {
  text?: string,
  color?: SolidButtonColor,
  disabled?: boolean,
}

export type ConfirmDialogProps = DialogProps & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onConfirm: () => void,
  onDecline?: () => void,
  confirmType?: ConfirmDialogType,
  /**
   * Order: Decline, Confirm
   */
  buttonOverwrites?: [ButtonOverwriteType, ButtonOverwriteType],
}

/**
 * A Dialog for demanding the user for confirmation
 *
 * To allow for background closing, prefer using a ConfirmModal
 */
export const ConfirmDialog = ({
                                overwriteTranslation,
                                children,
                                onConfirm,
                                onDecline,
                                confirmType = 'positive',
                                buttonOverwrites,
                                className,
                                ...restProps
                              }: PropsForTranslation<ConfirmDialogTranslation, PropsWithChildren<ConfirmDialogProps>>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)

  const mapping: Record<ConfirmDialogType, SolidButtonColor> = {
    neutral: 'primary',
    negative: 'negative',
    positive: 'positive',
    primary: 'primary',
  }

  return (
    <Dialog {...restProps} className={clsx('justify-between', className)}>
      <div className="col grow">
        {children}
      </div>
      <div className="row mt-3 gap-x-4 justify-end">
        {onDecline && (
          <SolidButton
            color={buttonOverwrites?.[0].color ?? 'negative'}
            onClick={onDecline}

            disabled={buttonOverwrites?.[0].disabled ?? false}
          >
            {buttonOverwrites?.[0].text ?? translation('decline')}
          </SolidButton>
        )}
        <SolidButton
          autoFocus
          color={buttonOverwrites?.[1].color ?? mapping[confirmType]}
          onClick={onConfirm}
          disabled={buttonOverwrites?.[1].disabled ?? false}
        >
          {buttonOverwrites?.[1].text ?? translation('confirm')}
        </SolidButton>
      </div>
    </Dialog>
  )
}
