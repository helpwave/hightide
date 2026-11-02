import type { KeyboardEvent, Ref } from 'react'
import { PropsUtil } from '../../../../utils/propsUtil'
import type { EditableSegmentType } from '../dateTimeSegments'

export type DateTimeFieldSegmentProps = {
  type: EditableSegmentType,
  display: string,
  isPlaceholder: boolean,
  isActive: boolean,
  isDisabled: boolean,
  label: string,
  min?: number,
  max?: number,
  valueNow?: number,
  segmentRef: Ref<HTMLSpanElement>,
  onKeyDown: (event: KeyboardEvent<HTMLSpanElement>, type: EditableSegmentType) => void,
  onFocus: (type: EditableSegmentType) => void,
}

export function DateTimeFieldSegment({
  type,
  display,
  isPlaceholder,
  isActive,
  isDisabled,
  label,
  min,
  max,
  valueNow,
  segmentRef,
  onKeyDown,
  onFocus,
}: DateTimeFieldSegmentProps) {
  return (
    <span
      ref={segmentRef}
      role="spinbutton"
      tabIndex={isDisabled ? -1 : (isActive ? 0 : -1)}
      onKeyDown={(event) => onKeyDown(event, type)}
      onFocus={() => onFocus(type)}
      className="date-time-segment"
      data-placeholder={PropsUtil.dataAttributes.bool(isPlaceholder)}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={valueNow}
      aria-valuetext={display}
    >
      {display}
    </span>
  )
}
