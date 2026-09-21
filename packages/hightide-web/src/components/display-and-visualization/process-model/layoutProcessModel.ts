import type {
  ProcessModelEdge,
  ProcessModelEdgePointResult,
  ProcessModelEdgeStrokeStyle,
  ProcessModelGraph,
  ProcessModelGraphNode,
  ProcessModelLayoutResult,
  ProcessModelNodePosition
} from './types'
import type { ProcessModelActivityNodeKind } from './ProcessModelActivityNode'

const NODE_H = 52
const COL_GAP = 72
const ROW_GAP = 72

const ACTIVITY_NODE_MIN_WIDTH = 120

const ACTIVITY_PAD_X = 24
const ACTIVITY_ICON_W = 28
const ACTIVITY_GAP = 8
const ACTIVITY_LABEL_PX_PER_CHAR = 6.9
const ACTIVITY_COUNT_PX_PER_CHAR = 6.15
const TERMINAL_HEX_W = 34
const TERMINAL_GAP = 12
const TERMINAL_LABEL_PX_PER_CHAR = 7.5
const TERMINAL_COUNT_PX_PER_CHAR = 6.2
const ACTIVITY_WIDTH_SAFETY_PX = 14

const EDGE_LABEL_ALONG_FR = 0.22
const EDGE_LABEL_BEZIER_T = 0.2
const EDGE_STRAIGHT_PX = 14

type CubicPt = { x: number, y: number }

function stringVisualUnits(s: string): number {
  return [...s].length
}

function terminalCountDisplayLine(rawCount: string): string {
  return `${rawCount} traces`
}

function estimateProcessModelActivityChromeWidth(
  kind: ProcessModelActivityNodeKind,
  label: string,
  countLine: string
): number {
  const labelPx = kind === 'terminal' ? TERMINAL_LABEL_PX_PER_CHAR : ACTIVITY_LABEL_PX_PER_CHAR
  const countPx = kind === 'terminal' ? TERMINAL_COUNT_PX_PER_CHAR : ACTIVITY_COUNT_PX_PER_CHAR
  const labelW = stringVisualUnits(label) * labelPx
  const countW = stringVisualUnits(countLine) * countPx
  const textW = Math.max(labelW, countW)
  const iconW = kind === 'terminal' ? TERMINAL_HEX_W : ACTIVITY_ICON_W
  const gap = kind === 'terminal' ? TERMINAL_GAP : ACTIVITY_GAP
  const chrome = ACTIVITY_PAD_X + iconW + gap
  const w = chrome + textW + ACTIVITY_WIDTH_SAFETY_PX
  return Math.max(ACTIVITY_NODE_MIN_WIDTH, Math.ceil(w))
}

function estimateProcessModelActivityNodeWidth(label: string, count: string): number {
  return estimateProcessModelActivityChromeWidth('activity', label, count)
}

function cubicBezierPoint(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  t: number
): { x: number, y: number } {
  const u = 1 - t
  const u2 = u * u
  const u3 = u2 * u
  const t2 = t * t
  const t3 = t2 * t
  return {
    x: u3 * x0 + 3 * u2 * t * x1 + 3 * u * t2 * x2 + t3 * x3,
    y: u3 * y0 + 3 * u2 * t * y1 + 3 * u * t2 * y2 + t3 * y3,
  }
}

function lerpPt(a: CubicPt, b: CubicPt, t: number): CubicPt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

function splitCubicAt(
  p0: CubicPt,
  p1: CubicPt,
  p2: CubicPt,
  p3: CubicPt,
  t: number
): { left: [CubicPt, CubicPt, CubicPt, CubicPt], right: [CubicPt, CubicPt, CubicPt, CubicPt] } {
  const q0 = lerpPt(p0, p1, t)
  const q1 = lerpPt(p1, p2, t)
  const q2 = lerpPt(p2, p3, t)
  const r0 = lerpPt(q0, q1, t)
  const r1 = lerpPt(q1, q2, t)
  const s = lerpPt(r0, r1, t)
  return {
    left: [p0, q0, r0, s],
    right: [s, r1, q2, p3],
  }
}

function linePathDWithStraightCaps(sx: number, sy: number, ex: number, ey: number, run: number): string {
  const dx = ex - sx
  const dy = ey - sy
  const len = Math.hypot(dx, dy)
  if (len < 1e-9) {
    return `M${sx},${sy}`
  }
  const ux = dx / len
  const uy = dy / len
  const inset = Math.min(run, Math.max(0, (len - 2) / 2))
  if (inset < 0.5) {
    return `M${sx},${sy} L${ex},${ey}`
  }
  return `M${sx + ux * inset},${sy + uy * inset} L${ex - ux * inset},${ey - uy * inset}`
}

function cubicPathDWithEndStraightCap(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  runPx: number
): string {
  const hull =
    Math.hypot(x1 - x0, y1 - y0) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2)
  if (hull < runPx * 2 + 6) {
    return `M${x0},${y0} C${x1},${y1} ${x2},${y2} ${x3},${y3}`
  }
  let lo = 0
  let hi = 1
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2
    const b = cubicBezierPoint(x0, y0, x1, y1, x2, y2, x3, y3, mid)
    const d = Math.hypot(x3 - b.x, y3 - b.y)
    if (d > runPx) {
      lo = mid
    } else {
      hi = mid
    }
  }
  const t = Math.min(0.9999, Math.max(0.0001, hi))
  const p0: CubicPt = { x: x0, y: y0 }
  const p1: CubicPt = { x: x1, y: y1 }
  const p2: CubicPt = { x: x2, y: y2 }
  const p3: CubicPt = { x: x3, y: y3 }
  const [l0, l1, l2, l3] = splitCubicAt(p0, p1, p2, p3, t).left
  const gap = Math.hypot(x3 - l3.x, y3 - l3.y)
  if (gap < 0.75) {
    return `M${l0.x},${l0.y} C${l1.x},${l1.y} ${l2.x},${l2.y} ${x3},${y3}`
  }
  return `M${l0.x},${l0.y} C${l1.x},${l1.y} ${l2.x},${l2.y} ${l3.x},${l3.y} L${x3},${y3}`
}

function nodeWidth(n: ProcessModelGraphNode): number {
  if (n.type === 'start' || n.type === 'end') {
    return estimateProcessModelActivityChromeWidth(
      'terminal',
      n.label,
      terminalCountDisplayLine(n.count)
    )
  }
  return estimateProcessModelActivityNodeWidth(n.label, n.count)
}

function computeLayout(graph: ProcessModelGraph): ProcessModelLayoutResult {
  const nodes = graph.nodes
  const layers: Record<number, ProcessModelGraphNode[]> = {}
  nodes.forEach((n) => {
    const l = n.layer ?? 0
    if (!layers[l]) {
      layers[l] = []
    }
    layers[l].push(n)
  })
  const layerKeys = Object.keys(layers).map(Number).sort((a, b) => a - b)
  layerKeys.forEach((l) => {
    layers[l].sort((a, b) => (a.col ?? 0) - (b.col ?? 0))
  })

  const layerTotalWidths = layerKeys.map((l) => {
    const ns = layers[l]
    return ns.reduce((s, n) => s + nodeWidth(n), 0) + Math.max(0, ns.length - 1) * COL_GAP
  })
  const canvasW = Math.max(...layerTotalWidths) + 120

  const positions: Record<string, ProcessModelNodePosition> = {}
  let curY = 40
  layerKeys.forEach((l, li) => {
    const ns = layers[l]
    const totalW = layerTotalWidths[li]
    let curX = (canvasW - totalW) / 2
    ns.forEach((n) => {
      const w = nodeWidth(n)
      positions[n.id] = { x: curX, y: curY, w, h: NODE_H, layer: l }
      curX += w + COL_GAP
    })
    curY += NODE_H + ROW_GAP
  })
  const canvasH = curY - ROW_GAP + 40

  return { positions, canvasW, canvasH }
}

function getEdgePoints(
  pos: Record<string, ProcessModelNodePosition>,
  fromId: string,
  toId: string,
  allEdges: ProcessModelEdge[]
): ProcessModelEdgePointResult | null {
  const f = pos[fromId]
  const t = pos[toId]
  if (!f || !t) {
    return null
  }

  const fc = { x: f.x + f.w / 2, y: f.y + f.h / 2 }
  const tc = { x: t.x + t.w / 2, y: t.y + t.h / 2 }

  const dx = tc.x - fc.x

  const sameLayer = f.layer === t.layer
  const isBackEdge = t.layer < f.layer
  const layerSpan = Math.abs(t.layer - f.layer)
  const isSkipEdge = !isBackEdge && layerSpan > 1
  const sameColumn = Math.abs(dx) < 8
  const hasPair = allEdges.some((e) => e.from === toId && e.to === fromId)

  let pathD: string
  let labelPt: { x: number, y: number }

  function leftArcRoute(): ProcessModelEdgePointResult {
    const minL = Math.min(f.layer, t.layer)
    const maxL = Math.max(f.layer, t.layer)
    let leftmostX = Math.min(f.x, t.x)
    Object.entries(pos).forEach(([nid, p]) => {
      if (p.layer >= minL && p.layer <= maxL && nid !== fromId && nid !== toId) {
        leftmostX = Math.min(leftmostX, p.x)
      }
    })
    const margin = 56 + layerSpan * 8
    const leftX = leftmostX - margin
    const sx = f.x
    const sy = fc.y
    const ex = t.x
    const ey = tc.y
    const labelPt = cubicBezierPoint(sx, sy, leftX, sy, leftX, ey, ex, ey, EDGE_LABEL_BEZIER_T)
    const run = EDGE_STRAIGHT_PX
    const hSign = Math.sign(leftX - sx) || -1
    const hInset = Math.min(run, Math.max(0, Math.abs(leftX - sx) * 0.35))
    const sx2 = sx + hSign * hInset
    const inner = cubicPathDWithEndStraightCap(sx2, sy, leftX, sy, leftX, ey, ex, ey, run)
    const cIdx = inner.indexOf(' C')
    const pathD =
      hInset > 0.25 && cIdx >= 0
        ? `M${sx},${sy} L${sx2},${sy}${inner.slice(cIdx)}`
        : inner
    return {
      pathD,
      labelPt,
    }
  }

  if (hasPair) {
    const idxForward = allEdges.findIndex((e) => e.from === fromId && e.to === toId)
    const idxReverse = allEdges.findIndex((e) => e.from === toId && e.to === fromId)
    const isForward = idxForward < idxReverse
    const offsetY = isForward ? -8 : 8
    const sx = dx > 0 ? f.x + f.w : f.x
    const ex = dx > 0 ? t.x : t.x + t.w
    const sy = fc.y + offsetY
    const ey = tc.y + offsetY
    pathD = linePathDWithStraightCaps(sx, sy, ex, ey, EDGE_STRAIGHT_PX)
    labelPt = { x: sx + (ex - sx) * EDGE_LABEL_ALONG_FR, y: sy - 11 }
  } else if (isBackEdge || isSkipEdge) {
    const arc = leftArcRoute()
    pathD = arc.pathD
    labelPt = arc.labelPt
  } else if (sameLayer) {
    const sx = dx > 0 ? f.x + f.w : f.x
    const ex = dx > 0 ? t.x : t.x + t.w
    const sy = fc.y
    const ey = tc.y
    pathD = linePathDWithStraightCaps(sx, sy, ex, ey, EDGE_STRAIGHT_PX)
    labelPt = { x: sx + (ex - sx) * EDGE_LABEL_ALONG_FR, y: sy - 11 }
  } else if (sameColumn) {
    const sx = fc.x
    const sy = f.y + f.h
    const ex = tc.x
    const ey = t.y
    pathD = linePathDWithStraightCaps(sx, sy, ex, ey, EDGE_STRAIGHT_PX)
    const alongY = sy + (ey - sy) * EDGE_LABEL_ALONG_FR
    labelPt = { x: sx + 16, y: alongY }
  } else {
    const sx = fc.x
    const sy = f.y + f.h
    const ex = tc.x
    const ey = t.y
    const span = Math.abs(ey - sy)
    const cp1y = sy + span * 0.45
    const cp2y = ey - span * 0.45
    const run = EDGE_STRAIGHT_PX
    const vSign = Math.sign(cp1y - sy) || 1
    const vInset = Math.min(run, Math.max(0, Math.abs(cp1y - sy) * 0.35))
    const sy2 = sy + vSign * vInset
    const inner = cubicPathDWithEndStraightCap(sx, sy2, sx, cp1y, ex, cp2y, ex, ey, run)
    const cIdx = inner.indexOf(' C')
    pathD =
      vInset > 0.25 && cIdx >= 0
        ? `M${sx},${sy} L${sx},${sy2}${inner.slice(cIdx)}`
        : inner
    labelPt = cubicBezierPoint(sx, sy, sx, cp1y, ex, cp2y, ex, ey, EDGE_LABEL_BEZIER_T)
    const offX = dx > 0 ? 10 : -10
    labelPt = { x: labelPt.x + offX, y: labelPt.y - 5 }
  }

  return { pathD, labelPt }
}

function weightToStyle(weight: number, maxWeight: number): ProcessModelEdgeStrokeStyle {
  const ratio = maxWeight > 0 ? weight / maxWeight : 0
  if (ratio > 0.6) {
    return { opacity: 1.0, sw: 2.5, markerTier: 'strong' }
  }
  if (ratio > 0.2) {
    return { opacity: 0.6, sw: 1.8, markerTier: 'medium' }
  }
  return { opacity: 0.28, sw: 1.4, markerTier: 'faint' }
}

function maxEdgeWeight(edges: ProcessModelEdge[]): number {
  if (!edges.length) {
    return 1
  }
  return Math.max(...edges.map((e) => e.weight))
}

function getProcessModelEdgePathDomId(
  pathIdPrefix: string | undefined,
  from: string,
  to: string
): string {
  if (pathIdPrefix != null && pathIdPrefix !== '') {
    return `ep-${pathIdPrefix}-${from}-${to}`
  }
  return `ep-${from}-${to}`
}

export const ProcessModelLayoutUtilities = {
  ACTIVITY_NODE_MIN_WIDTH,
  NODE_H,
  terminalCountDisplayLine,
  estimateProcessModelActivityChromeWidth,
  estimateProcessModelActivityNodeWidth,
  computeLayout,
  getEdgePoints,
  weightToStyle,
  maxEdgeWeight,
  getProcessModelEdgePathDomId,
}
