import type { PropsWithChildren, ReactNode } from 'react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import type { ConfirmModalProps } from './ConfirmModal'
import { ConfirmModal } from './ConfirmModal'

type DiscardChangesModalProps =
  Omit<ConfirmModalProps, 'onDecline' | 'onConfirm' | 'buttonOverwrites' | 'titleElement' | 'description'>
  & {
    isShowingDecline?: boolean,
    requireAnswer?: boolean,
    onCancel: () => void,
    onSave: () => void,
    onDontSave: () => void,
    titleOverwrite?: ReactNode,
    descriptionOverwrite?: ReactNode,
  }

export const DiscardChangesModal = ({
  children,
  onCancel,
  onSave,
  onDontSave,
  titleOverwrite,
  descriptionOverwrite,
  ...props
}: PropsWithChildren<DiscardChangesModalProps>) => {
  const translation = useHightideTranslation()
  return (
    <ConfirmModal
      {...props}
      titleElement={titleOverwrite ?? translation('unsavedChanges')}
      description={descriptionOverwrite ?? translation('unsavedChangesSaveQuestion')}
      onConfirm={onSave}
      onCancel={onCancel}
      onDecline={onDontSave}
      buttonOverwrites={[{ text: translation('cancel') }, { text: translation('discardChanges') }, { text: translation('save') }]}
    >
      {children}
    </ConfirmModal>
  )
}

export type { DiscardChangesModalProps }
