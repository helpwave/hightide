import type { CSSProperties, PointerEvent, RefObject } from 'react'
import { PopUp } from '../../../layout/PopUp/PopUp'
import { pointerRatio, saturatedHueHex } from './hexColor'
import { useColorInputContext } from './ColorInputContext'

export type ColorInputDialogProps = {
  popupId: string,
  anchor: RefObject<HTMLDivElement | null>,
}

function pickPlane(
  event: PointerEvent<HTMLDivElement>,
  onPick: (saturation: number, valueLevel: number) => void
) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.setPointerCapture(event.pointerId)
  onPick(
    pointerRatio(event.clientX, rect.left, rect.width),
    1 - pointerRatio(event.clientY, rect.top, rect.height)
  )
}

function pickSlider(event: PointerEvent<HTMLDivElement>, onPick: (unit: number) => void) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.setPointerCapture(event.pointerId)
  onPick(pointerRatio(event.clientX, rect.left, rect.width))
}

export function ColorInputDialog({ popupId, anchor }: ColorInputDialogProps) {
  const { state, dispatch, config } = useColorInputContext()
  const hueColor = saturatedHueHex(state.hue)
  const opaque = state.value.slice(0, 7)

  return (
    <PopUp
      id={popupId}
      isOpen={state.isOpen}
      anchor={anchor}
      options={{
        verticalAlignment: 'afterEnd',
        horizontalAlignment: 'center',
        gap: 4,
      }}
      outsideClickOptions={{ refs: [anchor] }}
      onClose={() => dispatch({ type: 'close' })}
      role="dialog"
      aria-label="Choose color"
      className="color-input-dialog"
    >
      <div
        className="color-input-plane"
        style={{
          backgroundImage: `linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, ${hueColor})`,
        }}
        onPointerDown={(event) => pickPlane(event, (saturation, valueLevel) => {
          dispatch({ type: 'pickSaturation', saturation, valueLevel })
        })}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          pickPlane(event, (saturation, valueLevel) => {
            dispatch({ type: 'pickSaturation', saturation, valueLevel })
          })
        }}
      >
        <span
          className="color-input-marker"
          style={{
            left: `${state.saturation * 100}%`,
            top: `${(1 - state.valueLevel) * 100}%`,
          }}
        />
      </div>
      <div
        className="color-input-slider color-input-hue"
        onPointerDown={(event) => pickSlider(event, (hue) => dispatch({ type: 'pickHue', hue }))}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          pickSlider(event, (hue) => dispatch({ type: 'pickHue', hue }))
        }}
      >
        <span className="color-input-marker" style={{ left: `${state.hue * 100}%` }} />
      </div>
      {config.hasAlpha && (
        <div
          className="color-input-slider color-input-alpha"
          style={{ '--color-input-opaque': opaque } as CSSProperties}
          onPointerDown={(event) => pickSlider(event, (alphaLevel) => dispatch({ type: 'pickAlpha', alphaLevel }))}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
            pickSlider(event, (alphaLevel) => dispatch({ type: 'pickAlpha', alphaLevel }))
          }}
        >
          <span className="color-input-marker" style={{ left: `${state.alphaLevel * 100}%` }} />
        </div>
      )}
    </PopUp>
  )
}
