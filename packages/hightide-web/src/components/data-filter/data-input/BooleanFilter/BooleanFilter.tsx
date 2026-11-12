import { BooleanFilterContext } from './BooleanFilterContext'
import { BooleanFilterStateManager, type BooleanFilterStateManagerProps } from './BooleanFilterStateManager'
import { BooleanFilterOperator } from './BooleanFilterOperator'

export type BooleanFilterProps = Omit<BooleanFilterStateManagerProps, 'children'>

const BooleanFilterComponent = (props: BooleanFilterProps) => {
  return (
    <BooleanFilterStateManager {...props}>
      <BooleanFilterOperator />
    </BooleanFilterStateManager>
  )
}

export const BooleanFilter = Object.assign(BooleanFilterComponent, {
  StateManager: BooleanFilterStateManager,
  Operator: BooleanFilterOperator,
  Context: BooleanFilterContext,
  Provider: BooleanFilterContext.Provider,
  Consumer: BooleanFilterContext.Consumer,
})
