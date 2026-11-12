import { DateTimeFilterContext } from './DateTimeFilterContext'
import { DateTimeFilterStateManager, type DateTimeFilterStateManagerProps } from './DateTimeFilterStateManager'
import { DateTimeFilterOperator } from './DateTimeFilterOperator'
import { DateTimeFilterParameter } from './DateTimeFilterParameter'
import { DateTimeFilterLayout } from './DateTimeFilterLayout'

export type DateTimeFilterProps = Omit<DateTimeFilterStateManagerProps, 'children'>

const DateTimeFilterComponent = (props: DateTimeFilterProps) => {
  return (
    <DateTimeFilterStateManager {...props}>
      <DateTimeFilterLayout>
        <DateTimeFilterOperator />
        <DateTimeFilterParameter />
      </DateTimeFilterLayout>
    </DateTimeFilterStateManager>
  )
}

export const DateTimeFilter = Object.assign(DateTimeFilterComponent, {
  StateManager: DateTimeFilterStateManager,
  Layout: DateTimeFilterLayout,
  Operator: DateTimeFilterOperator,
  Parameter: DateTimeFilterParameter,
  Context: DateTimeFilterContext,
  Provider: DateTimeFilterContext.Provider,
  Consumer: DateTimeFilterContext.Consumer,
})
