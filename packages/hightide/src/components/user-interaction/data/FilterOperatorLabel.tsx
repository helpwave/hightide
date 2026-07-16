import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import type { FilterOperator } from '@/src/components/user-interaction/data/FilterOperator'
import { FilterOperatorUtils } from '@/src/components/user-interaction/data/FilterOperator'

export type FilterOperatorLabelProps = {
    operator: FilterOperator,
  }

export const FilterOperatorLabel = ({ operator }: FilterOperatorLabelProps) => {
  const translation = useHightideTranslation()
  const { icon, translationKey } = FilterOperatorUtils.getInfo(operator)
  const label = typeof translationKey === 'string'
    ? translation(translationKey as Parameters<typeof translation>[0])
    : translationKey

  return (
    <div className="flex-row-1 items-center gap-2">
      {icon}
      {label}
    </div>
  )
}