import type React from 'react'
import type { SingleOrArray } from './typing'
import { ArrayUtil } from './array'

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
} : KeyoardEventExtenderProps<T>): React.KeyboardEventHandler<T> {
  return (event) => {
    fromProps?.(event)
    ArrayUtil.resolveSingleOrArray(extensions)
      .forEach(element => element(event))
  }
}

type ButtonClickEmulatorProps = {
    onClick: () => void,
}

function buttonClickEmulator<T>({
  onClick,
}: ButtonClickEmulatorProps) {
  const keyboardEventHandler: React.KeyboardEventHandler<T> = (event) => {
    if(event.key === 'Enter' || event.key === 'Space') {
      onClick()
    }
  }

  return {
    onClick: onClick,
    onKeyDown: keyboardEventHandler,
  }
}

export const PropsUtil = {
  extender: {
    mouseEvent: mouseEventExtender,
    keyboardEvent: keyboardEventExtender
  },
  aria: {
    buttonClickEmulator,
  },
}