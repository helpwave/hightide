import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import clsx from 'clsx'
import { TextButton } from '../user-action/Button'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'

type PropertyBaseTranslation = FormTranslationType

export type PropertyBaseProps = {
  name: string,
  input: (props: { softRequired: boolean, hasValue: boolean }) => ReactNode,
  onRemove?: () => void,
  hasValue: boolean,
  softRequired?: boolean,
  readOnly?: boolean,
  icon?: ReactNode,
  className?: string,
}

/**
 * A component for showing a properties with uniform styling
 */
export const PropertyBase = ({
                               overwriteTranslation,
                               name,
                               input,
                               softRequired = false,
                               hasValue,
                               icon,
                               readOnly,
                               onRemove,
                               className = '',
                             }: PropsForTranslation<PropertyBaseTranslation, PropertyBaseProps>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)
  const requiredAndNoValue = softRequired && !hasValue
  return (
    <div className={clsx('row gap-x-0 group', className)}>
      <div
        className={
          clsx('row gap-x-2 !w-[200px] px-4 py-2 items-center rounded-l-xl border-2 border-r-0', {
            'bg-property-title-background property-title-text group-hover:border-primary': !requiredAndNoValue,
            'bg-warning text-surface-warning group-hover:border-warning border-warning/90': requiredAndNoValue,
          }, className)}
      >
        {icon}
        {name}
      </div>
      <div className={
        clsx('row gap-x-0 grow justify-between items-center rounded-r-xl border-2 border-l-0', {
          'bg-surface group-hover:border-primary': !requiredAndNoValue,
          'bg-surface-warning group-hover:border-warning border-warning/90': requiredAndNoValue,
        }, className)}
      >
        {input({ softRequired, hasValue })}
        {requiredAndNoValue && (
          <div className="text-warning pr-4"><AlertTriangle size={24}/></div>
        )}
        {onRemove && (
          <TextButton
            onClick={onRemove}
            color="negative"
            className={clsx('pr-4 items-center', { '!text-transparent': !hasValue || readOnly })}
            disabled={!hasValue || readOnly}
          >
            {translation('remove')}
          </TextButton>
        )}
      </div>
    </div>
  )
}
