import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import clsx from 'clsx'
import { TextButton } from '../user-action/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

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
                               name,
                               input,
                               softRequired = false,
                               hasValue,
                               icon,
                               readOnly,
                               onRemove,
                               className = '',
                             }: PropertyBaseProps) => {
  const translation = useHightideTranslation()
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
        <div className="max-w-6 min-w-6 text-text-primary">{icon}</div>
        <span className="font-semibold">{name}</span>
      </div>
      <div
        className={clsx(
          'flex-row-2 grow px-3 py-2 justify-between items-center rounded-r-xl border-2 border-l-0 min-h-15', {
            'bg-input-background text-input-text group-hover:border-primary': !requiredAndNoValue,
            'bg-surface-warning group-hover:border-warning border-warning/90': requiredAndNoValue,
          }, className
        )}
      >
        {input({ softRequired, hasValue })}
        {requiredAndNoValue && (
          <div className="text-warning"><AlertTriangle size={24}/></div>
        )}
        {onRemove && !readOnly && (
          <TextButton
            onClick={onRemove}
            color="negative"
            className={clsx('items-center')}
            disabled={!hasValue}
          >
            {translation('remove')}
          </TextButton>
        )}
      </div>
    </div>
  )
}
