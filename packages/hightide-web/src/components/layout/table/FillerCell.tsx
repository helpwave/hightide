import clsx from 'clsx'
import { Minus } from 'lucide-react'
import { Icon } from '../../display-and-visualization/Icon'
import type { HTMLAttributes } from 'react'

export type FillerCellProps = HTMLAttributes<HTMLDivElement>

export const FillerCell = ({ ...props }: FillerCellProps) => {
  return (
    <div
      {...props}
      className={clsx('table-filler-cell', props.className)}
    >
      <Icon icon={Minus} size="xs" />
    </div>
  )
}