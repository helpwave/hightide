import { UnknownTypeFilterContext } from './UnknownTypeFilterContext'
import { UnknownTypeFilterStateManager, type UnknownTypeFilterStateManagerProps } from './UnknownTypeFilterStateManager'
import { UnknownTypeFilterOperator } from './UnknownTypeFilterOperator'

export type UnknownTypeFilterProps = Omit<UnknownTypeFilterStateManagerProps, 'children'>

const UnknownTypeFilterComponent = (props: UnknownTypeFilterProps) => {
  return (
    <UnknownTypeFilterStateManager {...props}>
      <UnknownTypeFilterOperator />
    </UnknownTypeFilterStateManager>
  )
}

export const UnknownTypeFilter = Object.assign(UnknownTypeFilterComponent, {
  StateManager: UnknownTypeFilterStateManager,
  Operator: UnknownTypeFilterOperator,
  Context: UnknownTypeFilterContext,
  Provider: UnknownTypeFilterContext.Provider,
  Consumer: UnknownTypeFilterContext.Consumer,
})
