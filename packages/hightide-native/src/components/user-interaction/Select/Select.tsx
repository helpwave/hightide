import { SelectComponent } from './SelectComponent'
import { SelectContext } from './SelectContext'
import { SelectMenu } from './SelectMenu'
import { SelectOption } from './SelectOption'
import { SelectRoot } from './SelectRoot'
import { SelectTrigger } from './SelectTrigger'

export type { SelectProps } from './SelectComponent'

export type Select = typeof SelectComponent & {
  Root: typeof SelectRoot,
  Trigger: typeof SelectTrigger,
  Option: typeof SelectOption,
  Menu: typeof SelectMenu,
  Context: typeof SelectContext,
  Provider: typeof SelectContext.Provider,
}

const Select = Object.assign(SelectComponent, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Option: SelectOption,
  Menu: SelectMenu,
  Context: SelectContext,
  Provider: SelectContext.Provider,
}) as Select

export { Select }
