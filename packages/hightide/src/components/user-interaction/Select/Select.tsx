import { SelectComponent } from './SelectComponent'
import { SelectContent } from './SelectContent'
import { SelectContext } from './SelectContext'
import { SelectOption } from './SelectOption'
import { SelectRoot } from './SelectRoot'
import { SelectTrigger } from './SelectTrigger'

export type { SelectProps } from './SelectComponent'

export type Select = typeof SelectComponent & {
  Root: typeof SelectRoot,
  Trigger: typeof SelectTrigger,
  Option: typeof SelectOption,
  Content: typeof SelectContent,
  Context: typeof SelectContext,
  Provider: typeof SelectContext.Provider,
}

const Select = Object.assign(SelectComponent, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Option: SelectOption,
  Content: SelectContent,
  Context: SelectContext,
  Provider: SelectContext.Provider,
}) as Select

export { Select }
