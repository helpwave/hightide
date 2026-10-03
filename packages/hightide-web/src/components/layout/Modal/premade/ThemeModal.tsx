import { type PropsWithChildren, type ReactNode } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { useTheme } from '../../../../global-contexts/theme/ThemeContext'
import { Button } from '../../../interaction/Button'
import type { SelectProps } from '../../../data-input/Select/SelectComponent'
import { Select } from '../../../data-input/Select/Select'
import type { ModalProps } from '../Modal'
import { Modal } from '../Modal'

export type ThemeSelectProps = Omit<SelectProps<string | null>, 'value' | 'children'>

export const ThemeSelect = ({ ...props }: ThemeSelectProps) => {
  const { locale } = useLocalization()
  const { preferredThemeMode, setTheme, supportedThemes } = useTheme()
  const translation = useHightideTranslation()
  const systemLabel = translation('system')

  return (
    <Select<string | null>
      value={preferredThemeMode}
      onValueCommit={(value) => {
        props.onValueCommit?.(value)
        setTheme(value)
      }}
      iconAppearance="right"
      {...props}
      triggerProps={{
        ...props.triggerProps,
        className: clsx('min-w-40 w-fit', props.triggerProps?.className),
      }}
    >
      <Select.Option
        key="system"
        value={null}
        valueId="system"
        label={systemLabel}
        className="gap-x-6 justify-between"
      >
        <div className="flex-row-2 items-center">
          {systemLabel}
        </div>
      </Select.Option>
      {Object.entries(supportedThemes).map(([themeMode, themeInformation]) => {
        const label = themeInformation.nameTranslations[locale] ?? `{{ThemeModal.themeInformation.nameTranslations:${locale}}}`
        return (
          <Select.Option
            key={themeMode}
            value={themeMode}
            label={label}
            className="gap-x-6 justify-between"
          >
            <div className="flex-row-2 items-center">
              {label}
            </div>
          </Select.Option>
        )
      })}
    </Select>
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
