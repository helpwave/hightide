import { MultiSelectChipDisplayTrigger } from './MultiSelectChipDisplayTrigger'
import { MultiSelectComponent } from './MultiSelectComponent'
import { MultiSelectContent } from './MultiSelectContent'
import { MultiSelectContext } from './MultiSelectContext'
import { MultiSelectOption } from './MultiSelectOption'
import { MultiSelectRoot } from './MultiSelectRoot'
import { MultiSelectTrigger } from './MultiSelectTrigger'

export type { MultiSelectProps } from './MultiSelectComponent'

export type MultiSelect = typeof MultiSelectComponent & {
  Root: typeof MultiSelectRoot,
  Trigger: typeof MultiSelectTrigger,
  Option: typeof MultiSelectOption,
  Content: typeof MultiSelectContent,
  ChipDisplayTrigger: typeof MultiSelectChipDisplayTrigger,
  Context: typeof MultiSelectContext,
  Provider: typeof MultiSelectContext.Provider,
}

const MultiSelect = Object.assign(MultiSelectComponent, {
  Root: MultiSelectRoot,
  Trigger: MultiSelectTrigger,
  Option: MultiSelectOption,
  Content: MultiSelectContent,
  ChipDisplayTrigger: MultiSelectChipDisplayTrigger,
  Context: MultiSelectContext,
  Provider: MultiSelectContext.Provider,
}) as MultiSelect

export { MultiSelect }
