import { FileInputComponent } from './FileInputComponent'
import { FileInputContext } from './FileInputContext'
import { FileInputMenu } from './FileInputMenu'
import { FileInputRoot } from './FileInputRoot'
import { FileInputTrigger } from './FileInputTrigger'

const FileInput = Object.assign(FileInputComponent, {
  Root: FileInputRoot,
  Trigger: FileInputTrigger,
  Menu: FileInputMenu,
  Context: FileInputContext,
  Provider: FileInputContext.Provider,
})

export { FileInput }
