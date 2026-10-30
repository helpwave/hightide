import { MultiSelectChipDisplayTrigger } from './MultiSelectChipDisplayTrigger'
import { MultiSelectComponent } from './MultiSelectComponent'
import { MultiSelectContent } from './MultiSelectContent'
import { MultiSelectContext } from './MultiSelectContext'
import { MultiSelectOption } from './MultiSelectOption'
import { MultiSelectStateManager } from './MultiSelectStateManager'
import { MultiSelectTrigger } from './MultiSelectTrigger'

const MultiSelect = Object.assign(MultiSelectComponent, {
  StateManager: MultiSelectStateManager,
  Trigger: MultiSelectTrigger,
  Option: MultiSelectOption,
  Content: MultiSelectContent,
  ChipDisplayTrigger: MultiSelectChipDisplayTrigger,
  Context: MultiSelectContext,
  Provider: MultiSelectContext.Provider,
  Consumer: MultiSelectContext.Consumer,
})

export { MultiSelect }
