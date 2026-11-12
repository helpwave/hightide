import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Select } from '../../data-input/selection/Select/Select'
import type { FilterOperator } from '../filter-operator'
import { FilterOperatorUtils } from '../filter-operator'
import { FilterOperatorLabel } from '../interaction/FilterOperatorLabel'

export type FilterOperatorSelectProps<O extends FilterOperator> = {
  value: O,
  onValueChange: (operator: O) => void,
  operators: readonly O[],
  isDisabled?: boolean,
  isReadOnly?: boolean,
  isInvalid?: boolean,
  isRequired?: boolean,
}

export function FilterOperatorSelect<O extends FilterOperator>({
  value,
  onValueChange,
  operators,
  isDisabled,
  isReadOnly,
  isInvalid,
  isRequired,
}: FilterOperatorSelectProps<O>) {
  const translation = useHightideTranslation()

  return (
    <Select<string>
      value={value}
      onValueChange={(newOperator) => {
        if (newOperator == null) return
        onValueChange(newOperator as O)
      }}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      isRequired={isRequired}
      triggerProps={{
        appearance: 'text',
        selectedDisplay: (option) => option ? translation(FilterOperatorUtils.getInfo(option.value as FilterOperator).translationKey as Parameters<typeof translation>[0]) : '',
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
  )
}
