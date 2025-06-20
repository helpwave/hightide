import { type PropsWithChildren } from 'react'
import type { PropsForTranslation, Translation } from '@/localization/useTranslation'
import { useTranslation } from '@/localization/useTranslation'
import { Select } from '../user-action/Select'
import { SolidButton } from '../user-action/Button'
import { Modal, type ModalProps } from '../layout-and-navigation/Overlay'
import type { ThemeType, ThemeTypeTranslation } from '@/theming/useTheme'
import { useTheme } from '@/theming/useTheme'
import { ThemeUtil } from '@/theming/useTheme'

type ThemeModalTranslation = {
  title: string,
  message: string,
  done: string,
} & ThemeTypeTranslation

const defaultConfirmDialogTranslation: Translation<ThemeModalTranslation> = {
  en: {
    title: 'Theme',
    message: 'Choose your preferred theme',
    done: 'Done',
    ...ThemeUtil.translation.en
  },
  de: {
    title: 'Farbschema',
    message: 'Wähle dein bevorzugtes Farbschema',
    done: 'Fertig',
    ...ThemeUtil.translation.en
  }
}

type ThemeModalProps = ModalProps

/**
 * A Modal for selecting the Theme
 *
 * The State of open needs to be managed by the parent
 */
export const ThemeModal = ({
                                overwriteTranslation,
                                headerProps,
                                onClose,
                                ...modalProps
                              }: PropsForTranslation<ThemeModalTranslation, PropsWithChildren<ThemeModalProps>>) => {
  const { theme, setTheme } = useTheme()
  const translation = useTranslation(defaultConfirmDialogTranslation, overwriteTranslation)

  return (
    <Modal
      headerProps={{
        ...headerProps,
        titleText: headerProps?.titleText ?? translation.title,
        descriptionText: headerProps?.descriptionText ?? translation.message,
      }}
      onClose={onClose}
      {...modalProps}
    >
      <div className="w-64">
        <Select
          className="mt-2"
          value={theme}
          options={ThemeUtil.themes.map((theme) => ({ label: translation[theme], value: theme }))}
          onChange={(theme: string) => setTheme(theme as ThemeType)}
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
