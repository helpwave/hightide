import type { ReactNode } from 'react'
import clsx from 'clsx'
import { AlertTriangle, Trash, X } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Tooltip } from '../interaction/Tooltip'
import { PropsUtil } from '../../utils/propsUtil'
import { IconButton } from '../interaction/IconButton'

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

  const renderActionButtons = () => (
    <>
      {isClearEnabled && (
        <IconButton
          tooltip={translation('clearValue')}
          onClick={onValueClear}
          disabled={!hasValue}
          color="negative"
          variant="foreground"
          size="sm"
          icon={X}
        />
      )}
      {isRemoveEnabled && (
        <IconButton
          tooltip={translation('removeProperty')}
          onClick={onRemove}
          color="negative"
          variant="foreground"
          size="sm"
          icon={Trash}
        />
      )}
    </>
  )

  return (
    <div
      className={clsx('property-root group/property min-w-0 w-full', className)}
      data-invalid={PropsUtil.dataAttributes.bool(invalid)}
    >
      <div className="property-inner">
        <div
          className="property-title"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          <div className="flex min-w-0 flex-1 flex-row items-center justify-between gap-2">
            <Tooltip tooltip={name} containerClassName="min-w-0">
              <div className="flex-row-1 items-center">
                <div className="property-title-icon">{icon}</div>
                <span className="property-title-text">{name}</span>
              </div>
            </Tooltip>
            {invalid && (
              <Icon icon={AlertTriangle} />
            )}
          </div>
          {showActionsContainer && (
            <div className="property-title-actions">
              {renderActionButtons()}
            </div>
          )}
        </div>
        <div
          className="property-content"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          {children({ required, hasValue, invalid })}
          {showActionsContainer && (
            <div className="property-actions">
              {renderActionButtons()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
