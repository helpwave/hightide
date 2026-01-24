
import clsx from 'clsx'
import { Minus } from 'lucide-react'
import type { HTMLAttributes } from 'react'

export type FillerCellProps = HTMLAttributes<HTMLDivElement>

export const FillerCell = ({ ...props }: FillerCellProps) => {
  return (
    <div
      {...props}
      className={clsx('table-filler-cell', props.className)}
    >
      <Minus className="max-w-4 max-h-4" />
    </div>
  )
}