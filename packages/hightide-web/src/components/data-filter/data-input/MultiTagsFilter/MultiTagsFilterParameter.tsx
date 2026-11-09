import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Visibility } from '../../../layout/Visibility'
import { MultiSelect } from '../../../data-input/selection/MultiSelect/MultiSelect'
import { operatorNeedsParameter } from '../../filter-operator'
import { useMultiTagsFilterContext } from './MultiTagsFilterContext'

export function MultiTagsFilterParameter() {
  const translation = useHightideTranslation()
  const context = useMultiTagsFilterContext()
  const { operator, parameter } = context.state.value
  const selectedTags = (Array.isArray(parameter.uuidValues) ? parameter.uuidValues : []) as string[]
  const needsParameterInput = operatorNeedsParameter(operator)
  const availableTags = context.config.tags

  if (availableTags.length === 0) {
    return null
  }

  return (
    <>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsParameterInput}>
        <MultiSelect
          id={context.config.id}
          isDisabled={context.config.isDisabled}
          isReadOnly={context.config.isReadOnly}
          isInvalid={context.config.isInvalid}
          isRequired={context.config.isRequired}
          value={selectedTags}
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
            visual: { content: label },
          }))}
        />
      </Visibility>
    </>
  )
}
