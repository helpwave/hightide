import { MathUtil } from '@/src/utils/math'
import type { ColumnSizingState } from '@tanstack/react-table'

type ColumnSizeCalculateTargetBehavoir = 'equalOrHigher'

type ColumnSizeCalculateTarget = {
    width: number,
    behaviour: ColumnSizeCalculateTargetBehavoir,
}

export type ColumnSizeCalculatoProps = {
  previousSizing: Record<string, number>,
  newSizing: Record<string, number>,
  columnIds: string[],
  target?: ColumnSizeCalculateTarget,
  minWidthsPerColumn: Record<string, number>,
  maxWidthsPerColumn?: Record<string, number>,
}

const calculate = ({
  previousSizing,
  newSizing,
  columnIds,
  target,
  minWidthsPerColumn,
  maxWidthsPerColumn
}: ColumnSizeCalculatoProps) => {
  if(columnIds.length === 0) {
    return {}
  }
  const deltas: Record<string, number> = {}

  const removedColumns = Object.keys(newSizing).filter(columnId => !columnIds.includes(columnId))
  for(const columnId of removedColumns) {
    delete newSizing[columnId]
  }

  for (const columnId of columnIds) {
    if(!newSizing[columnId]) {
      newSizing[columnId] = 0
      continue
    }
    const delta = (newSizing[columnId] ?? 0) - (previousSizing[columnId] ?? 0)
    if (delta !== 0) {
      deltas[columnId] = delta
    }
  }

  const minWidth = Object.values(minWidthsPerColumn).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
  const maxWidth = maxWidthsPerColumn ? Object.values(maxWidthsPerColumn).reduce((previousValue, currentValue) => previousValue + currentValue, 0) : Infinity

  if (minWidth > maxWidth) {
    throw new Error('Min width is greater than max width')
  }

  const hasTargetWidth = target?.width !== undefined

  const result = {
    ...newSizing,
  }
  for (const columnId of columnIds) {
    result[columnId] = MathUtil.clamp(result[columnId], [minWidthsPerColumn[columnId], maxWidthsPerColumn?.[columnId] ?? Infinity])
  }

  if(!hasTargetWidth) {
    return result
  }

  let targetWidth = target?.width ?? -1
  if (hasTargetWidth) {
    switch (target?.behaviour) {
    case 'equalOrHigher':
      targetWidth = Math.max(target.width, minWidth)
      break
    }
  }

  const resultWidth = Object.values(result).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
  if(resultWidth == targetWidth) {
    return result
  } else if(resultWidth < targetWidth) {
    const widthToGive = targetWidth - resultWidth
    const lastColumnId = columnIds[columnIds.length - 1]
    result[lastColumnId] += widthToGive
    return result
  } else {
    const widthToTake = resultWidth - targetWidth
    const lastColumnId = columnIds[columnIds.length - 1]
    const isLastColumnChanging = Object.keys(deltas).find(columnId => columnId === lastColumnId) !== undefined
    if(isLastColumnChanging) {
      return result
    } else {
      result[lastColumnId] -= Math.max(widthToTake, minWidthsPerColumn[lastColumnId])
      return result
    }
  }
}

export const toSizeVars = (sizing: ColumnSizingState) => {
  return Object.entries(sizing).reduce((previousValue, [columnId, size]) => {
    return {
      ...previousValue,
      [`--header-${columnId}-size`]: size,
    }
  }, {})
}

export const ColumnSizeUtil = {
  calculate,
  toSizeVars,
}