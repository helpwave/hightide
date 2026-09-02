import { SelectComponent } from './SelectComponent'
import { SelectContent } from './SelectContent'
import { SelectContext } from './SelectContext'
import { SelectOption } from './SelectOption'
import { SelectRoot } from './SelectRoot'
import { SelectTrigger } from './SelectTrigger'

const Select = Object.assign(SelectComponent, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Option: SelectOption,
  Content: SelectContent,
  Context: SelectContext,
  Provider: SelectContext.Provider,
})

export { Select }
