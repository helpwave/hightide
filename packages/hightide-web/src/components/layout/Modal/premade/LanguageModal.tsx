import type { PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { Button } from '../../../interaction/Button'
import type { SelectProps } from '../../../data-input/Select/SelectComponent'
import { Select } from '../../../data-input/Select/Select'
import type { ModalProps } from '../Modal'
import { Modal } from '../Modal'

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
      triggerProps={{
        ...props.triggerProps,
        className: clsx('min-w-40 w-fit', props.triggerProps?.className),
      }}
    >
      {Object.entries(supportedLocales).map(([supportedLocale, { localName }]) => (
        <Select.Option
          key={supportedLocale}
          value={supportedLocale}
          label={localName}
        >
          {localName}
        </Select.Option>
      ))}
    </Select>
  )
}

type LanguageModalProps = Omit<ModalProps, 'titleElement' | 'description'> & PropsWithChildren<{
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}>

export const LanguageModal = ({
  onClose,
  titleOverwrite,
  descriptionOverwrite,
  panelProps: contentProps,
  ...props
}: LanguageModalProps) => {
  const translation = useHightideTranslation()

  return (
    <Modal
      {...props}
      titleElement={titleOverwrite ?? translation('language')}
      description={descriptionOverwrite ?? translation('chooseLanguage')}
      onClose={onClose}
      panelProps={{
        ...contentProps,
        className: clsx('w-80', contentProps?.className),
      }}
    >
      <LanguageSelect />
      <div className="flex-row-4 mt-3 justify-end">
        <Button color="positive" onClick={onClose}>
          {translation('done')}
        </Button>
      </div>
    </Modal>
  )
}
