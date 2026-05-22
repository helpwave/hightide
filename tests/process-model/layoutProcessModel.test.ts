import { ProcessModelLayoutUtilities } from '../../src/components/display-and-visualization/process-model/layoutProcessModel'
import type { ProcessModelGraph } from '../../src/components/display-and-visualization/process-model/types'

const verticalTwoNodeGraph: ProcessModelGraph = {
  nodes: [
    { id: 'a', label: 'Start', count: '1', type: 'start', layer: 0, col: 0 },
    { id: 'b', label: 'End', count: '1', type: 'end', layer: 1, col: 0 },
  ],
  edges: [{ from: 'a', to: 'b', label: '1', weight: 1 }],
}

const activity = (
  id: string,
  label: string,
  count: string,
  layer: number,
  col: number
) => ({
  id,
  type: 'activity' as const,
  label,
  count,
  layer,
  col,
})

describe('estimateProcessModelActivityNodeWidth', () => {
  test('grows with longer label text', () => {
    const short = ProcessModelLayoutUtilities.estimateProcessModelActivityNodeWidth('A', '1')
    const long = ProcessModelLayoutUtilities.estimateProcessModelActivityNodeWidth('Very long activity step name', '1')
    expect(long).toBeGreaterThan(short)
    expect(short).toBeGreaterThanOrEqual(120)
  })
})

describe('estimateProcessModelActivityChromeWidth', () => {
  test('terminal width tracks label and count line like the activity node', () => {
    const narrow = ProcessModelLayoutUtilities.estimateProcessModelActivityChromeWidth(
      'terminal',
      'Start',
      ProcessModelLayoutUtilities.terminalCountDisplayLine('1')
    )
    const wide = ProcessModelLayoutUtilities.estimateProcessModelActivityChromeWidth(
      'terminal',
      'Very long start or end node title',
      ProcessModelLayoutUtilities.terminalCountDisplayLine('99999')
    )
    expect(wide).toBeGreaterThan(narrow)
    expect(narrow).toBeGreaterThanOrEqual(120)
    expect(narrow).toBeLessThan(280)
  })
})

describe('computeLayout', () => {
  test('assigns positions for each node id', () => {
    const { positions, canvasW, canvasH } = ProcessModelLayoutUtilities.computeLayout(verticalTwoNodeGraph)
    expect(positions.a).toBeDefined()
    expect(positions.b).toBeDefined()
    expect(positions.a.w).toBeGreaterThan(0)
    expect(positions.b.w).toBeGreaterThan(0)
    expect(canvasW).toBeGreaterThan(0)
    expect(canvasH).toBeGreaterThan(0)
    expect(positions.b.y).toBeGreaterThan(positions.a.y)
  })

  test('uses wider foreignObject for longer activity labels', () => {
    const shortGraph: ProcessModelGraph = {
      nodes: [
        { id: 's', label: 'Start', count: '1', type: 'start', layer: 0, col: 0 },
        activity('m', 'Hi', '1', 0, 1),
        { id: 'e', label: 'End', count: '1', type: 'end', layer: 0, col: 2 },
      ],
      edges: [],
    }
    const longGraph: ProcessModelGraph = {
      nodes: [
        { id: 's', label: 'Start', count: '1', type: 'start', layer: 0, col: 0 },
        activity('m', 'Much longer middle activity label', '999', 0, 1),
        { id: 'e', label: 'End', count: '1', type: 'end', layer: 0, col: 2 },
      ],
      edges: [],
    }
    const wShort = ProcessModelLayoutUtilities.computeLayout(shortGraph).positions.m.w
    const wLong = ProcessModelLayoutUtilities.computeLayout(longGraph).positions.m.w
    expect(wLong).toBeGreaterThan(wShort)
  })
})

describe('getEdgePoints', () => {
  test('returns vertical path for stacked nodes', () => {
    const { positions } = ProcessModelLayoutUtilities.computeLayout(verticalTwoNodeGraph)
    const pts = ProcessModelLayoutUtilities.getEdgePoints(positions, 'a', 'b', verticalTwoNodeGraph.edges)
    expect(pts).not.toBeNull()
    expect(pts?.pathD).toMatch(/^M[\d.-]+,[\d.-]+\s+L[\d.-]+,[\d.-]+$/)
    expect(pts?.labelPt.x).toBeDefined()
    expect(pts?.labelPt.y).toBeDefined()
  })

  test('returns null when node id is missing', () => {
    const { positions } = ProcessModelLayoutUtilities.computeLayout(verticalTwoNodeGraph)
    expect(ProcessModelLayoutUtilities.getEdgePoints(positions, 'a', 'missing', verticalTwoNodeGraph.edges)).toBeNull()
  })

  test('curved skip edge ends with a straight segment for the marker', () => {
    const skipGraph: ProcessModelGraph = {
      nodes: [
        { id: 's', label: 'Start', count: '1', type: 'start', layer: 0, col: 0 },
        { id: 'e', label: 'End', count: '1', type: 'end', layer: 2, col: 0 },
      ],
      edges: [{ from: 's', to: 'e', label: '1', weight: 1 }],
    }
    const { positions } = ProcessModelLayoutUtilities.computeLayout(skipGraph)
    const pts = ProcessModelLayoutUtilities.getEdgePoints(positions, 's', 'e', skipGraph.edges)
    expect(pts).not.toBeNull()
    expect(pts?.pathD).toContain(' C')
    expect(pts?.pathD).toMatch(/\s+L[\d.-]+,[\d.-]+$/)
  })
})

describe('maxEdgeWeight', () => {
  test('returns max of weights', () => {
    expect(ProcessModelLayoutUtilities.maxEdgeWeight([{ from: 'a', to: 'b', label: 'x', weight: 3 }, { from: 'b', to: 'c', label: 'y', weight: 10 }])).toBe(10)
  })

  test('returns 1 for empty edges', () => {
    expect(ProcessModelLayoutUtilities.maxEdgeWeight([])).toBe(1)
  })
})

describe('getProcessModelEdgePathDomId', () => {
  test('prefixes id when prefix is set', () => {
    expect(ProcessModelLayoutUtilities.getProcessModelEdgePathDomId('p1', 'a', 'b')).toBe('ep-p1-a-b')
  })

  test('omits prefix segment when prefix is empty', () => {
    expect(ProcessModelLayoutUtilities.getProcessModelEdgePathDomId('', 'a', 'b')).toBe('ep-a-b')
    expect(ProcessModelLayoutUtilities.getProcessModelEdgePathDomId(undefined, 'a', 'b')).toBe('ep-a-b')
  })
})

describe('weightToStyle', () => {
  test('maps high ratio to strong marker tier', () => {
    const s = ProcessModelLayoutUtilities.weightToStyle(80, 100)
    expect(s.markerTier).toBe('strong')
    expect(s.opacity).toBe(1)
  })

  test('maps mid ratio to medium', () => {
    const s = ProcessModelLayoutUtilities.weightToStyle(40, 100)
    expect(s.markerTier).toBe('medium')
  })

  test('maps low ratio to faint', () => {
    const s = ProcessModelLayoutUtilities.weightToStyle(10, 100)
    expect(s.markerTier).toBe('faint')
  })
})
