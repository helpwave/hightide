import { MultiTagsFilterContext } from './MultiTagsFilterContext'

import { MultiTagsFilterStateManager, type MultiTagsFilterStateManagerProps } from './MultiTagsFilterStateManager'
import { MultiTagsFilterOperator } from './MultiTagsFilterOperator'
import { MultiTagsFilterParameter } from './MultiTagsFilterParameter'
import { MultiTagsFilterLayout } from './MultiTagsFilterLayout'

export type MultiTagsFilterProps = Omit<MultiTagsFilterStateManagerProps, 'children'>

const MultiTagsFilterComponent = (props: MultiTagsFilterProps) => {
  return (
    <MultiTagsFilterStateManager {...props}>
      <MultiTagsFilterLayout>
        <MultiTagsFilterOperator />
        <MultiTagsFilterParameter />
      </MultiTagsFilterLayout>
    </MultiTagsFilterStateManager>
  )
}

export const MultiTagsFilter = Object.assign(MultiTagsFilterComponent, {
  StateManager: MultiTagsFilterStateManager,
  Layout: MultiTagsFilterLayout,
  Operator: MultiTagsFilterOperator,
  Parameter: MultiTagsFilterParameter,
  Context: MultiTagsFilterContext,
  Provider: MultiTagsFilterContext.Provider,
  Consumer: MultiTagsFilterContext.Consumer,
})
