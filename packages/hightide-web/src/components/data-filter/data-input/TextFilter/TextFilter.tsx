import { TextFilterContext } from './TextFilterContext'
import { TextFilterStateManager, type TextFilterStateManagerProps } from './TextFilterStateManager'
import { TextFilterOperator } from './TextFilterOperator'
import { TextFilterParameter } from './TextFilterParameter'
import { TextFilterLayout } from './TextFilterLayout'

export type TextFilterProps = Omit<TextFilterStateManagerProps, 'children'>

const TextFilterComponent = (props: TextFilterProps) => {
  return (
    <TextFilterStateManager {...props}>
      <TextFilterLayout>
        <TextFilterOperator />
        <TextFilterParameter />
      </TextFilterLayout>
    </TextFilterStateManager>
  )
}

export const TextFilter = Object.assign(TextFilterComponent, {
  StateManager: TextFilterStateManager,
  Layout: TextFilterLayout,
  Operator: TextFilterOperator,
  Parameter: TextFilterParameter,
  Context: TextFilterContext,
  Provider: TextFilterContext.Provider,
  Consumer: TextFilterContext.Consumer,
})
