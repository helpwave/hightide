import { type PropsWithChildren } from 'react'
import type { PropsForTranslation } from '@/localization/useTranslation'
import { useTranslation } from '@/localization/useTranslation'
import { Select } from '../user-action/Select'
import type { Language } from '@/localization/util'
import { LanguageUtil } from '@/localization/util'
import { useLanguage } from '@/localization/LanguageProvider'
import { SolidButton } from '../user-action/Button'
import { Modal, type ModalProps } from '../layout-and-navigation/Overlay'

type LanguageModalTranslation = {
  message: string,
  done: string,
}

const defaultConfirmDialogTranslation = {
  en: {
    message: 'Choose your language',
    done: 'Done',
  },
  de: {
    message: 'Wählen Sie Ihre Sprache',
    done: 'Fertig',
  }
}

type LanguageModalProps = ModalProps

/**
 * A Modal for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const LanguageModal = ({
                                overwriteTranslation,
                                headerProps,
                                onClose,
                                ...modalProps
                              }: PropsForTranslation<LanguageModalTranslation, PropsWithChildren<LanguageModalProps>>) => {
  const { language, setLanguage } = useLanguage()
  const translation = useTranslation(defaultConfirmDialogTranslation, overwriteTranslation)

  return (
    <Modal
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? translation.message,
      }}
      onClose={onClose}
      {...modalProps}
    >
      <div className="w-[320px]">
        <Select
          className="mt-2"
          value={language}
          options={Object.entries(LanguageUtil.languagesLocalNames).map(([tag, name]) => ({ label: name, value: tag }))}
          onChange={(language: string) => setLanguage(language as Language)}
        />
        <div className="row mt-3 gap-x-4 justify-end">
          <SolidButton autoFocus color="positive" onClick={onClose}>
            {translation.done}
          </SolidButton>
        </div>
      </div>
    </Modal>
  )
}
