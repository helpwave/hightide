import { ComboboxComponent } from './ComboboxComponent'
import { ComboboxContext } from './ComboboxContext'
import { ComboboxInput } from './ComboboxInput'
import { ComboboxList } from './ComboboxList'
import { ComboboxOption } from './ComboboxOption'
import { ComboboxRoot } from './ComboboxRoot'

const Combobox = Object.assign(ComboboxComponent, {
  Root: ComboboxRoot,
  Input: ComboboxInput,
  List: ComboboxList,
  Option: ComboboxOption,
  Context: ComboboxContext,
  Provider: ComboboxContext.Provider,
  Consumer: ComboboxContext.Consumer,
})

export { Combobox }
