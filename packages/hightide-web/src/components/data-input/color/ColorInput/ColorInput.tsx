import type { ComponentRef, Ref, RefObject } from 'react'
import { useId, useMemo, useRef } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type { HexColor } from './hexColor'
import { defaultHex } from './hexColor'
import { ColorInputContext } from './ColorInputContext'
import { ColorInputControl, type ColorInputControlProps } from './ColorInputControl'
import { ColorInputDialog } from './ColorInputDialog'
import { ColorInputField, type ColorInputFieldProps } from './ColorInputField'
import { ColorInputLayout, type ColorInputLayoutProps } from './ColorInputLayout'
import { ColorInputStateManager } from './ColorInputStateManager'
import { colorInputStateFromHex, type ColorInputEvent, type ColorInputState } from './ColorInputState'
import { ColorInputSwatch } from './ColorInputSwatch'

export type ColorInputProps = ControllableDOMInputProps<HexColor, ColorInputEvent> & {
  hasAlpha?: boolean,
  isCapitalized?: boolean,
  layoutRef?: Ref<ComponentRef<typeof ColorInputLayout>>,
  layoutProps?: ColorInputLayoutProps,
  controlRef?: Ref<ComponentRef<typeof ColorInputControl>>,
  controlProps?: ColorInputControlProps,
  inputRef?: Ref<ComponentRef<typeof ColorInputField>>,
  inputProps?: ColorInputFieldProps,
}

const ColorInputComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  hasAlpha = false,
  isCapitalized = false,
  layoutRef,
  layoutProps,
  controlRef,
  controlProps,
  inputRef,
  inputProps,
}: ColorInputProps) => {
  const generatedId = useId()
  const popupId = useMemo(() => `color-input-popup-${generatedId}`, [generatedId])
  const anchorRef = useRef<HTMLDivElement>(null)
  const store = useStateStore<ColorInputState>(
    colorInputStateFromHex(value ?? initialValue ?? defaultHex(true))
  )
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })

  return (
    <ColorInputStateManager
      state={store}
      hasAlpha={hasAlpha}
      isCapitalized={isCapitalized}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
    >
      <ColorInputLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <ColorInputControl
          {...controlProps}
          ref={ReactUtils.assingRefsBuilder([anchorRef, controlRef])}
        >
          <ColorInputField
            {...inputProps}
            ref={ReactUtils.assingRefsBuilder([inputRef])}
          />
          <ColorInputSwatch popupId={popupId} />
        </ColorInputControl>
        <ColorInputDialog
          popupId={popupId}
          anchor={anchorRef as RefObject<HTMLDivElement | null>}
        />
      </ColorInputLayout>
    </ColorInputStateManager>
  )
}

export const ColorInput = Object.assign(ColorInputComponent, {
  StateManager: ColorInputStateManager,
  Layout: ColorInputLayout,
  Control: ColorInputControl,
  Field: ColorInputField,
  Swatch: ColorInputSwatch,
  Dialog: ColorInputDialog,
  Context: ColorInputContext,
  Provider: ColorInputContext.Provider,
  Consumer: ColorInputContext.Consumer,
})
