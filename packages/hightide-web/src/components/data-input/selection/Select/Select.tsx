import { SelectComponent } from './SelectComponent'
import { SelectContent } from './SelectContent'
import { SelectContext } from './SelectContext'
import { SelectOption } from './SelectOption'
import { SelectStateManager } from './SelectStateManager'
import { SelectTrigger } from './SelectTrigger'

const Select = Object.assign(SelectComponent, {
  StateManager: SelectStateManager,
  Trigger: SelectTrigger,
  Option: SelectOption,
  Content: SelectContent,
  Context: SelectContext,
  Provider: SelectContext.Provider,
  Consumer: SelectContext.Consumer,
})

export { Select }
