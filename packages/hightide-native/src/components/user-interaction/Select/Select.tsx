import { SelectComponent } from './SelectComponent'
import { SelectContext } from './SelectContext'
import { SelectMenu } from './SelectMenu'
import { SelectOption } from './SelectOption'
import { SelectRoot } from './SelectRoot'
import { SelectTrigger } from './SelectTrigger'

const Select = Object.assign(SelectComponent, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Option: SelectOption,
  Menu: SelectMenu,
  Context: SelectContext,
  Provider: SelectContext.Provider,
})

export { Select }
