const dateRange = (row, columnId, filterValue: [Date | null | undefined, Date | null | undefined]) => {
  const [min, max] = filterValue
  const value = row.getValue(columnId)

  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date.getTime())) return false // Invalid date

  if (min && date < min) return false
  if (max && date > max) return false

  return true
}


export const TableFilter = {
  dateRange
}