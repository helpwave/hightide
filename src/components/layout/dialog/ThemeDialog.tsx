import { type PropsWithChildren, type ReactNode } from 'react'
import type { DialogProps } from '@/src/components/layout/dialog/Dialog'
import { Dialog } from '@/src/components/layout/dialog/Dialog'
import { MonitorCog, MoonIcon, SunIcon } from 'lucide-react'
import clsx from 'clsx'
import type { ThemeType } from '@/src/contexts/ThemeContext'
import { ThemeUtil, useTheme } from '@/src/contexts/ThemeContext'
import { Select, SelectOption } from '@/src/components/user-interaction/Select'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

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
  const translation = useHightideTranslation()

  return (
    <Dialog
      titleElement={titleOverwrite ?? translation('pThemes', { count: 1 })}
      description={descriptionOverwrite ?? translation('chooseTheme')}
      onClose={onClose}
      {...props}
    >
      <div className="w-64">
        <Select
          value={theme}
          onValueChange={(theme) => setTheme(theme as ThemeType)}
          iconAppearance="right"
          buttonProps={{
            selectedDisplay: (value) => (
              <div className="flex-row-2 items-center">
                <ThemeIcon theme={theme}/>
                {translation('sThemeMode', { theme: value })}
              </div>
            ),
            className: 'min-w-32',
          }}
        >
          {ThemeUtil.themes.map((theme) => (
            <SelectOption key={theme} value={theme} className="gap-x-6 justify-between">
              <div className="flex-row-2 items-center">
                <ThemeIcon theme={theme}/>
                {translation('sThemeMode', { theme: theme })}
              </div>
            </SelectOption>
          ))}
        </Select>
        <div className="flex-row-4 mt-3 justify-end">
          <Button autoFocus color="positive" onClick={onClose}>
            {translation('done')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
