import { ComboboxComponent } from './ComboboxComponent'
import { ComboboxContext } from './ComboboxContext'
import { ComboboxList } from './ComboboxList'
import { ComboboxListItemElement } from './ComboboxListItemElement'
import { ComboboxPopUp } from './ComboboxPopUp'
import { ComboboxSearchbar } from './ComboboxSearchbar'
import { ComboboxStateManager } from './ComboboxStateManager'

const Combobox = Object.assign(ComboboxComponent, {
  StateManager: ComboboxStateManager,
  Searchbar: ComboboxSearchbar,
  PopUp: ComboboxPopUp,
  List: ComboboxList,
  ListItemElement: ComboboxListItemElement,
  Context: ComboboxContext,
  Provider: ComboboxContext.Provider,
  Consumer: ComboboxContext.Consumer,
})

export { Combobox }
