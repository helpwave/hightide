import { DataAttributesUtil } from '@/src/utils/dataAttribute'
import type { HTMLAttributes } from 'react'

export type FillerCellProps =  HTMLAttributes<HTMLDivElement>

export const FillerCell = ({ ...props }: FillerCellProps) => {
  return (
    <div
      {...props}
      data-name={DataAttributesUtil.name('table-filler-cell')}
    >
      -
    </div>
  )
}