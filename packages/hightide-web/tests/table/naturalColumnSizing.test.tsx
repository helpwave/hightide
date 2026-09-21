/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { TestHightideProvider } from '../setup/TestHightideProvider'
import { Table } from '../../src/components/layout/table/Table'
import { TableColumn } from '../../src/components/layout/table/TableColumn'

type Row = { id: string, name: string, grade: string }



const DATA: Row[] = [
  { id: '1', name: 'Alice Doe', grade: 'A' },
  { id: '2', name: 'Bob Roe', grade: '2' },
]

const renderTable = (columnSizingMode?: 'fill' | 'natural') => render(
  <TestHightideProvider locale="en-US">
    <Table
      table={{ data: DATA, columnSizingMode, isUsingFillerRows: false }}
      paginationOptions={{ showPagination: false }}
    >
      <TableColumn<Row> id="name" header="Name" accessorKey="name" minSize={120}/>
      <TableColumn<Row> id="grade" header="Grade" accessorKey="grade" minSize={48}/>
    </Table>
  </TestHightideProvider>
)

describe('table column sizing modes', () => {
  it('tags the table element with the active sizing mode', () => {
    const { container, unmount } = renderTable('natural')
    expect(container.querySelector('table[data-name="table"]')?.getAttribute('data-column-sizing')).toBe('natural')
    unmount()

    const { container: fillContainer } = renderTable()
    expect(fillContainer.querySelector('table[data-name="table"]')?.getAttribute('data-column-sizing')).toBe('fill')
  })

  it('natural mode sets no explicit column widths, keeping content in charge', () => {
    const { container } = renderTable('natural')
    const cols = Array.from(container.querySelectorAll('col'))
    expect(cols.length).toBeGreaterThan(0)
    for (const col of cols) {
      expect(col.style.width).toBe('')
    }
    const ths = Array.from(container.querySelectorAll('th'))
    expect(ths.some(th => th.style.minWidth === '120px')).toBe(true)
  })

  it('natural mode sets no explicit width on the table element', () => {
    const { container } = renderTable('natural')
    const table = container.querySelector('table[data-name="table"]') as HTMLTableElement
    expect(table.style.width).toBe('')
  })

  it('fill mode keeps the negotiated explicit widths', () => {
    const { container } = renderTable()
    const cols = Array.from(container.querySelectorAll('col'))
    expect(cols.length).toBeGreaterThan(0)
    for (const col of cols) {
      expect(col.style.width).toContain('var(--header-')
    }
  })
})
