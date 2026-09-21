/** Number of columns that fit into `containerWidth` given a minimum card width. */
export function columnsForWidth(containerWidth: number, minCardWidthPx: number, gapPx: number): number {
  if (!Number.isFinite(containerWidth) || containerWidth <= 0) return 1
  if (!Number.isFinite(minCardWidthPx) || minCardWidthPx <= 0) return 1
  const columns = Math.floor((containerWidth + gapPx) / (minCardWidthPx + gapPx))
  return Math.max(1, columns)
}

/**
 * Number of rows to render outside the visible window so that a fast (e.g. mobile
 * momentum) scroll does not outrun React's render and reveal blank space. Derives
 * the row count from a target pixel buffer and the (estimated) row height, never
 * dropping below `minRows`.
 */
export function overscanRowsForBuffer(bufferPx: number, rowHeightPx: number, minRows = 6): number {
  const floor = Math.max(1, Math.floor(minRows))
  if (!Number.isFinite(bufferPx) || bufferPx <= 0) return floor
  if (!Number.isFinite(rowHeightPx) || rowHeightPx <= 0) return floor
  return Math.max(floor, Math.ceil(bufferPx / rowHeightPx))
}

/** Splits `items` into rows of at most `columns` entries each. */
export function chunkIntoRows<T>(items: readonly T[], columns: number): T[][] {
  const safeColumns = Math.max(1, Math.floor(columns) || 1)
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += safeColumns) {
    rows.push(items.slice(i, i + safeColumns))
  }
  return rows
}
