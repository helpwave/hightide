import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Visibility } from '../../../layout/Visibility'
import { NumberInput } from '../../../data-input/number/NumberInput'
import { operatorNeedsParameter } from '../../filter-operator'
import { useNumberFilterContext } from './NumberFilterContext'

export function NumberFilterParameter() {
  const translation = useHightideTranslation()
  const context = useNumberFilterContext()
  const { operator, parameter } = context.state.value
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
      <Visibility isVisible={needsRangeInput}>
        <div
          id={context.config.id}
          className="flex-col-1"
        >
          <label className="typography-label-md">{translation('min')}</label>
          <NumberInput
            isDisabled={context.config.isDisabled}
            isReadOnly={context.config.isReadOnly}
            isInvalid={context.config.isInvalid}
            value={parameter.numberMin ?? 0}
            onValueChange={num => emit({ ...parameter, numberMin: num })}
            inputProps={{
              className: 'min-w-64',
            }}
          />
          <label className="typography-label-md">{translation('max')}</label>
          <NumberInput
            isDisabled={context.config.isDisabled}
            isReadOnly={context.config.isReadOnly}
            isInvalid={context.config.isInvalid}
            value={parameter.numberMax ?? 0}
            onValueChange={num => emit({ ...parameter, numberMax: num })}
            inputProps={{
              className: 'min-w-64',
            }}
          />
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <NumberInput
          id={context.config.id}
          isDisabled={context.config.isDisabled}
          isReadOnly={context.config.isReadOnly}
          isInvalid={context.config.isInvalid}
          isRequired={context.config.isRequired}
          value={parameter.numberValue ?? 0}
          onValueChange={num => emit({ ...parameter, numberValue: num })}
          inputProps={{
            className: 'min-w-64',
          }}
        />
      </Visibility>
    </>
  )
}
