import { useState } from 'react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Visibility } from '../../../layout/Visibility'
import { DateTimeInput } from '../../../data-input/dateTime/DateTimeInput'
import { operatorNeedsParameter } from '../../filter-operator'
import { useDateTimeFilterContext } from './DateTimeFilterContext'

export function DateTimeFilterParameter() {
  const translation = useHightideTranslation()
  const context = useDateTimeFilterContext()
  const { operator, parameter } = context.state.value
  const [temporaryMinDateValue, setTemporaryMinDateValue] = useState<Date | null>(null)
  const [temporaryMaxDateValue, setTemporaryMaxDateValue] = useState<Date | null>(null)
  const needsRangeInput = operator === 'between' || operator === 'notBetween'
  const needsParameterInput = operatorNeedsParameter(operator)

  const emit = (next: typeof parameter) => {
    context.dispatch({
      type: 'change',
      value: { operator, parameter: next },
    })
  }

  return (
    <>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsRangeInput}>
        <div
          id={context.config.id}
          className="flex-col-2 gap-2"
        >
          <label className="typography-label-md">{translation('startDate')}</label>
          <DateTimeInput
            controlProps={{ className: 'min-w-64' }}
            mode="dateTime"
            isDisabled={context.config.isDisabled}
            isReadOnly={context.config.isReadOnly}
            isInvalid={context.config.isInvalid}
            value={temporaryMinDateValue ?? parameter.dateMin ?? null}
            onValueChange={setTemporaryMinDateValue}
            onStateEvent={(event) => {
              if (event.type !== 'commit') return
              const dateValue = event.value
              if (dateValue && parameter.dateMax && dateValue > parameter.dateMax) {
                if (!parameter.dateMin) {
                  emit({ ...parameter, dateMin: parameter.dateMax, dateMax: dateValue })
                } else {
                  const diff = parameter.dateMax.getTime() - parameter.dateMin.getTime()
                  emit({ ...parameter, dateMin: dateValue, dateMax: new Date(dateValue.getTime() + diff) })
                }
              } else {
                emit({ ...parameter, dateMin: dateValue ?? undefined })
              }
              setTemporaryMinDateValue(null)
            }}
            allowRemove={true}
            outsideClickCloses={false}
          />
          <label className="typography-label-md">{translation('endDate')}</label>
          <DateTimeInput
            controlProps={{ className: 'min-w-64' }}
            mode="dateTime"
            isDisabled={context.config.isDisabled}
            isReadOnly={context.config.isReadOnly}
            isInvalid={context.config.isInvalid}
            value={temporaryMaxDateValue ?? parameter.dateMax ?? null}
            onValueChange={setTemporaryMaxDateValue}
            onStateEvent={(event) => {
              if (event.type !== 'commit') return
              const dateValue = event.value
              if (dateValue && parameter.dateMin && dateValue < parameter.dateMin) {
                if (!parameter.dateMax) {
                  emit({ ...parameter, dateMin: dateValue, dateMax: parameter.dateMin })
                } else {
                  const diff = parameter.dateMax.getTime() - parameter.dateMin.getTime()
                  emit({ ...parameter, dateMin: new Date(dateValue.getTime() - diff), dateMax: dateValue })
                }
              } else {
                emit({ ...parameter, dateMax: dateValue ?? undefined })
              }
              setTemporaryMaxDateValue(null)
            }}
            allowRemove={true}
            outsideClickCloses={false}
          />
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <label htmlFor={context.config.id} className="typography-label-md">{translation('date')}</label>
        <DateTimeInput
          id={context.config.id}
          controlProps={{ className: 'min-w-64' }}
          mode="dateTime"
          isDisabled={context.config.isDisabled}
          isReadOnly={context.config.isReadOnly}
          isInvalid={context.config.isInvalid}
          isRequired={context.config.isRequired}
          value={parameter.dateValue ?? null}
          onValueChange={compareDate => emit({ ...parameter, dateValue: compareDate ?? undefined })}
          allowRemove={true}
          outsideClickCloses={false}
        />
      </Visibility>
    </>
  )
}
