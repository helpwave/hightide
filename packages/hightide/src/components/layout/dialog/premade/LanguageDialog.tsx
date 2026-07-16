import type { PropsWithChildren, ReactNode } from 'react'
import type { DialogProps } from '@/src/components/layout/dialog/Dialog'
import { Dialog } from '@/src/components/layout/dialog/Dialog'
import { useLocalization } from '@/src/global-contexts/localization'
import { Button } from '@/src/components/user-interaction/Button'
import type { SelectProps } from '@/src/components/user-interaction/Select/Select'
import { Select } from '@/src/components/user-interaction/Select/Select'
import { SelectOption } from '@/src/components/user-interaction/Select/SelectOption'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils'

type LanguageSelectProps = Omit<SelectProps, 'value' | 'children'>

export const LanguageSelect = ({ ...props }: LanguageSelectProps) => {
  const { locale, setLocale, supportedLocales } = useLocalization()

  return (
    <Select
      {...props}
      value={locale}
      onValueChange={(language: string) => {
        setLocale(language)
        props.onValueChange?.(language)
      }}
      buttonProps={{
        ...props.buttonProps,
        className: clsx('min-w-40 w-fit', props.buttonProps?.className),
      }}
    >
      {supportedLocales.map(({ locale: supportedLocale, localName }) => (
        <SelectOption
          key={supportedLocale}
          value={supportedLocale}
          label={localName}
        >
          {localName}
        </SelectOption>
      ))}
    </Select>
  )
}

type LanguageDialogProps = Omit<DialogProps, 'titleElement' | 'description'> & PropsWithChildren<{
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}>

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
