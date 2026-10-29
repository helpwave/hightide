import type { ComponentRef, Ref, RefObject } from 'react'
import { useCallback, useId, useMemo, useRef } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type { HexColor } from './hexColor'
import { coerceHex, defaultHex } from './hexColor'
import { ColorInputContext } from './ColorInputContext'
import { ColorInputControl, type ColorInputControlProps } from './ColorInputControl'
import { ColorInputDialog } from './ColorInputDialog'
import { ColorInputField, type ColorInputFieldProps } from './ColorInputField'
import { ColorInputLayout, type ColorInputLayoutProps } from './ColorInputLayout'
import { ColorInputStateManager } from './ColorInputStateManager'
import { colorInputStateFromHex, type ColorInputEvent, type ColorInputState } from './ColorInputState'
import { ColorInputSwatch } from './ColorInputSwatch'

export type ColorInputProps = ControllableInputProps<HexColor, ColorInputEvent> & {
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
  const [state, setState] = useControlledState<ColorInputState>({
    defaultValue: colorInputStateFromHex(value ?? initialValue ?? defaultHex(true)),
  })
  const binding = useStateMachineBinding<ColorInputState, HexColor>({
    state,
    onStateChange: setState,
    onValueChange,
    value: value === undefined ? undefined : coerceHex(value, true),
    inject: useCallback(() => ({}), []),
    get: useCallback((current: ColorInputState) => current.value, []),
  })

  return (
    <ColorInputStateManager
      state={binding.state}
      hasAlpha={hasAlpha}
      isCapitalized={isCapitalized}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
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
