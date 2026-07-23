import { type PropsWithChildren, type ReactNode } from 'react'
import type { DialogProps } from '../Dialog'
import { Dialog } from '../Dialog'
import clsx from 'clsx'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { useTheme } from '../../../../global-contexts/theme/ThemeContext'
import { Button } from '../../../user-interaction/Button'
import type { SelectProps } from '../../../user-interaction/Select/Select'
import { Select } from '../../../user-interaction/Select/Select'
import { SelectOption } from '../../../user-interaction/Select/SelectOption'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

export type ThemeSelectProps = Omit<SelectProps<string | null>, 'value' | 'children'>

export const ThemeSelect = ({ ...props }: ThemeSelectProps) => {
  const { locale } = useLocalization()
  const { preferredThemeMode, setTheme, supportedThemes } = useTheme()
  const translation = useHightideTranslation()
  const systemLabel = translation('system')

  return (
    <Select<string | null>
      value={preferredThemeMode}
      onEditComplete={(value) => {
        props.onEditComplete?.(value)
        setTheme(value)
      }}
      iconAppearance="right"
      {...props}
      buttonProps={{
        ...props.buttonProps,
        className: clsx('min-w-40 w-fit', props.buttonProps?.className),
      }}
      showSearch={false}
    >
      <SelectOption
        key="system"
        value={null}
        label={systemLabel}
        className="gap-x-6 justify-between"
      >
        <div className="flex-row-2 items-center">
          {systemLabel}
        </div>
      </SelectOption>
      {Object.entries(supportedThemes).map(([themeMode, themeInformation]) => {
        const label = themeInformation.nameTranslations[locale] ?? `{{ThemeDialog.themeInformation.nameTranslations:${locale}}}`
        return (
          <SelectOption
            key={themeMode}
            value={themeMode}
            label={label}
            className="gap-x-6 justify-between"
          >
            <div className="flex-row-2 items-center">
              {label}
            </div>
          </SelectOption>
        )
      })}
    </Select>
  )
}

export interface ThemeDialogProps extends Omit<DialogProps, 'titleElement' | 'description'> {
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}

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
