import type { ReactNode } from 'react'
import { AlertTriangle, Trash, X } from 'lucide-react'
import { Button } from '@/src/components/user-interaction/Button'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Tooltip } from '../Tooltip'
import { PropsUtil } from '@/src/utils/propsUtil'

export type PropertyField<T> = {
  name: string,
  required?: boolean,
  readOnly?: boolean,
  allowClear?: boolean,
  value?: T,
  onRemove?: () => void,
  onValueClear?: () => void,
  onValueChange?: (value: T) => void,
  onEditComplete?: (value: T) => void,
}


export type PropertyBaseProps = {
  children: (props: { required: boolean, hasValue: boolean, invalid: boolean }) => ReactNode,
  name: string,
  required?: boolean,
  readOnly?: boolean,
  allowClear?: boolean,
  allowRemove?: boolean,
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
  required = false,
  hasValue,
  icon,
  readOnly,
  allowClear = true,
  allowRemove = true,
  onRemove,
  onValueClear,
  className,
}: PropertyBaseProps) => {
  const translation = useHightideTranslation()
  const invalid = required && !hasValue
  
  const isClearEnabled = allowClear && !readOnly
  const isRemoveEnabled = allowRemove && !readOnly
  const showActionsContainer = isClearEnabled || isRemoveEnabled

  return (
    <div
      className={className ? `group/property ${className}` : 'group/property'}
      data-name="property-root"
      data-invalid={PropsUtil.dataAttributes.bool(invalid)}
    >
      <div
        className={className}
        data-name="property-title"
        data-invalid={PropsUtil.dataAttributes.bool(invalid)}
      >
        <Tooltip tooltip={name} containerClassName="min-w-0">
          <div className='flex-row-1 items-center'>
            <div data-name="property-title-icon">{icon}</div>
            <span data-name="property-title-text">{name}</span>
          </div>
        </Tooltip>
        {invalid && (
            <AlertTriangle className='size-force-6'/>
        )}
      </div>
      <div
        className={className}
        data-name="property-content"
        data-invalid={PropsUtil.dataAttributes.bool(invalid)}
      >
        {children({ required, hasValue, invalid })}
        {showActionsContainer && (
          <div data-name="property-actions">
            {isClearEnabled && (
              <Tooltip tooltip={translation('clearValue')}>
                <Button
                  onClick={onValueClear}
                  disabled={!hasValue}
                  color="negative"
                  coloringStyle="text"
                  layout="icon"
                  size="sm"
                >
                  <X className='size-force-5' />
                </Button>
              </Tooltip>
            )}
            {isRemoveEnabled && (
              <Tooltip tooltip={translation('removeProperty')}> 
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
        )}
      </div>
    </div>
  )
}
