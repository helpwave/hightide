import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Visibility } from '../../../layout/Visibility'
import { Button } from '../../../interaction/Button'
import { IconButton } from '../../../interaction/IconButton'
import { useDateTimePickerDialogChrome, useDateTimePickerDialogContext } from './DateTimePickerDialogContext'

export type DateTimePickerDialogActionsProps = HTMLAttributes<HTMLDivElement>

export const DateTimePickerDialogActions = forwardRef<HTMLDivElement, DateTimePickerDialogActionsProps>(function DateTimePickerDialogActions(
  props,
  forwardedRef
) {
  const translation = useHightideTranslation()
  const { state, dispatch } = useDateTimePickerDialogContext()
  const { isSplit } = useDateTimePickerDialogChrome()

  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('date-time-picker-dialog-actions', props.className)}
    >
      {isSplit ? (
        <IconButton
          tooltip={translation('previous')}
          variant="foreground"
          icon={ArrowLeft}
          disabled={state.step === 'date'}
          onClick={() => dispatch({ type: 'setStep', step: 'date' })}
        />
      ) : (
        <Visibility isVisible={!state.value}>
          <Button
            size="md"
            color="neutral"
            onClick={() => dispatch({ type: 'commit', value: state.value })}
            className="date-time-picker-dialog-action"
          >
            {translation('cancel')}
          </Button>
        </Visibility>
      )}
      <Button
        size="md"
        onClick={() => {
          if (isSplit && state.step === 'date') {
            dispatch({ type: 'setStep', step: 'time' })
            return
          }
          dispatch({ type: 'commit', value: state.pickerValue })
        }}
        className="date-time-picker-dialog-action"
      >
        {translation('done')}
      </Button>
    </div>
  )
})
