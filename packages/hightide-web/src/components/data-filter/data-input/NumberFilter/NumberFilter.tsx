import { NumberFilterContext } from './NumberFilterContext'
import { NumberFilterStateManager, type NumberFilterStateManagerProps } from './NumberFilterStateManager'
import { NumberFilterOperator } from './NumberFilterOperator'
import { NumberFilterParameter } from './NumberFilterParameter'
import { NumberFilterLayout } from './NumberFilterLayout'

export type NumberFilterProps = Omit<NumberFilterStateManagerProps, 'children'>

const NumberFilterComponent = (props: NumberFilterProps) => {
  return (
    <NumberFilterStateManager {...props}>
      <NumberFilterLayout>
        <NumberFilterOperator />
        <NumberFilterParameter />
      </NumberFilterLayout>
    </NumberFilterStateManager>
  )
}

export const NumberFilter = Object.assign(NumberFilterComponent, {
  StateManager: NumberFilterStateManager,
  Layout: NumberFilterLayout,
  Operator: NumberFilterOperator,
  Parameter: NumberFilterParameter,
  Context: NumberFilterContext,
  Provider: NumberFilterContext.Provider,
  Consumer: NumberFilterContext.Consumer,
})
