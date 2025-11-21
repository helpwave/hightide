import type { PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from '@/src/i18n/useTranslation'
import type { ConfirmDialogProps } from '@/src/components/dialog/ConfirmDialog'
import { ConfirmDialog } from '@/src/components/dialog/ConfirmDialog'

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
                                       children,
                                       onCancel,
                                       onSave,
                                       onDontSave,
                                       titleOverwrite,
                                       descriptionOverwrite,
                                       ...props
                                     }: PropsWithChildren<DiscardChangesDialogProps>) => {
  const translation = useTranslation()
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
