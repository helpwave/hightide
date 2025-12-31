import type React from 'react'
import type { SingleOrArray } from './typing'
import { ArrayUtil } from './array'
import type { FormFieldInteractionStates } from '../components/form/FieldLayout'
import type { HTMLAttributes } from 'react'

///
/// Data Attributes
///

function bool(isActive: boolean): string | undefined {
  return isActive ? '' : undefined
}

function name(name: string, props: Record<string, unknown> = {}): string {
  return props['data-name'] ? String(props['data-name']) : name
}

type InteractionStateDataAttributes = {
  'data-disabled': string | undefined,
  'data-invalid': string | undefined,
  'data-readonly': string | undefined,
  'data-required': string | undefined,
}
function interactionStatesData(interactionStates: Partial<FormFieldInteractionStates>): Partial<InteractionStateDataAttributes> {
  return {
    'data-disabled': bool(!!interactionStates.disabled),
    'data-invalid': bool(!!interactionStates.invalid),
    'data-readonly': bool(!!interactionStates.readOnly),
    'data-required': bool(!!interactionStates.required),
  }
}

const dataAttributes = {
  bool,
  name,
  interactionStates: interactionStatesData,
}

///
/// DOM Event handling
///

type MouseEventExtenderProps<T> = {
  fromProps?: React.MouseEventHandler<T>,
  extensions: SingleOrArray<React.MouseEventHandler<T>>,
}

function mouseEventExtender<T>({
  fromProps,
  extensions
}: MouseEventExtenderProps<T>): React.MouseEventHandler<T> {
  return (event) => {
    fromProps?.(event)
    ArrayUtil.resolveSingleOrArray(extensions)
      .forEach(element => element(event))
  }
}

type KeyoardEventExtenderProps<T> = {
  fromProps: React.KeyboardEventHandler<T>,
  extensions: SingleOrArray<React.KeyboardEventHandler<T>>,
}

function keyboardEventExtender<T>({
  fromProps,
  extensions,
}: KeyoardEventExtenderProps<T>): React.KeyboardEventHandler<T> {
  return (event) => {
    fromProps?.(event)
    ArrayUtil.resolveSingleOrArray(extensions)
      .forEach(element => element(event))
  }
}

const extender = {
  mouseEvent: mouseEventExtender,
  keyboardEvent: keyboardEventExtender
}

///
/// ARIA & Accessibility
///

function click<T>(onClick: () => void) {
  const keyboardEventHandler: React.KeyboardEventHandler<T> = (event) => {
    if (event.key === 'Enter' || event.key === 'Space') {
      onClick()
    }
  }

  return {
    onClick: onClick,
    onKeyDown: keyboardEventHandler,
  }
}

function close<T>(onClose: () => void): React.KeyboardEventHandler<T> {
  return (event) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }
}

type NavigateType<T> = {
  left?: (event: React.KeyboardEvent<T>) => void,
  right?: (event: React.KeyboardEvent<T>) => void,
  up?: (event: React.KeyboardEvent<T>) => void,
  down?: (event: React.KeyboardEvent<T>) => void,
}
function navigate<T>({
  left,
  right,
  up,
  down,
}: NavigateType<T>): React.KeyboardEventHandler<T> {
  return (event) => {
    switch (event.key) {
    case 'ArrowLeft':
      left(event)
      break
    case 'ArrowRight':
      right(event)
      break
    case 'ArrowUp':
      up(event)
      break
    case 'ArrowDown':
      down(event)
      break
    }
  }
}

type InteractionStateARIAAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'aria-disabled' | 'aria-invalid' | 'aria-readonly' | 'aria-required'>

function interactionStatesAria(
  interactionStates: Partial<FormFieldInteractionStates>,
  props: Partial<InteractionStateARIAAttributes> = {}
): Partial<InteractionStateARIAAttributes> {
  return {
    'aria-disabled': props['aria-disabled'] ?? interactionStates.disabled,
    'aria-invalid': props['aria-invalid'] ?? interactionStates.invalid,
    'aria-readonly': props['aria-readonly'] ?? interactionStates.readOnly,
    'aria-required': props['aria-required'] ?? interactionStates.required,
  }
}

const aria = {
  close,
  click,
  navigate,
  interactionStates: interactionStatesAria,
}

export const PropsUtil = {
  extender,
  dataAttributes,
  aria,
}