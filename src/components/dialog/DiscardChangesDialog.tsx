import type { PropsWithChildren, ReactNode } from 'react'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import type { ConfirmDialogProps } from '@/src/components/dialog/ConfirmDialog'
import { ConfirmDialog } from '@/src/components/dialog/ConfirmDialog'

type DiscardChangesDialogTranslation = FormTranslationType

type DiscardChangesDialogProps =
  Omit<ConfirmDialogProps, 'onDecline' | 'onConfirm' | 'buttonOverwrites' | 'titleElement' | 'description'>
  & {
  isShowingDecline?: boolean,
  requireAnswer?: boolean,
  onCancel: () => void,
  onSave: () => void,
  onDontSave: () => void,
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}

export const DiscardChangesDialog = ({
                                       overwriteTranslation,
                                       children,
                                       onCancel,
                                       onSave,
                                       onDontSave,
                                       titleOverwrite,
                                       descriptionOverwrite,
                                       ...props
                                     }: PropsForTranslation<DiscardChangesDialogTranslation, PropsWithChildren<DiscardChangesDialogProps>>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)
  return (
    <ConfirmDialog
      {...props}
      titleElement={titleOverwrite ?? translation('unsavedChanges')}
      description={descriptionOverwrite ?? translation('unsavedChangesSaveQuestion')}
      onConfirm={onSave}
      onCancel={onCancel}
      onDecline={onDontSave}
      buttonOverwrites={[{ text: translation('cancel') }, { text: translation('discardChanges') }, { text: translation('save') }]}
    >
      {children}
    </ConfirmDialog>
  )
}
