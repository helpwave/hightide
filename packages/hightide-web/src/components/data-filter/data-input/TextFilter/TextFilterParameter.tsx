import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Visibility } from '../../../layout/Visibility'
import { TextInput } from '../../../data-input/text/TextInput'
import { operatorNeedsParameter } from '../../filter-operator'
import { useTextFilterContext } from './TextFilterContext'

export function TextFilterParameter() {
  const translation = useHightideTranslation()
  const context = useTextFilterContext()
  const { operator, parameter } = context.state.value
  const needsParameterInput = operatorNeedsParameter(operator)

  return (
    <Visibility isVisible={needsParameterInput}>
      <div className="flex-col-1">
        <label htmlFor={context.config.id} className="typography-label-md">{translation('search')}</label>
        <TextInput
          id={context.config.id}
          isDisabled={context.config.isDisabled}
          isReadOnly={context.config.isReadOnly}
          isInvalid={context.config.isInvalid}
          isRequired={context.config.isRequired}
          value={parameter.stringValue ?? ''}
          onValueChange={searchText => {
            context.dispatch({
              type: 'change',
              value: {
                operator,
                parameter: { ...parameter, stringValue: searchText },
              },
            })
          }}
          inputProps={{
            placeholder: translation('value'),
            className: 'min-w-64',
          }}
        />
      </div>
    </Visibility>
  )
}
