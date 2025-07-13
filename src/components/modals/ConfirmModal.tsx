import type { PropsWithChildren } from 'react'
import type { SolidButtonColor } from '../user-action/Button'
import { SolidButton } from '../user-action/Button'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import clsx from 'clsx'
import type { ModalProps } from '../layout-and-navigation/Overlay'
import { Modal } from '../layout-and-navigation/Overlay'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'

type ConfirmModalTranslation = FormTranslationType

export type ConfirmModalType = 'positive' | 'negative' | 'neutral' | 'primary'

type ButtonOverwriteType = {
  text?: string,
  color?: SolidButtonColor,
  disabled?: boolean,
}

export type ConfirmModalProps = Omit<ModalProps, 'onClose'> & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onCancel: () => void,
  onConfirm: () => void,
  onDecline?: () => void,
  confirmType?: ConfirmModalType,
  /**
   * Order: Cancel, Decline, Confirm
   */
  buttonOverwrites?: [ButtonOverwriteType, ButtonOverwriteType, ButtonOverwriteType],
}

/**
 * A Modal for asking the user for confirmation
 */
export const ConfirmModal = ({
                                overwriteTranslation,
                                children,
                                onCancel,
                                onConfirm,
                                onDecline,
                                confirmType = 'positive',
                                buttonOverwrites,
                                className,
                                ...restProps
                              }: PropsForTranslation<ConfirmModalTranslation, PropsWithChildren<ConfirmModalProps>>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)

  const mapping: Record<ConfirmModalType, SolidButtonColor> = {
    neutral: 'neutral',
    negative: 'negative',
    positive: 'positive',
    primary: 'primary',
  }

  return (
    <Modal {...restProps} onClose={onCancel} className={clsx('justify-between', className)}>
      <div className="flex-col-2 grow">
        {children}
      </div>
      <div className="flex-row-4 mt-3 justify-end">
        {onCancel && (
          <SolidButton
            color={buttonOverwrites?.[0].color ?? 'neutral'}
            onClick={onCancel}
            disabled={buttonOverwrites?.[0].disabled ?? false}
          >
            {buttonOverwrites?.[0].text ?? translation('cancel')}
          </SolidButton>
        )}
        {onDecline && (
          <SolidButton
            color={buttonOverwrites?.[1].color ?? 'negative'}
            onClick={onDecline}

            disabled={buttonOverwrites?.[1].disabled ?? false}
          >
            {buttonOverwrites?.[1].text ?? translation('decline')}
          </SolidButton>
        )}
        <SolidButton
          autoFocus
          color={buttonOverwrites?.[2].color ?? mapping[confirmType]}
          onClick={onConfirm}
          disabled={buttonOverwrites?.[2].disabled ?? false}
        >
          {buttonOverwrites?.[2].text ?? translation('confirm')}
        </SolidButton>
      </div>
    </Modal>
  )
}
