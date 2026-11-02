import { ExpandableContent } from './ExpandableContent'
import { ExpandableContext } from './ExpandableContext'
import { ExpandableRoot } from './ExpandableRoot'
import { ExpandableTrigger } from './ExpandableTrigger'

const Expandable = {
  Root: ExpandableRoot,
  Trigger: ExpandableTrigger,
  Content: ExpandableContent,
  Context: ExpandableContext,
  Consumer: ExpandableContext.Consumer,
}

export { Expandable }
