import { DateFilterContext } from './DateFilterContext'
import { DateFilterStateManager, type DateFilterStateManagerProps } from './DateFilterStateManager'
import { DateFilterOperator } from './DateFilterOperator'
import { DateFilterParameter } from './DateFilterParameter'
import { DateFilterLayout } from './DateFilterLayout'

export type DateFilterProps = Omit<DateFilterStateManagerProps, 'children'>

const DateFilterComponent = (props: DateFilterProps) => {
  return (
    <DateFilterStateManager {...props}>
      <DateFilterLayout>
        <DateFilterOperator />
        <DateFilterParameter />
      </DateFilterLayout>
    </DateFilterStateManager>
  )
}

export const DateFilter = Object.assign(DateFilterComponent, {
  StateManager: DateFilterStateManager,
  Layout: DateFilterLayout,
  Operator: DateFilterOperator,
  Parameter: DateFilterParameter,
  Context: DateFilterContext,
  Provider: DateFilterContext.Provider,
  Consumer: DateFilterContext.Consumer,
})
