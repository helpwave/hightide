import type { PropsWithChildren } from 'react'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { ConfirmModalProps } from './ConfirmModal'
import { ConfirmModal } from './ConfirmModal'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'


type DiscardChangesModalTranslation = FormTranslationType

type DiscardChangesModalProps = Omit<ConfirmModalProps, 'onDecline' | 'onConfirm' | 'buttonOverwrites'> & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onCancel: () => void,
  onSave: () => void,
  onDontSave: () => void,
}

export const DiscardChangesModal = ({
                                       overwriteTranslation,
                                       children,
                                       onCancel,
                                       onSave,
                                       onDontSave,
                                       headerProps,
                                       ...modalProps
                                     }: PropsForTranslation<DiscardChangesModalTranslation, PropsWithChildren<DiscardChangesModalProps>>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)
  return (
    <ConfirmModal
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? translation('unsavedChanges'),
        descriptionText: headerProps?.descriptionText ?? translation('unsavedChangesSaveQuestion'),
      }}
      onConfirm={onSave}
      onCancel={onCancel}
      onDecline={onDontSave}
      buttonOverwrites={[{ text: translation('cancel') }, { text: translation('discardChanges') }, { text: translation('save') }]}
      {...modalProps}
    >
      {children}
    </ConfirmModal>
  )
}
