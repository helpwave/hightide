import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Visibility } from '../../layout/Visibility'
import { IconButton } from '../../interaction/IconButton'
import { Check, TrashIcon } from 'lucide-react'
import { PopUp, type PopUpProps } from '../../layout/PopUp/PopUp'
import type { FilterOperator } from '../filter-operator'
import { FilterOperatorUtils } from '../filter-operator'
import type { ReactNode } from 'react'
import { forwardRef, useEffect, useMemo } from 'react'
import { Select } from '../../data-input/selection/Select/Select'
import clsx from 'clsx'
import { FilterOperatorLabel } from './FilterOperatorLabel'

export interface FilterPopUpBaseProps extends PopUpProps {
  name?: ReactNode,
  operator: FilterOperator,
  onOperatorChange: (operator: FilterOperator) => void,
  onRemove: () => void,
  allowedOperators: FilterOperator[],
  operatorOverrides?: FilterOperator[],
  noParameterRequired?: boolean,
}

export const FilterBasePopUp = forwardRef<HTMLDivElement, FilterPopUpBaseProps>(function FilterBasePopUp({
  children,
  name,
  operator,
  onOperatorChange,
  onRemove,
  allowedOperators,
  operatorOverrides,
  noParameterRequired = false,
  ...props
}: FilterPopUpBaseProps, ref) {
  const translation = useHightideTranslation()
  const operators = useMemo(() => {
    if (!operatorOverrides || operatorOverrides.length === 0) return allowedOperators
    return allowedOperators.filter(op => operatorOverrides.includes(op))
  }, [allowedOperators, operatorOverrides])

  useEffect(() => {
    if (operators.length === 0) {
      onRemove()
    }
  }, [operators, onRemove])

  return (
    <PopUp
      ref={ref}
      {...props}
      className={clsx('flex-col-3 p-3 relative min-w-64', props.className)}
    >
      <div className="flex-row-4 justify-between w-full">
        <div className="flex-row-0.5 items-center">
          <span className="typography-label-sm text-description">{name ?? translation('filter')}</span>
          <Select
            value={operator}
            onValueChange={(newOperator) => onOperatorChange(newOperator as FilterOperator)}
            triggerProps={{
              className: 'filter-operator-select w-fit flex-row-1 items-center h-element-sm px-2 py-1 rounded-md hover:cursor-pointer font-bold',
              selectedDisplay: (option) => option ? translation(FilterOperatorUtils.getInfo(option.value).translationKey as Parameters<typeof translation>[0]) : '',
            }}
            iconAppearance="right"
            options={operators.map((op) => ({
              value: op,
              label: translation(FilterOperatorUtils.getInfo(op).translationKey as Parameters<typeof translation>[0]),
              visual: {
                content: <FilterOperatorLabel operator={op} />,
              },
            }))}
          />
        </div>
        <div className="flex-row-0 items-center">
          <IconButton
            tooltip={translation('removeFilter')}
            onClick={onRemove}
            color="negative"
            variant="foreground"
            size="sm"
            icon={TrashIcon}
          />
          <IconButton
            tooltip={translation('done')}
            onClick={props.onClose}
            color="neutral"
            variant="foreground"
            size="sm"
            icon={Check}
          />
        </div>
      </div>
      {children}
      <Visibility isVisible={noParameterRequired}>
        <div className="flex-row-0 items-center text-sm text-description h-element-sm">
          {translation('noParameterRequired')}
        </div>
      </Visibility>
    </PopUp>
  )
})

export interface FilterPopUpShellProps extends PopUpProps {
  name?: ReactNode,
  onRemove: () => void,
  noParameterRequired?: boolean,
  operator?: ReactNode,
}

export const FilterPopUpShell = forwardRef<HTMLDivElement, FilterPopUpShellProps>(function FilterPopUpShell({
  children,
  name,
  onRemove,
  noParameterRequired = false,
  operator,
  ...props
}: FilterPopUpShellProps, ref) {
  const translation = useHightideTranslation()

  return (
    <PopUp
      ref={ref}
      {...props}
      className={clsx('flex-col-3 p-3 relative min-w-64', props.className)}
    >
      <div className="flex-row-4 justify-between w-full">
        <div className="flex-row-0.5 items-center">
          <span className="typography-label-sm text-description">{name ?? translation('filter')}</span>
          {operator}
        </div>
        <div className="flex-row-0 items-center">
          <IconButton
            tooltip={translation('removeFilter')}
            onClick={onRemove}
            color="negative"
            variant="foreground"
            size="sm"
            icon={TrashIcon}
          />
          <IconButton
            tooltip={translation('done')}
            onClick={props.onClose}
            color="neutral"
            variant="foreground"
            size="sm"
            icon={Check}
          />
        </div>
      </div>
      {children}
      <Visibility isVisible={noParameterRequired}>
        <div className="flex-row-0 items-center text-sm text-description h-element-sm">
          {translation('noParameterRequired')}
        </div>
      </Visibility>
    </PopUp>
  )
})
