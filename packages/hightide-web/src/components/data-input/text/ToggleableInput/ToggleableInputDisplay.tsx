import { Pencil } from 'lucide-react'
import clsx from 'clsx'
import { Icon } from '../../../visualization/Icon'
import { useToggleableInputContext } from './ToggleableInputContext'

export function ToggleableInputDisplay() {
  const { state } = useToggleableInputContext()
  if (state.isEditing) {
    return null
  }

  return (
    <div className="absolute left-0 flex-row-2 items-center pointer-events-none touch-none w-full overflow-hidden">
      <span className="truncate">
        {state.value}
      </span>
      <Icon icon={Pencil} size="xs" className={clsx({ 'text-transparent': state.isEditing })} />
    </div>
  )
}
