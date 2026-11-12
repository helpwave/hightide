export type WheelPickerState<T> = {
  value: T | null,
}

export type WheelPickerLoopEvent<T> = {
  value: T,
  direction: 1 | -1,
  loopedAround: 'start' | 'end',
}

export type WheelPickerEvent<T> =
  | { type: 'change', value: T }
  | { type: 'commit', value: T }
  | ({ type: 'loop' } & WheelPickerLoopEvent<T>)

export function wheelPickerStateTransition<T>(
  state: WheelPickerState<T>,
  event: WheelPickerEvent<T>
): WheelPickerState<T> {
  switch (event.type) {
  case 'change':
  case 'commit':
  case 'loop':
    return { value: event.value }
  }
}
