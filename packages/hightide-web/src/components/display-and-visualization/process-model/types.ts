export type ProcessModelTerminalKind = 'start' | 'end'

export type ProcessModelActivityIconKind = 'plus' | 'check'

export type ProcessModelNodeBase = {
  id: string,
  label: string,
  count: string,
  layer: number,
  col: number,
}

export type ProcessModelGraphTerminalNode = ProcessModelNodeBase & {
  type: ProcessModelTerminalKind,
}

export type ProcessModelGraphActivityNode = ProcessModelNodeBase & {
  type: 'activity',
  activityIcon?: ProcessModelActivityIconKind,
}

export type ProcessModelGraphNode = ProcessModelGraphTerminalNode | ProcessModelGraphActivityNode

export type ProcessModelEdge = {
  from: string,
  to: string,
  label: string,
  weight: number,
}

export type ProcessModelTrace = {
  name: string,
  nodes: string[],
}

export type ProcessModelGraph = {
  nodes: ProcessModelGraphNode[],
  edges: ProcessModelEdge[],
  traces?: ProcessModelTrace[],
}

export type ProcessModelGraphWithTraces = ProcessModelGraph & {
  traces: ProcessModelTrace[],
}

export type ProcessModelLibraryEntry = {
  id: string,
  name: string,
  description: string,
  graph: ProcessModelGraph,
}

export type ProcessModelNodePosition = {
  x: number,
  y: number,
  w: number,
  h: number,
  layer: number,
}

export type ProcessModelLayoutResult = {
  positions: Record<string, ProcessModelNodePosition>,
  canvasW: number,
  canvasH: number,
}

export type ProcessModelEdgePointResult = {
  pathD: string,
  labelPt: { x: number, y: number },
}

export type ProcessModelEdgeStrokeStyle = {
  opacity: number,
  sw: number,
  markerTier: 'strong' | 'medium' | 'faint',
}
