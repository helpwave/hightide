import type { HexColor } from './color'
import type { TokenContextInput } from '../token-context'
import type { ColorPair } from './color'

export type ColoringColors = {
  color: HexColor,
  onColor: HexColor,
  accent: HexColor,
}

export type Coloring = {
  foreground: HexColor,
  background: HexColor,
  accent: HexColor,
}

export type PressableColoring = {
  background: HexColor,
  foreground: HexColor,
  border: HexColor,
  outline: HexColor,
}

export type InputColoring = {
  background: HexColor,
  text: HexColor,
  border: HexColor,
}

export type ControlLayout = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  horizontalContentPadding: number,
}

export type ContainerLayout = {
  size: number,
  insetY: number,
  insetX: number,
  borderRadius: number,
  minimumWidth: number,
  minimumHeight: number,
}

export type InsideControlLayout = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  paddingExtension: number,
}

export type SemanticColorFn<T> = (context?: TokenContextInput) => T

export type HightideThemeSemantics = {
  colors: {
    coloringColorVariant: SemanticColorFn<ColoringColors>,
    coloringStyle: SemanticColorFn<Coloring>,
    pressableColoring: SemanticColorFn<PressableColoring>,
    pressableStateLayerTint: SemanticColorFn<HexColor>,
    inputColoring: SemanticColorFn<InputColoring>,
    tintedSurface: SemanticColorFn<HexColor>,
    withAppearance: SemanticColorFn<HexColor>,
    asFaded: SemanticColorFn<HexColor>,
    asDescription: SemanticColorFn<HexColor>,
  },
  numbers: {
    touchTargetSize: SemanticColorFn<number>,
    controlLayout: SemanticColorFn<ControlLayout>,
    containerLayout: SemanticColorFn<ContainerLayout>,
    insideControlLayout: SemanticColorFn<InsideControlLayout>,
  },
}

export type { ColorPair }
