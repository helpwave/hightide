import type { PropsWithChildren, ReactNode } from 'react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { ConfirmDialogProps } from '@/src/components/layout/dialog/premade/ConfirmDialog'
import { ConfirmDialog } from '@/src/components/layout/dialog/premade/ConfirmDialog'

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
  const translation = useHightideTranslation()
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
