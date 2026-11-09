/** @jest-environment jsdom */

import { useState } from 'react'
import { act, renderHook } from '@testing-library/react'
import { createStateStore } from '../../src/hooks/state-machine/StateStore'
import { useStateMachine } from '../../src/hooks/state-machine/useStateMachine'
import { useStateStore } from '../../src/hooks/state-machine/useStateStore'
import { useStateStoreBindings } from '../../src/hooks/state-machine/useStateStoreBindings'

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

describe('useStateStoreBindings', () => {
  test('writes an uncontrolled key and reports each value during a burst', () => {
    const onValueChange = jest.fn()
    const { result } = renderHook(() => {
      const store = useStateStore<LabelledState>({ count: 0, label: 'start' })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {
          count: { onValueChange },
        },
      })
      return { store, onStateChange }
    })

    act(() => {
      result.current.onStateChange({ count: 1, label: 'start' })
      result.current.onStateChange({ count: 2, label: 'start' })
      result.current.onStateChange({ count: 2, label: 'start' })
    })

    expect(onValueChange.mock.calls.map((call) => call[0])).toEqual([1, 2])
    expect(result.current.store.getSnapshot()).toEqual({ count: 2, label: 'start' })
  })

  test('keeps both keys when one bindings object commits them together', () => {
    const onCountChange = jest.fn()
    const onLabelChange = jest.fn()
    const { result } = renderHook(() => {
      const store = useStateStore<LabelledState>({ count: 0, label: 'a' })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {
          count: { onValueChange: onCountChange },
          label: { onValueChange: onLabelChange },
        },
      })
      return { store, onStateChange }
    })

    act(() => {
      result.current.onStateChange({ count: 4, label: 'b' })
      result.current.onStateChange({ count: 5, label: 'b' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 5, label: 'b' })
    expect(onCountChange.mock.calls.map((call) => call[0])).toEqual([4, 5])
    expect(onLabelChange).toHaveBeenCalledWith('b')
  })

  test('drops a key when onValueChange returns false and commits it otherwise', () => {
    const onValueChange = jest.fn<boolean | undefined, [number]>(() => false)
    const { result, rerender } = renderHook(({ value }: { value?: number }) => {
      const store = useStateStore<LabelledState>({ count: 1, label: 'a' })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {
          count: { value, onValueChange },
        },
      })
      return { store, onStateChange }
    }, {
      initialProps: { value: 1 as number | undefined },
    })

    act(() => {
      result.current.onStateChange({ count: 6, label: 'next' })
    })

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith(6)
    expect(result.current.store.getSnapshot()).toEqual({ count: 1, label: 'next' })

    onValueChange.mockReturnValue(undefined)
    act(() => {
      result.current.onStateChange({ count: 8, label: 'next' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 8, label: 'next' })

    onValueChange.mockReturnValue(true)
    act(() => {
      result.current.onStateChange({ count: 4, label: 'kept' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 4, label: 'kept' })

    rerender({ value: 9 })

    expect(result.current.store.getSnapshot()).toEqual({ count: 9, label: 'kept' })
    expect(onValueChange).toHaveBeenCalledTimes(3)
  })

  test('keeps the original mode when a value switches between defined and undefined', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})
    const onControlledChange = jest.fn()
    const onUncontrolledChange = jest.fn()
    const { result, rerender } = renderHook(({
      controlled,
      uncontrolled,
    }: {
      controlled?: number,
      uncontrolled?: string,
    }) => {
      const store = useStateStore<LabelledState>({ count: 0, label: 'a' })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {
          count: { value: controlled, onValueChange: onControlledChange },
          label: { value: uncontrolled, onValueChange: onUncontrolledChange },
        },
      })
      return { store, onStateChange }
    }, {
      initialProps: {
        controlled: 3 as number | undefined,
        uncontrolled: undefined as string | undefined,
      },
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 3, label: 'a' })

    rerender({ controlled: undefined, uncontrolled: 'kept' })

    expect(error).toHaveBeenCalledTimes(2)
    expect(result.current.store.getSnapshot()).toEqual({ count: 3, label: 'a' })

    act(() => {
      result.current.onStateChange({ count: 7, label: 'b' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 7, label: 'b' })
    expect(onControlledChange).toHaveBeenCalledWith(7)
    expect(onUncontrolledChange).toHaveBeenCalledWith('b')
    error.mockRestore()
  })

  test('useState + useStateMachineBinding', () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0)
      const store = useStateStore({ count })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {
          count: { value: count, onValueChange: setCount },
        },
      })
      const machine = useStateMachine({
        state: store,
        transition: incrementTransition,
        onStateChange,
      })
      return { count, machine }
    })

    act(() => {
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch(incrementEvent)
    })

    expect(result.current.count).toBe(2)
  })

  test('useState + useStateMachineBinding', () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0)
      const store = useStateStore({ count })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {
          count: {
            value: count,
            onValueChange: (next) => {
              setCount(next)
              return false
            },
          },
        },
      })
      const machine = useStateMachine({
        state: store,
        transition: incrementTransition,
        onStateChange,
      })
      return { count, machine }
    })

    act(() => {
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch(incrementEvent)
    })

    expect(result.current.count).toBe(1)
  })
})
