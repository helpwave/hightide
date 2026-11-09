/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { createStateStore } from '../../src/hooks/state-machine/StateStore'
import { useStateMachine } from '../../src/hooks/state-machine/useStateMachine'
import { useStateMachineController } from '../../src/hooks/state-machine/useStateMachineController'
import { useStateStore } from '../../src/hooks/state-machine/useStateStore'
import { useStateStoreBinding } from '../../src/hooks/state-machine/useStateStoreBinding'

type CountState = {
  count: number,
}

type LabelledState = {
  count: number,
  label: string,
}

type CountEvent =
  | { type: 'increment' }
  | { type: 'add', amount: number }

const incrementEvent: CountEvent = { type: 'increment' }

function incrementTransition(state: CountState, event: CountEvent): CountState {
  if (event.type === 'increment') {
    return { count: state.count + 1 }
  }
  return { count: state.count + event.amount }
}

function doubleTransition(state: CountState, event: CountEvent): CountState {
  if (event.type === 'increment') {
    return { count: state.count * 2 }
  }
  return { count: state.count + event.amount }
}

describe('state store', () => {
  test('notifies subscribers and skips an identical snapshot', () => {
    const store = createStateStore<CountState>({ count: 0 })
    const listener = jest.fn()
    const unsubscribe = store.subscribe(listener)
    const next = { count: 1 }

    store.set(next)

    expect(store.getSnapshot()).toBe(next)
    expect(listener).toHaveBeenCalledTimes(1)

    store.set(next)

    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    store.set({ count: 2 })
    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.getSnapshot()).toEqual({ count: 2 })
  })

  test('keeps one store for the lifetime of the hook', () => {
    const { result, rerender } = renderHook(() => useStateStore<CountState>({ count: 4 }))
    const store = result.current

    rerender()

    expect(result.current).toBe(store)
    expect(store.getSnapshot()).toEqual({ count: 4 })
  })
})

describe('useStateMachine', () => {
  test('suggests the next state and leaves the store unchanged', () => {
    const onStateChange = jest.fn()
    const onStateEvent = jest.fn()
    const { result } = renderHook(() => {
      const store = useStateStore<CountState>({ count: 2 })
      const machine = useStateMachine({
        state: store,
        transition: incrementTransition,
        onStateChange,
        onStateEvent,
      })
      return { store, machine }
    })

    act(() => {
      result.current.machine.dispatch({ type: 'add', amount: 5 })
    })

    expect(onStateChange).toHaveBeenCalledWith({ count: 7 })
    expect(onStateEvent).toHaveBeenCalledWith({ type: 'add', amount: 5 })
    expect(result.current.store.getSnapshot()).toEqual({ count: 2 })
    expect(result.current.machine.state).toEqual({ count: 2 })
  })

  test('reads each committed snapshot during a burst of dispatches', () => {
    const seen: number[] = []
    const { result } = renderHook(() => {
      const store = useStateStore<CountState>({ count: 0 })
      const machine = useStateMachine({
        state: store,
        transition: incrementTransition,
        onStateChange: (next) => {
          seen.push(next.count)
          store.set(next)
        },
      })
      return { store, machine }
    })

    act(() => {
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch({ type: 'add', amount: 10 })
    })

    expect(seen).toEqual([1, 2, 12])
    expect(result.current.store.getSnapshot()).toEqual({ count: 12 })
    expect(result.current.machine.state).toEqual({ count: 12 })
  })

  test('repeats the same snapshot when a burst does not write the store', () => {
    const seen: number[] = []
    const { result } = renderHook(() => {
      const store = useStateStore<CountState>({ count: 4 })
      const machine = useStateMachine({
        state: store,
        transition: doubleTransition,
        onStateChange: (next) => {
          seen.push(next.count)
        },
      })
      return machine
    })

    act(() => {
      result.current.dispatch(incrementEvent)
      result.current.dispatch(incrementEvent)
    })

    expect(seen).toEqual([8, 8])
    expect(result.current.state).toEqual({ count: 4 })
  })

  test('uses the transition from the latest render', () => {
    const { result, rerender } = renderHook(({ transition }: { transition: typeof incrementTransition }) => {
      const store = useStateStore<CountState>({ count: 3 })
      const machine = useStateMachine({
        state: store,
        transition,
        onStateChange: (next) => {
          store.set(next)
        },
      })
      return { store, machine }
    }, {
      initialProps: { transition: incrementTransition },
    })

    act(() => {
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch(incrementEvent)
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 5 })

    rerender({ transition: doubleTransition })

    act(() => {
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch(incrementEvent)
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 20 })
  })
})

describe('useStateMachineController', () => {
  test('commits an owned store before the next dispatch in the same turn', () => {
    const onStateChange = jest.fn()
    const onStateEvent = jest.fn()
    const { result } = renderHook(() => useStateMachineController({
      initialState: { count: 1 },
      transition: incrementTransition,
      onStateChange,
      onStateEvent,
    }))

    act(() => {
      result.current.dispatch(incrementEvent)
      result.current.dispatch({ type: 'add', amount: 4 })
    })

    expect(onStateChange.mock.calls.map((call) => call[0])).toEqual([
      { count: 2 },
      { count: 6 },
    ])
    expect(onStateEvent.mock.calls.map((call) => call[0])).toEqual([
      incrementEvent,
      { type: 'add', amount: 4 },
    ])
    expect(result.current.state).toEqual({ count: 6 })
  })

  test('leaves a provided store unchanged until the caller writes it', () => {
    const suggestions: number[] = []
    const { result } = renderHook(() => {
      const store = useStateStore<CountState>({ count: 2 })
      const machine = useStateMachineController({
        state: store,
        transition: doubleTransition,
        onStateChange: (next) => {
          suggestions.push(next.count)
        },
      })
      return { store, machine }
    })

    act(() => {
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch(incrementEvent)
    })

    expect(suggestions).toEqual([4, 4])
    expect(result.current.store.getSnapshot()).toEqual({ count: 2 })

    act(() => {
      result.current.store.set({ count: suggestions[0] })
      result.current.machine.dispatch(incrementEvent)
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 4 })
    expect(suggestions).toEqual([4, 4, 8])
    expect(result.current.machine.state).toEqual({ count: 4 })
  })

  test('applies a caller commit before the following dispatch', () => {
    const { result } = renderHook(() => {
      const store = useStateStore<CountState>({ count: 2 })
      const machine = useStateMachineController({
        state: store,
        transition: doubleTransition,
        onStateChange: (next) => {
          store.set(next)
        },
      })
      return { store, machine }
    })

    act(() => {
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch(incrementEvent)
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 8 })
    expect(result.current.machine.state).toEqual({ count: 8 })
  })
})

describe('useStateStoreBinding', () => {
  test('writes one key and reports each value during a burst', () => {
    const onValueChange = jest.fn()
    const { result } = renderHook(() => {
      const store = useStateStore<LabelledState>({ count: 0, label: 'start' })
      const count = useStateStoreBinding({
        store,
        key: 'count',
        onValueChange,
      })
      return { store, count }
    })

    act(() => {
      result.current.count.set(1)
      result.current.count.set(2)
      result.current.count.set(2)
    })

    expect(onValueChange.mock.calls.map((call) => call[0])).toEqual([1, 2])
    expect(result.current.count.getSnapshot()).toBe(2)
    expect(result.current.store.getSnapshot()).toEqual({ count: 2, label: 'start' })
  })

  test('keeps both keys when two bindings write in one turn', () => {
    const onCountChange = jest.fn()
    const onLabelChange = jest.fn()
    const { result } = renderHook(() => {
      const store = useStateStore<LabelledState>({ count: 0, label: 'a' })
      const count = useStateStoreBinding({
        store,
        key: 'count',
        onValueChange: onCountChange,
      })
      const label = useStateStoreBinding({
        store,
        key: 'label',
        onValueChange: onLabelChange,
      })
      return { store, count, label }
    })

    act(() => {
      result.current.count.set(4)
      result.current.label.set('b')
      result.current.count.set(5)
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 5, label: 'b' })
    expect(result.current.count.getSnapshot()).toBe(5)
    expect(result.current.label.getSnapshot()).toBe('b')
    expect(onCountChange.mock.calls.map((call) => call[0])).toEqual([4, 5])
    expect(onLabelChange).toHaveBeenCalledWith('b')
  })

  test('follows parent writes and skips the callback for a controlled value', () => {
    const onValueChange = jest.fn()
    const { result, rerender } = renderHook(({ value }: { value?: number }) => {
      const store = useStateStore<LabelledState>({ count: 1, label: 'a' })
      const count = useStateStoreBinding({
        store,
        key: 'count',
        value,
        onValueChange,
      })
      return { store, count }
    }, {
      initialProps: { value: undefined as number | undefined },
    })

    act(() => {
      result.current.store.set({ count: 6, label: 'a' })
    })

    expect(result.current.count.getSnapshot()).toBe(6)
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith(6)

    rerender({ value: 9 })

    expect(result.current.store.getSnapshot()).toEqual({ count: 9, label: 'a' })
    expect(result.current.count.getSnapshot()).toBe(9)
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  test('keeps the current value when a controlled value becomes undefined', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result, rerender } = renderHook(({ value }: { value?: number }) => {
      const store = useStateStore<CountState>({ count: 0 })
      const count = useStateStoreBinding({
        store,
        key: 'count',
        value,
      })
      return { store, count }
    }, {
      initialProps: { value: 3 as number | undefined },
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 3 })

    rerender({ value: undefined })

    expect(error).toHaveBeenCalled()
    expect(result.current.store.getSnapshot()).toEqual({ count: 3 })
    expect(result.current.count.getSnapshot()).toBe(3)
    error.mockRestore()
  })
})
