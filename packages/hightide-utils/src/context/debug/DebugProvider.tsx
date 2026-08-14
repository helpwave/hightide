import {
  useMemo,
  type PropsWithChildren
} from 'react'

import {
  DebugContext,
  DEFAULT_HIT_BOX_COLOR,
  type DebugContextValue,
  type DebugHitBox
} from './DebugContext'

export type DebugProviderProps = PropsWithChildren & {
  hitBox?: Partial<DebugHitBox>,
}

export const DebugProvider = ({
  children,
  hitBox,
}: DebugProviderProps) => {
  const value = useMemo((): DebugContextValue => ({
    hitBox: {
      isVisualizing: hitBox?.isVisualizing ?? false,
      color: hitBox?.color ?? DEFAULT_HIT_BOX_COLOR,
    },
  }), [hitBox?.isVisualizing, hitBox?.color])

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  )
}
