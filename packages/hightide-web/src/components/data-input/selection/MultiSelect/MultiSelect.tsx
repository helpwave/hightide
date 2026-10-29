import { MultiSelectChipDisplayTrigger } from './MultiSelectChipDisplayTrigger'
import { MultiSelectComponent } from './MultiSelectComponent'
import { MultiSelectContent } from './MultiSelectContent'
import { MultiSelectContext } from './MultiSelectContext'
import { MultiSelectOption } from './MultiSelectOption'
import { MultiSelectRoot } from './MultiSelectRoot'
import { MultiSelectTrigger } from './MultiSelectTrigger'

const MultiSelect = Object.assign(MultiSelectComponent, {
  Root: MultiSelectRoot,
  Trigger: MultiSelectTrigger,
  Option: MultiSelectOption,
  Content: MultiSelectContent,
  ChipDisplayTrigger: MultiSelectChipDisplayTrigger,
  Context: MultiSelectContext,
  Provider: MultiSelectContext.Provider,
})

export { MultiSelect }
