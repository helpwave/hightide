import { type PropsWithChildren, type ReactNode } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { useTheme } from '../../../../global-contexts/theme/ThemeContext'
import { Button } from '../../../interaction/Button'
import type { SelectProps } from '../../../data-input/selection/Select/SelectComponent'
import { Select } from '../../../data-input/selection/Select/Select'
import type { ModalProps } from '../Modal'
import { Modal } from '../Modal'

export type ThemeSelectProps = Omit<SelectProps<string | null>, 'value' | 'options'>

export const ThemeSelect = ({ ...props }: ThemeSelectProps) => {
  const { locale } = useLocalization()
  const { preferredThemeMode, setTheme, supportedThemes } = useTheme()
  const translation = useHightideTranslation()
  const systemLabel = translation('system')

  return (
    <Select<string | null>
      {...props}
      value={preferredThemeMode}
      iconAppearance="right"
      onStateEvent={(event) => {
        props.onStateEvent?.(event)
        if (event.type === 'commit') setTheme(event.value)
      }}
      triggerProps={{
        ...props.triggerProps,
        className: clsx('min-w-40 w-fit', props.triggerProps?.className),
      }}
      options={[
        {
          id: 'system',
          value: null,
          label: systemLabel,
          visual: {
            className: 'gap-x-6 justify-between',
            content: (
              <div className="flex-row-2 items-center">
                {systemLabel}
              </div>
            ),
          },
        },
        ...Object.entries(supportedThemes).map(([themeMode, themeInformation]) => {
          const label = themeInformation.nameTranslations[locale] ?? `{{ThemeModal.themeInformation.nameTranslations:${locale}}}`
          return {
            id: themeMode,
            value: themeMode,
            label,
            visual: {
              className: 'gap-x-6 justify-between',
              content: (
                <div className="flex-row-2 items-center">
                  {label}
                </div>
              ),
            },
          }
        }),
      ]}
    />
  )
}

export interface ThemeModalProps extends Omit<ModalProps, 'titleElement' | 'description'> {
  titleOverwrite?: ReactNode,
  descriptionOverwrite?: ReactNode,
}

export const ThemeModal = ({
  onClose,
  titleOverwrite,
  descriptionOverwrite,
  panelProps: contentProps,
  ...props
}: PropsWithChildren<ThemeModalProps>) => {
  const translation = useHightideTranslation()

  return (
    <Modal
      {...props}
      titleElement={titleOverwrite ?? translation('pThemes', { count: 1 })}
      description={descriptionOverwrite ?? translation('chooseTheme')}
      onClose={onClose}
      panelProps={{
        ...contentProps,
        className: clsx('w-80', contentProps?.className),
      }}
    >
      <ThemeSelect />
      <div className="flex-row-4 w-full mt-3 justify-end">
        <Button onClick={onClose}>
          {translation('done')}
        </Button>
      </div>
    </Modal>
  )
}
