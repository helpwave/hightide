import type { ReactNode } from 'react'
import clsx from 'clsx'
import { AlertTriangle, Trash, X } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Tooltip } from '../Tooltip'
import { PropsUtil } from '@/src/utils/propsUtil'
import { IconButton } from '../IconButton'

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
      className={clsx('group/property', 'property-root', className)}
      data-invalid={PropsUtil.dataAttributes.bool(invalid)}
    >
      <div
        className={clsx('property-title', className)}
        data-invalid={PropsUtil.dataAttributes.bool(invalid)}
      >
        <Tooltip tooltip={name} containerClassName="min-w-0">
          <div className="flex-row-1 items-center">
            <div className="property-title-icon">{icon}</div>
            <span className="property-title-text">{name}</span>
          </div>
        </Tooltip>
        {invalid && (
          <AlertTriangle className="size-force-6"/>
        )}
      </div>
      <div
        className={clsx('property-content', className)}
        data-invalid={PropsUtil.dataAttributes.bool(invalid)}
      >
        {children({ required, hasValue, invalid })}
        {showActionsContainer && (
          <div className="property-actions">
            {isClearEnabled && (
              <IconButton
                tooltip={translation('clearValue')}
                onClick={onValueClear}
                disabled={!hasValue}
                color="negative"
                coloringStyle="text"
                size="sm"
              >
                <X className="size-force-5" />
              </IconButton>
            )}
            {isRemoveEnabled && (
              <IconButton
                tooltip={translation('removeProperty')}
                onClick={onRemove}
                color="negative"
                coloringStyle="text"
                size="sm"
              >
                <Trash className="size-force-5" />
              </IconButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
