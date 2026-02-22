import type { HTMLAttributes } from 'react'
import { type PropsWithChildren, type ReactNode } from 'react'
import type { DialogProps } from '@/src/components/layout/dialog/Dialog'
import { Dialog } from '@/src/components/layout/dialog/Dialog'
import { MonitorCog, MoonIcon, SunIcon } from 'lucide-react'
import clsx from 'clsx'
import type { ThemeType } from '@/src/global-contexts/ThemeContext'
import { ThemeUtil, useTheme } from '@/src/global-contexts/ThemeContext'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { SelectProps } from '@/src/components/user-interaction/Select/Select'
import { Select } from '@/src/components/user-interaction/Select/Select'
import { SelectOption } from '@/src/components/user-interaction/Select/SelectOption'

export interface ThemeIconProps extends HTMLAttributes<SVGSVGElement> {
  theme?: ThemeType,
}

export const ThemeIcon = ({ theme: themeOverride, ...props }: ThemeIconProps) => {
  const { resolvedTheme } = useTheme()
  const theme = themeOverride ?? resolvedTheme

  switch (theme) {
  case 'dark':
    return <MoonIcon {...props} className={clsx('w-4 h-4', props. className)}/>
  case 'light':
    return <SunIcon {...props} className={clsx('w-4 h-4', props.className)}/>
  default:
    return <MonitorCog {...props}className={clsx('w-4 h-4', props.className)}/>
  }
}

export type ThemeSelectProps = Omit<SelectProps, 'value' | 'children'>

export const ThemeSelect = ({ ...props }: ThemeSelectProps) => {
  const translation = useHightideTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <Select
      value={theme}
      onEditComplete={(theme) => {
        props.onEditComplete?.(theme)
        setTheme(theme as ThemeType)
      }}
      iconAppearance="right"
      {...props}
      buttonProps={{
        ...props.buttonProps,
        className: clsx('min-w-40 w-fit', props.buttonProps?.className),
      }}
    >
      {ThemeUtil.themes.map((theme) => (
        <SelectOption
          key={theme}
          value={theme}
          label={translation('sThemeMode', { theme: theme })}
          className="gap-x-6 justify-between"
        >
          <div className="flex-row-2 items-center">
            <ThemeIcon theme={theme}/>
            {translation('sThemeMode', { theme: theme })}
          </div>
        </SelectOption>
      ))}
    </Select>
  )
}

export interface ThemeDialogProps extends Omit<DialogProps, 'titleElement' | 'description'> {
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
  const translation = useHightideTranslation()

  return (
    <Dialog
      titleElement={titleOverwrite ?? translation('pThemes', { count: 1 })}
      description={descriptionOverwrite ?? translation('chooseTheme')}
      onClose={onClose}
      className="w-80"
      {...props}
    >
      <ThemeSelect />
      <div className="flex-row-4 w-full mt-3 justify-end">
        <Button onClick={onClose}>
          {translation('done')}
        </Button>
      </div>
    </Dialog>
  )
}
