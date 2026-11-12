import { SingleTagFilterContext } from './SingleTagFilterContext'

import { SingleTagFilterStateManager, type SingleTagFilterStateManagerProps } from './SingleTagFilterStateManager'
import { SingleTagFilterOperator } from './SingleTagFilterOperator'
import { SingleTagFilterParameter } from './SingleTagFilterParameter'
import { SingleTagFilterLayout } from './SingleTagFilterLayout'

export type SingleTagFilterProps = Omit<SingleTagFilterStateManagerProps, 'children'>

const SingleTagFilterComponent = (props: SingleTagFilterProps) => {
  return (
    <SingleTagFilterStateManager {...props}>
      <SingleTagFilterLayout>
        <SingleTagFilterOperator />
        <SingleTagFilterParameter />
      </SingleTagFilterLayout>
    </SingleTagFilterStateManager>
  )
}

export const SingleTagFilter = Object.assign(SingleTagFilterComponent, {
  StateManager: SingleTagFilterStateManager,
  Layout: SingleTagFilterLayout,
  Operator: SingleTagFilterOperator,
  Parameter: SingleTagFilterParameter,
  Context: SingleTagFilterContext,
  Provider: SingleTagFilterContext.Provider,
  Consumer: SingleTagFilterContext.Consumer,
})
