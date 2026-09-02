import { MultiSelectComponent } from './MultiSelectComponent'
import { MultiSelectContext } from './MultiSelectContext'
import { MultiSelectMenu } from './MultiSelectMenu'
import { MultiSelectOption } from './MultiSelectOption'
import { MultiSelectRoot } from './MultiSelectRoot'
import { MultiSelectTrigger } from './MultiSelectTrigger'

export type { MultiSelectProps } from './MultiSelectComponent'

export type MultiSelect = typeof MultiSelectComponent & {
  Root: typeof MultiSelectRoot,
  Trigger: typeof MultiSelectTrigger,
  Option: typeof MultiSelectOption,
  Menu: typeof MultiSelectMenu,
  Context: typeof MultiSelectContext,
  Provider: typeof MultiSelectContext.Provider,
}

const MultiSelect = Object.assign(MultiSelectComponent, {
  Root: MultiSelectRoot,
  Trigger: MultiSelectTrigger,
  Option: MultiSelectOption,
  Menu: MultiSelectMenu,
  Context: MultiSelectContext,
  Provider: MultiSelectContext.Provider,
}) as MultiSelect

export { MultiSelect }
