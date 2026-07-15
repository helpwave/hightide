import { themes } from '../tokens'
import type {
  ComponentColors,
  DesignTheme,
  SemanticColors,
  ThemeMode
} from '../types'

export const getTheme = (mode: ThemeMode): DesignTheme => themes[mode]

export const getSemanticColors = (mode: ThemeMode): SemanticColors => themes[mode].semantic

export const getComponentColors = (mode: ThemeMode): ComponentColors => themes[mode].component

export const getColorPalettes = (mode: ThemeMode) => themes[mode].palettes
