import { type PropsWithChildren, type ReactNode } from 'react'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import { Select, SelectOption } from '../user-action/select/Select'
import { SolidButton } from '../user-action/Button'
import type { ThemeType, ThemeTypeTranslation } from '../../theming/useTheme'
import { ThemeUtil, useTheme } from '../../theming/useTheme'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import type { DialogProps } from '@/src/components/dialog/Dialog'
import { Dialog } from '@/src/components/dialog/Dialog'
import { MonitorCog, MoonIcon, SunIcon } from 'lucide-react'
import clsx from 'clsx'

type ThemeIconProps = {
  theme: ThemeType,
  className?: string,
}
const ThemeIcon = ({ theme, className }: ThemeIconProps) => {
  if (theme === 'dark') {
    return (
      <MoonIcon className={clsx('w-4 h-4', className)}/>
    )
  } else if (theme === 'light') {
    return (
      <SunIcon className={clsx('w-4 h-4', className)}/>
    )
  } else {
    return (
      <MonitorCog className={clsx('w-4 h-4', className)}/>
    )
  }
}

type ThemeDialogTranslationAddon = {
  chooseTheme: string,
}

type ThemeDialogTranslation = ThemeDialogTranslationAddon & ThemeTypeTranslation & FormTranslationType

const defaultConfirmDialogTranslation: Translation<ThemeDialogTranslationAddon> = {
  en: {
    chooseTheme: 'Choose your preferred color theme.',
  },
  de: {
    chooseTheme: 'Wähle dein bevorzugtes Farbschema.',
  }
}

type ThemeDialogProps = Omit<DialogProps, 'titleElement' | 'description'> & {
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
      titleElement={titleOverwrite ?? translation('theme')}
      description={descriptionOverwrite ?? translation('chooseTheme')}
      onClose={onClose}
      {...props}
    >
      <div className="w-64">
        <Select
          value={theme}
          onValueChanged={(theme) => setTheme(theme as ThemeType)}
          iconAppearance="right"
          contentPanelProps={{
            className: 'z-100'
          }}
          buttonProps={{
            selectedDisplay: (value) => (
              <div className="flex-row-2 items-center">
                <ThemeIcon theme={theme}/>
                {translation(value as ThemeType)}
              </div>
            ),
            className: 'min-w-32',
          }}
        >
          {ThemeUtil.themes.map((theme) => (
            <SelectOption key={theme} value={theme} className="gap-x-6 justify-between">
              <div className="flex-row-2 items-center">
                <ThemeIcon theme={theme}/>
                {translation(theme as ThemeType)}
              </div>
            </SelectOption>
          ))}
        </Select>
        <div className="flex-row-4 mt-3 justify-end">
          <SolidButton autoFocus color="positive" onClick={onClose}>
            {translation('done')}
          </SolidButton>
        </div>
      </div>
    </Dialog>
  )
}
