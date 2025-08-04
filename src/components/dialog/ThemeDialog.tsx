import { type PropsWithChildren, type ReactNode } from 'react'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import { Select } from '../user-action/Select'
import { SolidButton } from '../user-action/Button'
import type { ThemeTypeTranslation } from '../../theming/useTheme'
import { useTheme } from '../../theming/useTheme'
import { ThemeUtil } from '../../theming/useTheme'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import type { DialogProps } from '@/src/components/dialog/Dialog'
import { Dialog } from '@/src/components/dialog/Dialog'

type ThemeDialogTranslationAddon = {
  chooseTheme: string,
}

type ThemeDialogTranslation = ThemeDialogTranslationAddon & ThemeTypeTranslation & FormTranslationType

const defaultConfirmDialogTranslation: Translation<ThemeDialogTranslationAddon> = {
  en: {
    chooseTheme: 'Choose your preferred theme',
  },
  de: {
    chooseTheme: 'Wähle dein bevorzugtes Farbschema',
  }
}

type ThemeDialogProps = Omit<DialogProps, 'title' | 'description'> & {
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}

/**
 * A Dialog for selecting the Theme
 *
 * The State of open needs to be managed by the parent
 */
export const ThemeDialog = ({
                              overwriteTranslation,
                              onClose,
                              titleOverwrite,
                              descriptionOverwrite,
                              ...props
                            }: PropsForTranslation<ThemeDialogTranslation, PropsWithChildren<ThemeDialogProps>>) => {
  const { theme, setTheme } = useTheme()
  const translation = useTranslation([defaultConfirmDialogTranslation, formTranslation, ThemeUtil.translation], overwriteTranslation)

  return (
    <Dialog
      title={titleOverwrite ?? translation('theme')}
      description={descriptionOverwrite ?? translation('chooseTheme')}
      onClose={onClose}
      {...props}
    >
      <div className="w-64">
        <Select
          value={theme}
          options={ThemeUtil.themes.map((theme) => ({ label: translation(theme), value: theme }))}
          onChange={(theme) => setTheme(theme)}
          searchOptions={{ disabled: true }}
        />
        <div className="flex-row-4 mt-3 justify-end">
          <SolidButton autoFocus color="positive" onClick={onClose}>
            {translation('done')}
          </SolidButton>
        </div>
      </div>
    </Dialog>
  )
}
