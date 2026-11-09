import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Visibility } from '../../../layout/Visibility'
import { MultiSelect } from '../../../data-input/selection/MultiSelect/MultiSelect'
import { Select } from '../../../data-input/selection/Select/Select'
import { operatorNeedsParameter } from '../../filter-operator'
import { useSingleTagFilterContext } from './SingleTagFilterContext'

export function SingleTagFilterParameter() {
  const translation = useHightideTranslation()
  const context = useSingleTagFilterContext()
  const { operator, parameter } = context.state.value
  const selectedTagsMulti = (Array.isArray(parameter.uuidValues) ? parameter.uuidValues : []) as string[]
  const selectedTagSingle = parameter.uuidValue != null ? String(parameter.uuidValue) : undefined
  const needsParameterInput = operatorNeedsParameter(operator)
  const needsMultiSelect = operator === 'contains' || operator === 'notContains'
  const availableTags = context.config.tags

  if (availableTags.length === 0) {
    return null
  }

  return (
    <>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsParameterInput && needsMultiSelect}>
        <MultiSelect
          id={context.config.id}
          isDisabled={context.config.isDisabled}
          isReadOnly={context.config.isReadOnly}
          isInvalid={context.config.isInvalid}
          isRequired={context.config.isRequired}
          value={selectedTagsMulti}
          onValueChange={(selected) => {
            context.dispatch({
              type: 'change',
              value: {
                operator,
                parameter: { ...parameter, uuidValues: selected.length > 0 ? selected : undefined },
              },
            })
          }}
          triggerProps={{ className: 'min-w-64' }}
          options={availableTags.map(({ tag, label }) => ({
            value: tag,
            label,
          }))}
        />
      </Visibility>
      <Visibility isVisible={needsParameterInput && !needsMultiSelect}>
        <Select
          id={context.config.id}
          isDisabled={context.config.isDisabled}
          isReadOnly={context.config.isReadOnly}
          isInvalid={context.config.isInvalid}
          isRequired={context.config.isRequired}
          value={selectedTagSingle}
          onValueChange={(selectedTag) => {
            context.dispatch({
              type: 'change',
              value: {
                operator,
                parameter: { ...parameter, uuidValue: selectedTag ?? undefined },
              },
            })
          }}
          triggerProps={{ className: 'min-w-64' }}
          options={availableTags.map(({ tag, label }) => ({
            value: tag,
            label,
          }))}
        />
      </Visibility>
    </>
  )
}
