
import { Minus } from 'lucide-react'
import type { HTMLAttributes } from 'react'

export type FillerCellProps = HTMLAttributes<HTMLDivElement>

export const FillerCell = ({ ...props }: FillerCellProps) => {
  return (
    <div
      {...props}
      data-name={props['data-name'] ?? 'table-filler-cell'}
    >
      <Minus className="max-w-4 max-h-4" />
    </div>
  )
}