import type { PropsWithChildren } from 'react'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { ConfirmModalProps } from './ConfirmModal'
import { ConfirmModal } from './ConfirmModal'

type DiscardChangesModalTranslation = {
  save: string,
  cancel: string,
  dontSave: string,
  title: string,
  description: string,
}

const defaultDiscardChangesModalTranslation = {
  en: {
    save: 'Save',
    cancel: 'Cancel',
    dontSave: 'Don\'t save',
    title: 'Unsaved Changes',
    description: 'Do you want to save your changes?'
  },
  de: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    dontSave: 'Nicht Speichern',
    title: 'Ungespeicherte Änderungen',
    description: 'Möchtest du die Änderungen speichern?'
  }
}

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
  const translation = useTranslation(defaultDiscardChangesModalTranslation, overwriteTranslation)
  return (
    <ConfirmModal
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? translation.title,
        descriptionText: headerProps?.descriptionText ?? translation.description,
      }}
      onConfirm={onSave}
      onCancel={onCancel}
      onDecline={onDontSave}
      buttonOverwrites={[{ text: translation.cancel }, { text: translation.dontSave }, { text: translation.save }]}
      {...modalProps}
    >
      {children}
    </ConfirmModal>
  )
}
