import { MultiSelectComponent } from './MultiSelectComponent'
import { MultiSelectContext } from './MultiSelectContext'
import { MultiSelectMenu } from './MultiSelectMenu'
import { MultiSelectOption } from './MultiSelectOption'
import { MultiSelectRoot } from './MultiSelectRoot'
import { MultiSelectTrigger } from './MultiSelectTrigger'

const MultiSelect = Object.assign(MultiSelectComponent, {
  Root: MultiSelectRoot,
  Trigger: MultiSelectTrigger,
  Option: MultiSelectOption,
  Menu: MultiSelectMenu,
  Context: MultiSelectContext,
  Provider: MultiSelectContext.Provider,
})

export { MultiSelect }
