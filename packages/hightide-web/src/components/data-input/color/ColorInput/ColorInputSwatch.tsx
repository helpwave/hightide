import { IconButton } from '../../../interaction/IconButton'
import { useColorInputContext } from './ColorInputContext'

export type ColorInputSwatchProps = {
  popupId: string,
}

export function ColorInputSwatch({ popupId }: ColorInputSwatchProps) {
  const { state, dispatch, config } = useColorInputContext()
  const locked = config.isDisabled || config.isReadOnly

  return (
    <div className="color-input-actions">
      <IconButton
        aria-label="Choose color"
        aria-haspopup="dialog"
        aria-expanded={state.isOpen}
        aria-controls={state.isOpen ? popupId : undefined}
        variant="foreground"
        color="neutral"
        size="sm"
        disabled={locked}
        onClick={() => dispatch({ type: state.isOpen ? 'close' : 'open' })}
      >
        <span className="color-input-swatch" data-alpha={config.hasAlpha ? '' : undefined}>
          <span className="color-input-swatch-fill" style={{ backgroundColor: state.value }} />
        </span>
      </IconButton>
    </div>
  )
}
