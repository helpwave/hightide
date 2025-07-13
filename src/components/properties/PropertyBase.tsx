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
    <div className={clsx('flex-row-0 group', className)}>
      <div
        className={clsx(
          'flex-row-2 max-w-48 min-w-48 px-3 py-2 items-center rounded-l-xl border-2 border-r-0', {
            'bg-property-title-background text-property-title-text group-hover:border-primary': !requiredAndNoValue,
            'bg-warning text-surface-warning group-hover:border-warning border-warning/90': requiredAndNoValue,
          }, className
        )}
      >
        <div className="max-w-6 min-w-6 text-text-default">{icon}</div>
        <span className="font-semibold">{name}</span>
      </div>
      <div
        className={clsx(
          'flex-row-2 grow px-3 py-2 justify-between items-center rounded-r-xl border-2 border-l-0 min-h-15', {
            'bg-surface group-hover:border-primary': !requiredAndNoValue,
            'bg-surface-warning group-hover:border-warning border-warning/90': requiredAndNoValue,
          }, className
        )}
      >
        {input({ softRequired, hasValue })}
        {requiredAndNoValue && (
          <div className="text-warning"><AlertTriangle size={24}/></div>
        )}
        {onRemove && hasValue && (
          <TextButton
            onClick={onRemove}
            color="negative"
            className={clsx('items-center', { '!text-transparent': !hasValue || readOnly })}
            disabled={!hasValue || readOnly}
          >
            {translation('remove')}
          </TextButton>
        )}
      </div>
    </div>
  )
}
