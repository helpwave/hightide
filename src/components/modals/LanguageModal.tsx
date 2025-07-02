import { type PropsWithChildren } from 'react'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import { Select } from '../user-action/Select'
import type { Language } from '../../localization/util'
import { LanguageUtil } from '../../localization/util'
import { useLanguage } from '../../localization/LanguageProvider'
import { SolidButton } from '../user-action/Button'
import { Modal, type ModalProps } from '../layout-and-navigation/Overlay'

type LanguageModalTranslation = {
  language: string,
  chooseLanguage: string,
  done: string,
} & Record<Language, string>

const defaultLanguageModalTranslation: Translation<LanguageModalTranslation> = {
  en: {
    language: 'Language',
    chooseLanguage: 'Choose your language',
    done: 'Done',
    ...LanguageUtil.languagesLocalNames
  },
  de: {
    language: 'Sprache',
    chooseLanguage: 'Wähle deine bevorzugte Sprache',
    done: 'Fertig',
    ...LanguageUtil.languagesLocalNames
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
  const translation = useTranslation([defaultLanguageModalTranslation], overwriteTranslation)

  return (
    <Modal
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? translation('language'),
        descriptionText: headerProps?.descriptionText ?? translation('chooseLanguage'),
      }}
      onClose={onClose}
      {...modalProps}
    >
      <div className="w-64">
        <Select
          className="mt-2"
          value={language}
          options={LanguageUtil.languages.map((language) => ({ label: translation(language), value: language }))}
          onChange={(language: string) => setLanguage(language as Language)}
        />
        <div className="row mt-3 gap-x-4 justify-end">
          <SolidButton autoFocus color="positive" onClick={onClose}>
            {translation('done')}
          </SolidButton>
        </div>
      </div>
    </Modal>
  )
}
