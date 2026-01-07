import { Binary } from 'lucide-react'
import clsx from 'clsx'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { PropertyBase, PropertyField } from './PropertyBase'

export type NumberPropertyProps = PropertyField<number>
& { suffix?: string }

/**
 * An Input for number properties
 */
export const NumberProperty = ({
  value,
  onRemove,
  onValueChange,
  onEditComplete,
  readOnly,
  suffix,
  ...baseProps
}: NumberPropertyProps) => {
  const translation = useHightideTranslation()
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      onRemove={onRemove}
      hasValue={hasValue}
      icon={<Binary size={24}/>}
    >
      {({ softRequired }) => (
        // TODO this max width might be to low for some numbers
        <div
          className={clsx('relative flex-row-2 max-w-56', { 'text-warning': softRequired && !hasValue })}
        >
          <Input
            className={clsx('default-style-none focus-style-none w-full pr-8', { 'bg-surface-warning placeholder-warning': softRequired && !hasValue })}
            value={value?.toString() ?? ''}
            type="number"
            readOnly={readOnly}
            placeholder={`${translation('value')}...`}
            onValueChange={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onRemove()
              } else {
                onValueChange?.(numberValue)
              }
            }}
            onEditComplete={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onRemove()
              } else {
                onEditComplete?.(numberValue)
              }
            }}
          />
          {suffix && (
            <span
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 right-2',
                { 'bg-surface-warning': softRequired && !hasValue }
              )}
            >
              {suffix}
            </span>
          )}
        </div>
      )}
    </PropertyBase>
  )
}
