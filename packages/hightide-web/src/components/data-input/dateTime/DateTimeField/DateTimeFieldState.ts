import type { EditableSegmentType, SegmentEditState } from '../dateTimeSegments'

export type DateTimeFieldState = {
  value: Date | null,
  edit: SegmentEditState,
  focusedType: EditableSegmentType | null,
}

export type DateTimeFieldEvent =
  | { type: 'edit', edit: SegmentEditState, value: Date | null, focusedType?: EditableSegmentType | null }
  | { type: 'focus', focusedType: EditableSegmentType | null }
  | { type: 'clearBuffer', focusedType: EditableSegmentType }
  | { type: 'sync', value: Date | null, edit: SegmentEditState }
  | { type: 'commit', value: Date | null, edit: SegmentEditState }

export function dateTimeFieldStateTransition(state: DateTimeFieldState, event: DateTimeFieldEvent): DateTimeFieldState {
  switch (event.type) {
  case 'edit':
    return {
      ...state,
      edit: event.edit,
      value: event.value,
      focusedType: event.focusedType === undefined ? state.focusedType : event.focusedType,
    }
  case 'focus':
    return { ...state, focusedType: event.focusedType }
  case 'clearBuffer':
    return {
      ...state,
      focusedType: event.focusedType,
      edit: { ...state.edit, buffer: null },
    }
  case 'sync':
  case 'commit':
    return { ...state, value: event.value, edit: event.edit, focusedType: event.type === 'commit' ? null : state.focusedType }
  }
}
