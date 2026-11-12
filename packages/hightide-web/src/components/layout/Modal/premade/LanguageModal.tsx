import type { PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { Button } from '../../../interaction/Button'
import type { SelectProps } from '../../../data-input/selection/Select/SelectComponent'
import { Select } from '../../../data-input/selection/Select/Select'
import type { ModalProps } from '../Modal'
import { Modal } from '../Modal'

type LanguageSelectProps = Omit<SelectProps, 'value' | 'options'>

export const LanguageSelect = ({ ...props }: LanguageSelectProps) => {
  const { locale, setLocale, supportedLocales } = useLocalization()

  return (
    <Select
      {...props}
      value={locale}
      onValueChange={(language) => {
        if (language == null) return
        setLocale(language)
        props.onValueChange?.(language)
      }}
      triggerProps={{
        ...props.triggerProps,
        className: clsx('min-w-40 w-fit', props.triggerProps?.className),
      }}
      options={Object.entries(supportedLocales).map(([supportedLocale, { localeName }]) => ({
        value: supportedLocale,
        label: localeName,
        visual: { content: localeName },
      }))}
    />
  )
}

type LanguageModalProps = Omit<ModalProps, 'titleElement' | 'description'> & PropsWithChildren<{
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}>

export const LanguageModal = ({
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
      panelProps={{
        ...contentProps,
        className: clsx('w-80', contentProps?.className),
      }}
    >
      <LanguageSelect />
      <div className="flex-row-4 mt-3 justify-end">
        <Modal.Consumer>
          {(context) => {
            return (
              <Button color="positive" onClick={() => context?.dispatch({ type: 'close' })}>
                {translation('done')}
              </Button>
            )
          }}
        </Modal.Consumer>
      </div>
    </Modal>
  )
}
