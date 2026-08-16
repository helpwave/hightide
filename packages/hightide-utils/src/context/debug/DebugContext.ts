import { createContext } from 'react'

export type DebugHitBox = {
  isVisualizing: boolean,
  color: string,
}

export type DebugContextValue = {
  hitBox: DebugHitBox,
}

export const DEFAULT_HIT_BOX_COLOR = 'rgba(255, 0, 255, 0.3)'

export const defaultDebugContextValue: DebugContextValue = {
  hitBox: {
    isVisualizing: false,
    color: DEFAULT_HIT_BOX_COLOR,
  },
}

export const DebugContext = createContext<DebugContextValue | null>(null)
