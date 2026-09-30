import type { PropsWithChildren } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import type { ButtonColor } from '../../interaction/Button'
import { Button } from '../../interaction/Button'
import type { ModalProps } from './Modal'
import { Modal } from './Modal'

export type ConfirmModalType = 'positive' | 'negative' | 'neutral' | 'primary'

type ButtonOverwriteType = {
  text?: string,
  color?: ButtonColor,
  disabled?: boolean,
}

export type ConfirmModalProps = Omit<ModalProps, 'onClose'> & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onCancel: () => void,
  onConfirm: () => void,
  onDecline?: () => void,
  confirmType?: ConfirmModalType,
  buttonOverwrites?: [ButtonOverwriteType, ButtonOverwriteType, ButtonOverwriteType],
}

export const ConfirmModal = ({
  children,
  onCancel,
  onConfirm,
  onDecline,
  confirmType = 'positive',
  buttonOverwrites,
  contentProps,
  isShowingDecline: _isShowingDecline,
  requireAnswer: _requireAnswer,
  ...restProps
}: PropsWithChildren<ConfirmModalProps>) => {
  const translation = useHightideTranslation()

  const mapping: Record<ConfirmModalType, ButtonColor> = {
    neutral: 'neutral',
    negative: 'negative',
    positive: 'positive',
    primary: 'primary',
  }

  return (
    <Modal
      {...restProps}
      onClose={onCancel}
      contentProps={{
        ...contentProps,
        className: clsx('justify-between', contentProps?.className),
      }}
    >
      <div className="flex-col-2 grow">
        {children}
      </div>
      <div className="modal-actions">
        {onCancel && (
          <Button
            className="modal-actions-button"
            color={buttonOverwrites?.[0].color ?? 'neutral'}
            onClick={onCancel}
            disabled={buttonOverwrites?.[0].disabled ?? false}
          >
            {buttonOverwrites?.[0].text ?? translation('cancel')}
          </Button>
        )}
        {onDecline && (
          <Button
            className="modal-actions-button"
            color={buttonOverwrites?.[1].color ?? 'negative'}
            onClick={onDecline}
            disabled={buttonOverwrites?.[1].disabled ?? false}
          >
            {buttonOverwrites?.[1].text ?? translation('decline')}
          </Button>
        )}
        <Button
          className="modal-actions-button"
          color={buttonOverwrites?.[2].color ?? mapping[confirmType] ?? undefined}
          onClick={onConfirm}
          disabled={buttonOverwrites?.[2].disabled ?? false}
        >
          {buttonOverwrites?.[2].text ?? translation('confirm')}
        </Button>
      </div>
    </Modal>
  )
}
