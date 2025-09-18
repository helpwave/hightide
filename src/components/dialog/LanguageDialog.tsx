import type { ReactNode, PropsWithChildren } from 'react'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import { Select, SelectOption } from '../user-action/select/Select'
import type { Language } from '../../localization/util'
import { LanguageUtil } from '../../localization/util'
import { useLanguage } from '../../localization/LanguageProvider'
import { SolidButton } from '../user-action/Button'
import type { DialogProps } from '@/src/components/dialog/Dialog'
import { Dialog } from '@/src/components/dialog/Dialog'

type LanguageDialogTranslation = {
  language: string,
  chooseLanguage: string,
  done: string,
} & Record<Language, string>

const defaultLanguageDialogTranslation: Translation<LanguageDialogTranslation> = {
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

type LanguageDialogProps = Omit<DialogProps, 'titleElement' | 'description'> & {
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}

/**
 * A Dialog for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const LanguageDialog = ({
                                 overwriteTranslation,
                                 onClose,
                                 titleOverwrite,
                                 descriptionOverwrite,
                                 ...props
                               }: PropsForTranslation<LanguageDialogTranslation, PropsWithChildren<LanguageDialogProps>>) => {
  const { language, setLanguage } = useLanguage()
  const translation = useTranslation([defaultLanguageDialogTranslation], overwriteTranslation)

  return (
    <Dialog
      titleElement={titleOverwrite ?? translation('language')}
      description={descriptionOverwrite ?? translation('chooseLanguage')}
      onClose={onClose}
      {...props}
    >
      <div className="w-64">
        <Select
          value={language}
          onValueChanged={(language: string) => setLanguage(language as Language)}
          contentPanelProps={{
            className: 'z-100'
          }}
        >
          {LanguageUtil.languages.map((language) => (
            <SelectOption key={language} value={language}>{translation(language)}</SelectOption>
          ))}
        </Select>
        <div className="flex-row-4 mt-3 justify-end">
          <SolidButton color="positive" onClick={onClose}>
            {translation('done')}
          </SolidButton>
        </div>
      </div>
    </Dialog>
  )
}
