import type { PropsWithChildren, ReactNode } from 'react'
import type { DialogProps } from '@/src/components/layout/dialog/Dialog'
import { Dialog } from '@/src/components/layout/dialog/Dialog'
import { LocalizationUtil } from '@/src/i18n/util'
import { useLocale } from '@/src/global-contexts/LocaleContext'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { HightideTranslationLocales } from '@/src/i18n/translations'
import type { SelectProps } from '@/src/components/user-interaction/select/Select'
import { Select } from '@/src/components/user-interaction/select/Select'
import { SelectOption } from '@/src/components/user-interaction/select/SelectComponents'
import clsx from 'clsx'

type LanguageSelectProps = Omit<SelectProps, 'value'>

export const LanguageSelect = ({ ...props }: LanguageSelectProps) => {
  const { locale, setLocale } = useLocale()

  return (
    <Select
      {...props}
      value={locale}
      onValueChange={(language: string) => {
        setLocale(language as HightideTranslationLocales)
        props.onValueChange?.(language)
      }}
      buttonProps={{
        ...props.buttonProps,
        className: clsx('min-w-40 w-fit', props.buttonProps?.className),
      }}
    >
      {LocalizationUtil.locals.map((local) => (
        <SelectOption key={local} value={local} label={LocalizationUtil.languagesLocalNames[local]}>
          {LocalizationUtil.languagesLocalNames[local]}
        </SelectOption>
      ))}
    </Select>
  )
}

type LanguageDialogProps = Omit<DialogProps, 'titleElement' | 'description'> & PropsWithChildren<{
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}>

/**
 * A Dialog for selecting the Language
 *
 * The State of open needs to be managed by the parent
 */
export const LanguageDialog = ({
  onClose,
  titleOverwrite,
  descriptionOverwrite,
  ...props
}: LanguageDialogProps) => {
  const translation = useHightideTranslation()

  return (
    <Dialog
      titleElement={titleOverwrite ?? translation('language')}
      description={descriptionOverwrite ?? translation('chooseLanguage')}
      onClose={onClose}
      className={clsx('w-80', props.className)}
      {...props}
    >
      <LanguageSelect />
      <div className="flex-row-4 mt-3 justify-end">
        <Button color="positive" onClick={onClose}>
          {translation('done')}
        </Button>
      </div>
    </Dialog>
  )
}
