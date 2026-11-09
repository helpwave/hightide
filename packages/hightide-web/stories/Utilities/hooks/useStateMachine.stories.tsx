import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useRef, useState, useSyncExternalStore } from 'react'

import { Button } from '../../../src/components/interaction/Button'
import {
  useStateMachineController,
  useStateStore
} from '@helpwave/hightide-utils/hooks'

type CounterState = {
  count: number,
}

type CounterEvent = {
  type: 'increment',
}

const incrementEvent: CounterEvent = { type: 'increment' }

function counterTransition(state: CounterState, event: CounterEvent): CounterState {
  if (event.type === 'increment') {
    return { count: state.count + 1 }
  }
  return state
}

const meta: Meta = {}

export default meta
type Story = StoryObj<typeof meta>

function CountLine({ label, count }: { label: string, count: number }) {
  return <span>{`${label}: ${count}`}</span>
}

function OwnedDemo() {
  const onOwnedStateChange = action('owned.onStateChange')
  const onOwnedStateEvent = action('owned.onStateEvent')
  const onSharedStateChange = action('shared.onStateChange')
  const onSharedStateEvent = action('shared.onStateEvent')
  const shared = useStateStore<CounterState>({ count: 0 })
  const owned = useStateMachineController<CounterState, CounterEvent>({
    initialState: { count: 0 },
    transition: counterTransition,
    onStateChange: onOwnedStateChange,
    onStateEvent: onOwnedStateEvent,
  })
  const sharedMachine = useStateMachineController<CounterState, CounterEvent>({
    state: shared,
    transition: counterTransition,
    onStateChange: (next) => {
      shared.set(next)
      onSharedStateChange(next)
    },
    onStateEvent: onSharedStateEvent,
  })
  const sharedReader = useSyncExternalStore(shared.subscribe, shared.getSnapshot, shared.getSnapshot)

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">{'Owned store'}</span>
        <CountLine label="Machine count" count={owned.state.count} />
        <div className="flex gap-2">
          <Button onClick={() => owned.dispatch(incrementEvent)}>
            {'Increment once'}
          </Button>
          <Button onClick={() => {
            owned.dispatch(incrementEvent)
            owned.dispatch(incrementEvent)
          }}
          >
            {'Increment twice'}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">{'Shared store'}</span>
        <CountLine label="Machine count" count={sharedMachine.state.count} />
        <CountLine label="Second subscriber" count={sharedReader.count} />
        <div className="flex gap-2">
          <Button onClick={() => sharedMachine.dispatch(incrementEvent)}>
            {'Increment once'}
          </Button>
          <Button onClick={() => {
            sharedMachine.dispatch(incrementEvent)
            sharedMachine.dispatch(incrementEvent)
          }}
          >
            {'Increment twice'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProvidedStoreDemo() {
  const onStateChange = action('provided.onStateChange')
  const onStateEvent = action('provided.onStateEvent')
  const store = useStateStore<CounterState>({ count: 0 })
  const commitEachRef = useRef(false)
  const [suggestion, setSuggestion] = useState<CounterState>({ count: 0 })
  const [doubleSuggest, setDoubleSuggest] = useState('none')
  const collectorRef = useRef<((next: CounterState) => void) | null>(null)
  const machine = useStateMachineController<CounterState, CounterEvent>({
    state: store,
    transition: counterTransition,
    onStateChange: (next) => {
      onStateChange(next)
      if (commitEachRef.current) {
        store.set(next)
      }
      if (collectorRef.current) {
        collectorRef.current(next)
      }
      setSuggestion(next)
    },
    onStateEvent,
  })
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

  const suggestTwice = () => {
    const seen: number[] = []
    collectorRef.current = (next) => {
      seen.push(next.count)
    }
    machine.dispatch(incrementEvent)
    machine.dispatch(incrementEvent)
    collectorRef.current = null
    setDoubleSuggest(seen.join(', '))
  }

  const commitTwice = () => {
    store.set({ count: 0 })
    commitEachRef.current = true
    machine.dispatch(incrementEvent)
    machine.dispatch(incrementEvent)
    commitEachRef.current = false
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 text-sm">
      <CountLine label="Store count" count={snapshot.count} />
      <CountLine label="Machine count" count={machine.state.count} />
      <CountLine label="Suggestion" count={suggestion.count} />
      <span>{`Double suggest results: ${doubleSuggest}`}</span>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => machine.dispatch(incrementEvent)}>
          {'Suggest once'}
        </Button>
        <Button onClick={suggestTwice}>
          {'Suggest twice'}
        </Button>
        <Button onClick={() => store.set(suggestion)}>
          {'Apply suggestion'}
        </Button>
        <Button onClick={commitTwice}>
          {'Commit each suggestion, then dispatch twice'}
        </Button>
      </div>
    </div>
  )
}

export const owned: Story = {
  render: () => <OwnedDemo />,
}

export const providedStore: Story = {
  name: 'Provided store',
  render: () => <ProvidedStoreDemo />,
}
