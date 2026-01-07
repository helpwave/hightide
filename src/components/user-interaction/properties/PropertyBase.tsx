import type { ReactNode } from 'react'
import { AlertTriangle, Trash, X } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Tooltip } from '../Tooltip'

export type PropertyField<T> = {
  name: string,
  softRequired?: boolean,
  readOnly?: boolean,
  allowClear?: boolean,
  value?: T,
  onRemove?: () => void,
  onValueClear?: () => void,
  onValueChange?: (value: T) => void,
  onEditComplete?: (value: T) => void,
}


export type PropertyBaseProps = {
  children: (props: { softRequired: boolean, hasValue: boolean }) => ReactNode,
  name: string,
  softRequired?: boolean,
  readOnly?: boolean,
  allowClear?: boolean,
  hasValue: boolean,
  onRemove?: () => void,
  onValueClear?: () => void,
  icon?: ReactNode,
  className?: string,
}

/**
 * A component for showing a properties with uniform styling
 */
export const PropertyBase = ({
  name,
  children,
  softRequired = false,
  hasValue,
  icon,
  readOnly,
  allowClear = false,
  onRemove,
  onValueClear,
  className = '',
}: PropertyBaseProps) => {
  const translation = useHightideTranslation()
  const requiredAndNoValue = softRequired && !hasValue
  return (
    <div className={clsx('flex-row-0 group', className)}>
      <div
        className={clsx(
          'flex-row-2 max-w-48 min-w-48 px-3 py-2 items-center rounded-l-xl border-2 border-r-0', {
            'bg-property-title-background text-property-title-text group-hover:border-primary group-focus-within:border-primary': !requiredAndNoValue,
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
            'bg-input-background text-input-text group-hover:border-primary group-focus-within:border-primary': !requiredAndNoValue,
            'bg-surface-warning group-hover:border-warning border-warning/90': requiredAndNoValue,
          }, className
        )}
      >
        {children({ softRequired, hasValue })}
        {allowClear && hasValue && (
          <Tooltip tooltip={translation('clearValue')}>
            <Button
              onClick={onValueClear}
              color="negative"
              coloringStyle="text"
              layout="icon"
              size="sm"
            >
              <X className='size-force-5' />
            </Button>
          </Tooltip>
        )}
        {requiredAndNoValue && (
          <div className="text-warning"><AlertTriangle className='size-force-6'/></div>
        )}
        {onRemove && !readOnly && (
          <Tooltip tooltip={translation('clearProperty')}> 
            <Button
              onClick={onRemove}
              color="negative"
              coloringStyle="text"
              layout="icon"
              size="sm"
            >
              <Trash className='size-force-5' />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
