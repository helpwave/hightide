import { type PropsWithChildren, type ReactNode } from 'react'
import type { DialogProps } from '@/src/components/dialog/Dialog'
import { Dialog } from '@/src/components/dialog/Dialog'
import { MonitorCog, MoonIcon, SunIcon } from 'lucide-react'
import clsx from 'clsx'
import type { ThemeType } from '@/src/theming/useTheme'
import { ThemeUtil, useTheme } from '@/src/theming/useTheme'
import { Select, SelectOption } from '@/src/components/user-action/select/Select'
import { SolidButton } from '@/src/components/user-action/Button'
import { useTranslation } from '@/src/i18n/useTranslation'

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
                              onClose,
                              titleOverwrite,
                              descriptionOverwrite,
                              ...props
                            }: PropsWithChildren<ThemeDialogProps>) => {
  const { theme, setTheme } = useTheme()
  const translation = useTranslation()

  return (
    <Dialog
      titleElement={titleOverwrite ?? translation('themes', { count: 1 })}
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
            containerClassName: 'z-200',
          }}
          buttonProps={{
            selectedDisplay: (value) => (
              <div className="flex-row-2 items-center">
                <ThemeIcon theme={theme}/>
                {translation('themeMode', { theme: value })}
              </div>
            ),
            className: 'min-w-32',
          }}
        >
          {ThemeUtil.themes.map((theme) => (
            <SelectOption key={theme} value={theme} className="gap-x-6 justify-between">
              <div className="flex-row-2 items-center">
                <ThemeIcon theme={theme}/>
                {translation('themeMode', { theme: theme })}
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
