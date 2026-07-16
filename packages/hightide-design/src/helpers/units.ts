import type { FixedUnit, ScalingUnit } from '../types'
import { componentLayouts } from '../tokens'

export const scalingBasePx = 16

export const toPx = (value: ScalingUnit | FixedUnit): number => value

export const remStringToScaling = (value: `${number}rem`): ScalingUnit => {
  return Number.parseFloat(value) * scalingBasePx
}

export type RemValue = `${number}rem`

export const remToPx = (value: RemValue | ScalingUnit | FixedUnit): number => {
  if (typeof value === 'number') {
    return value
  }
  return remStringToScaling(value)
}

export const getIconSizePx = (size: keyof typeof componentLayouts.icon): number => {
  return componentLayouts.icon[size].size
}

export const getIconStrokeWidth = (size: keyof typeof componentLayouts.icon): number => {
  return componentLayouts.icon[size].strokeWidth
}
