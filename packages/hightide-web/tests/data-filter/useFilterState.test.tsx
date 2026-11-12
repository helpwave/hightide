/**
 * @jest-environment jsdom
 */
import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useFilterState, type FilterInputValue } from '../../src/components/data-filter/data-input/filter-value'
import type { FilterOperatorNumber } from '../../src/components/data-filter/filter-operator'

function Harness() {
  const [value, setValue] = useState<FilterInputValue<FilterOperatorNumber>>({
    operator: 'between',
    parameter: {},
  })
  const echoed: FilterInputValue<FilterOperatorNumber> = {
    operator: value.operator,
    parameter: { ...value.parameter },
  }
  const binding = useFilterState<FilterOperatorNumber>({
    value: echoed,
    onValueChange: (next) => {
      setValue({
        operator: next.operator,
        parameter: { ...next.parameter },
      })
    },
    defaultValue: echoed,
  })

  return (
    <button
      type="button"
      onClick={() => {
        binding.dispatch({
          type: 'change',
          value: {
            operator: 'equals',
            parameter: { ...binding.state.value.parameter, numberValue: 4 },
          },
        })
      }}
    >
      {`${binding.state.value.operator}:${binding.state.value.parameter.numberValue ?? ''}`}
    </button>
  )
}

describe('useFilterState', () => {
  it('accepts an operator and parameter update without looping on a new value object', () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button').textContent).toBe('equals:4')
  })
})
