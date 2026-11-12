/** @jest-environment jsdom */

import { useState } from 'react'
import { act, renderHook } from '@testing-library/react'
import { createStateStore, type StateStore } from '../../src/hooks/state-machine/StateStore'
import { useResolvedStateStore } from '../../src/hooks/state-machine/useResolvedStateStore'
import { useStateMachine } from '../../src/hooks/state-machine/useStateMachine'
import { useStateManager } from '../../src/hooks/state-machine/useStateManager'
import { useStateStore } from '../../src/hooks/state-machine/useStateStore'
import { useStateStoreBindings, type StateStoreBindingChange } from '../../src/hooks/state-machine/useStateStoreBindings'

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

    expect(onStateChange).toHaveBeenCalledWith(
      { count: 7 },
      { event: { type: 'add', amount: 5 }, previousState: { count: 2 } }
    )
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
    expect(onLabelChange).toHaveBeenCalledWith('b', {
      event: undefined,
      previousValue: 'a',
      previousState: { count: 0, label: 'a' },
    })
  })

  test('rejects a change, accepts one, and overwrites another', () => {
    const onValueChange = jest.fn<StateStoreBindingChange<number> | void, [number, object]>(() => ({ action: 'rejectChange' }))
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
    expect(onValueChange).toHaveBeenCalledWith(6, {
      event: undefined,
      previousValue: 1,
      previousState: { count: 1, label: 'a' },
    })
    expect(result.current.store.getSnapshot()).toEqual({ count: 1, label: 'next' })

    onValueChange.mockReturnValue(undefined)
    act(() => {
      result.current.onStateChange({ count: 8, label: 'next' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 8, label: 'next' })

    onValueChange.mockReturnValue({ action: 'acceptChange' })
    act(() => {
      result.current.onStateChange({ count: 4, label: 'kept' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 4, label: 'kept' })

    onValueChange.mockReturnValue({ action: 'overwrite', value: 11 })
    act(() => {
      result.current.onStateChange({ count: 2, label: 'kept' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 11, label: 'kept' })

    rerender({ value: 9 })

    expect(result.current.store.getSnapshot()).toEqual({ count: 9, label: 'kept' })
    expect(onValueChange).toHaveBeenCalledTimes(4)
  })

  test('keeps the original mode when a value switches between defined and undefined', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => { })
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
    expect(onControlledChange).toHaveBeenCalledWith(7, {
      event: undefined,
      previousValue: 3,
      previousState: { count: 3, label: 'a' },
    })
    expect(onUncontrolledChange).toHaveBeenCalledWith('b', {
      event: undefined,
      previousValue: 'a',
      previousState: { count: 3, label: 'a' },
    })
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
              return { action: 'rejectChange' as const }
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

  test('updates react state from the change events', () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0)
      const store = useStateStore({ count })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {
          count: {
            value: count,
            onValueChange: (next) => {
              if (next > 3) {
                setCount(3)
                return { action: 'overwrite' as const, value: 3 }
              }
              setCount(next)
              return { action: 'acceptChange' as const }
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
      result.current.machine.dispatch({ type: 'add', amount: 2 })
      result.current.machine.dispatch(incrementEvent)
      result.current.machine.dispatch(incrementEvent)
    })

    expect(result.current.count).toBe(3)
  })

  test('passes transition information and applies slice decisions before the whole state', () => {
    const onValueChange = jest.fn()
    const onWholeStateChange = jest.fn()
    const { result } = renderHook(() => {
      const store = useStateStore<LabelledState>({ count: 0, label: 'start' })
      const commit = useStateStoreBindings({
        store,
        bindings: {
          count: { onValueChange },
        },
        onStateChange: onWholeStateChange,
      })
      const machine = useStateMachine({
        state: store,
        transition: incrementTransition,
        onStateChange: commit,
      })
      return { store, machine }
    })

    act(() => {
      result.current.machine.dispatch(incrementEvent)
    })

    expect(onValueChange).toHaveBeenCalledWith(1, {
      event: incrementEvent,
      previousValue: 0,
      previousState: { count: 0, label: 'start' },
    })
    expect(onWholeStateChange).toHaveBeenCalledWith(
      { count: 1, label: 'start' },
      { event: incrementEvent, previousState: { count: 0, label: 'start' } }
    )
    expect(result.current.store.getSnapshot()).toEqual({ count: 1, label: 'start' })
  })

  test('drops a rejected slice before the whole-state callback and can overwrite that slice', () => {
    const seen: LabelledState[] = []
    const { result } = renderHook(() => {
      const store = useStateStore<LabelledState>({ count: 1, label: 'a' })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {
          count: {
            onValueChange: () => ({ action: 'rejectChange' }),
          },
          label: {
            onValueChange: () => ({ action: 'overwrite', value: 'fixed' }),
          },
        },
        onStateChange: (next) => {
          seen.push(next)
        },
      })
      return { store, onStateChange }
    })

    act(() => {
      result.current.onStateChange({ count: 9, label: 'b' })
    })

    expect(seen).toEqual([{ count: 1, label: 'fixed' }])
    expect(result.current.store.getSnapshot()).toEqual({ count: 1, label: 'fixed' })
  })

  test('rejects the whole state without writing and overwrites it when asked', () => {
    const { result, rerender } = renderHook(({ reject }: { reject: boolean }) => {
      const store = useStateStore<LabelledState>({ count: 1, label: 'a' })
      const onStateChange = useStateStoreBindings({
        store,
        bindings: {},
        onStateChange: () => reject
          ? { action: 'rejectChange' }
          : { action: 'overwrite', value: { count: 0, label: 'z' } },
      })
      return { store, onStateChange }
    }, {
      initialProps: { reject: true },
    })

    act(() => {
      result.current.onStateChange({ count: 4, label: 'b' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 1, label: 'a' })

    rerender({ reject: false })

    act(() => {
      result.current.onStateChange({ count: 4, label: 'b' })
    })

    expect(result.current.store.getSnapshot()).toEqual({ count: 0, label: 'z' })
  })
})

describe('useResolvedStateStore', () => {
  test('creates one store when none is provided and keeps it if a store appears later', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => { })
    const external = createStateStore<CountState>({ count: 4 })
    const { result, rerender } = renderHook(({ state }: { state?: StateStore<CountState> }) => {
      return useResolvedStateStore(state, { count: 1 })
    }, {
      initialProps: { state: undefined as StateStore<CountState> | undefined },
    })
    const created = result.current

    rerender({ state: external })

    expect(error).toHaveBeenCalled()
    expect(result.current).toBe(created)
    expect(result.current.getSnapshot()).toEqual({ count: 1 })
    error.mockRestore()
  })

  test('uses a provided store and does not replace it when the prop disappears', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => { })
    const external = createStateStore<CountState>({ count: 4 })
    const { result, rerender } = renderHook(({ state }: { state?: StateStore<CountState> }) => {
      return useResolvedStateStore(state, { count: 1 })
    }, {
      initialProps: { state: external as StateStore<CountState> | undefined },
    })

    expect(result.current).toBe(external)

    rerender({ state: undefined })

    expect(error).toHaveBeenCalled()
    expect(result.current).toBe(external)
    expect(result.current.getSnapshot()).toEqual({ count: 4 })
    error.mockRestore()
  })
})

describe('useStateManager', () => {
  test('creates the store and commits the transition when no store is provided', () => {
    const { result } = renderHook(() => useStateManager({
      initialState: { count: 2 },
      transition: incrementTransition,
    }))

    act(() => {
      result.current.dispatch(incrementEvent)
    })

    expect(result.current.state).toEqual({ count: 3 })
    expect(result.current.store.getSnapshot()).toEqual({ count: 3 })
  })
})
