import { MultiSelectChipDisplayTrigger } from './MultiSelectChipDisplayTrigger'
import { MultiSelectComponent } from './MultiSelectComponent'
import { MultiSelectContext } from './MultiSelectContext'
import { MultiSelectList } from './MultiSelectList'
import { MultiSelectPopUp } from './MultiSelectPopUp'
import { MultiSelectSearchbar } from './MultiSelectSearchbar'
import { MultiSelectStateManager } from './MultiSelectStateManager'
import { MultiSelectTrigger } from './MultiSelectTrigger'

const MultiSelect = Object.assign(MultiSelectComponent, {
  StateManager: MultiSelectStateManager,
  Trigger: MultiSelectTrigger,
  PopUp: MultiSelectPopUp,
  Searchbar: MultiSelectSearchbar,
  List: MultiSelectList,
  ChipDisplayTrigger: MultiSelectChipDisplayTrigger,
  Context: MultiSelectContext,
  Provider: MultiSelectContext.Provider,
  Consumer: MultiSelectContext.Consumer,
})

export { MultiSelect }
