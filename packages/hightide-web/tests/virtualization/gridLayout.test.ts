
import { chunkIntoRows, columnsForWidth, overscanRowsForBuffer } from '../../src/components/layout/virtualization/gridLayout'

describe('columnsForWidth', () => {
  it('returns at least one column for any positive width', () => {
    expect(columnsForWidth(100, 384, 12)).toBe(1)
    expect(columnsForWidth(384, 384, 12)).toBe(1)
  })

  it('fits as many minmax columns as the width allows, accounting for the gap', () => {
    expect(columnsForWidth(792, 384, 12)).toBe(2)
    expect(columnsForWidth(1200, 384, 12)).toBe(3)
    expect(columnsForWidth(1188, 384, 12)).toBe(3)
  })

  it('falls back to a single column for invalid widths', () => {
    expect(columnsForWidth(0, 384, 12)).toBe(1)
    expect(columnsForWidth(-50, 384, 12)).toBe(1)
    expect(columnsForWidth(Number.NaN, 384, 12)).toBe(1)
  })
})

describe('chunkIntoRows', () => {
  it('splits items into rows of the requested column count', () => {
    expect(chunkIntoRows([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('keeps a single row when columns exceed item count', () => {
    expect(chunkIntoRows([1, 2], 5)).toEqual([[1, 2]])
  })

  it('returns no rows for an empty list', () => {
    expect(chunkIntoRows([], 3)).toEqual([])
  })

  it('treats non-positive column counts as a single column', () => {
    expect(chunkIntoRows([1, 2, 3], 0)).toEqual([[1], [2], [3]])
  })
})

describe('overscanRowsForBuffer', () => {
  it('renders enough rows to cover the pixel buffer ahead of the viewport', () => {
    expect(overscanRowsForBuffer(600, 56)).toBe(11)
    expect(overscanRowsForBuffer(600, 220)).toBe(6)
  })

  it('never drops below the minimum overscan', () => {
    expect(overscanRowsForBuffer(50, 56)).toBe(6)
    expect(overscanRowsForBuffer(600, 56, 20)).toBe(20)
  })

  it('falls back to the minimum for invalid inputs', () => {
    expect(overscanRowsForBuffer(0, 56)).toBe(6)
    expect(overscanRowsForBuffer(600, 0)).toBe(6)
    expect(overscanRowsForBuffer(Number.NaN, 56)).toBe(6)
  })
})
