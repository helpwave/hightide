import { SelectComponent } from './SelectComponent'
import { SelectContext } from './SelectContext'
import { SelectList } from './SelectList'
import { SelectPopUp } from './SelectPopUp'
import { SelectSearchbar } from './SelectSearchbar'
import { SelectStateManager } from './SelectStateManager'
import { SelectTrigger } from './SelectTrigger'

const Select = Object.assign(SelectComponent, {
  StateManager: SelectStateManager,
  Trigger: SelectTrigger,
  PopUp: SelectPopUp,
  Searchbar: SelectSearchbar,
  List: SelectList,
  Context: SelectContext,
  Provider: SelectContext.Provider,
  Consumer: SelectContext.Consumer,
})

export { Select }
