import { useId, useMemo, type ReactNode } from 'react'
import clsx from 'clsx'
import { Check, Plus } from 'lucide-react'
import { ProcessModelActivityNode } from './ProcessModelActivityNode'
import { ProcessModelTerminalNode } from './ProcessModelTerminalNode'
import { ProcessModelLayoutUtilities } from './layoutProcessModel'
import type {
  ProcessModelGraph,
  ProcessModelGraphActivityNode,
  ProcessModelGraphNode
} from './types'

export type ProcessModelCanvasProps = {
  graph: ProcessModelGraph,
  className?: string,
  showNodeBorder?: boolean,
  activeNodeId?: string,
  visitedNodeIds?: ReadonlySet<string>,
  renderActivityIcon?: (node: ProcessModelGraphActivityNode) => ReactNode,
  edgePathIdPrefix?: string,
  edgeReplayHighlight?: { from: string, to: string } | null,
  replayParticle?: { cx: number, cy: number, opacity: number } | null,
}

function defaultRenderActivityIcon(node: ProcessModelGraphActivityNode): ReactNode {
  if (node.activityIcon === 'check') {
    return <Check size={15} strokeWidth={2} className="process-model-activity-node-icon-svg" />
  }
  return <Plus size={15} strokeWidth={2} className="process-model-activity-node-icon-svg" />
}

function isVisited(
  nodeId: string,
  activeNodeId: string | undefined,
  visited: ReadonlySet<string> | undefined
): boolean {
  if (!visited?.size) {
    return false
  }
  if (nodeId === activeNodeId) {
    return false
  }
  return visited.has(nodeId)
}

export const ProcessModelCanvas = ({
  graph,
  className,
  showNodeBorder = true,
  activeNodeId,
  visitedNodeIds,
  renderActivityIcon = defaultRenderActivityIcon,
  edgePathIdPrefix,
  edgeReplayHighlight = null,
  replayParticle = null,
}: ProcessModelCanvasProps) => {
  const uid = useId().replace(/:/g, '')
  const { positions, canvasW, canvasH } = useMemo(() => ProcessModelLayoutUtilities.computeLayout(graph), [graph])
  const maxW = useMemo(() => ProcessModelLayoutUtilities.maxEdgeWeight(graph.edges), [graph.edges])

  const edgeElements = useMemo(() => {
    return graph.edges.map((edge) => {
      const pts = ProcessModelLayoutUtilities.getEdgePoints(positions, edge.from, edge.to, graph.edges)
      if (!pts) {
        return null
      }
      const { opacity, sw, markerTier } = ProcessModelLayoutUtilities.weightToStyle(edge.weight, maxW)
      const lp = pts.labelPt
      const pillW = edge.label.length * 6.8 + 12
      const pillH = 17
      const labelStrong = opacity > 0.7
      const isReplayEdge =
        edgeReplayHighlight != null
        && edge.from === edgeReplayHighlight.from
        && edge.to === edgeReplayHighlight.to
      const pathId = ProcessModelLayoutUtilities.getProcessModelEdgePathDomId(edgePathIdPrefix, edge.from, edge.to)
      const strokeOpacity = isReplayEdge ? 1 : opacity
      const strokeWidth = isReplayEdge ? 3 : sw
      return (
        <g key={`${edge.from}-${edge.to}`}>
          <path
            id={pathId}
            d={pts.pathD}
            fill="none"
            className="process-model-edge-path"
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            markerEnd={`url(#pm-arr-${markerTier}-${uid})`}
            data-base-opacity={String(opacity)}
            data-base-sw={String(sw)}
          />
          {edge.label ? (
            <>
              <rect
                className="process-model-edge-label-bg"
                x={lp.x - pillW / 2}
                y={lp.y - pillH / 2}
                width={pillW}
                height={pillH}
                rx={4}
              />
              <text
                className={clsx(
                  'process-model-edge-label-text',
                  labelStrong ? 'process-model-edge-label-text-strong' : 'process-model-edge-label-text-muted'
                )}
                x={lp.x}
                y={lp.y + 4.5}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
              >
                {edge.label}
              </text>
            </>
          ) : null}
        </g>
      )
    })
  }, [graph, positions, maxW, uid, edgePathIdPrefix, edgeReplayHighlight])

  const nodeElements = useMemo(() => {
    const visited = visitedNodeIds ?? new Set<string>()
    return graph.nodes.map((node: ProcessModelGraphNode) => {
      const p = positions[node.id]
      if (!p) {
        return null
      }
      const active = node.id === activeNodeId
      const wasVisited = isVisited(node.id, activeNodeId, visited)
      let inner: ReactNode
      if (node.type === 'start' || node.type === 'end') {
        inner = (
          <ProcessModelTerminalNode
            nodeId={node.id}
            variant={node.type}
            label={node.label}
            count={node.count}
            bordered={showNodeBorder}
            active={active}
            visited={wasVisited}
          />
        )
      } else {
        const activityNode = node as ProcessModelGraphActivityNode
        inner = (
          <ProcessModelActivityNode
            nodeId={activityNode.id}
            label={activityNode.label}
            count={activityNode.count}
            customIcon={renderActivityIcon(activityNode)}
            bordered={showNodeBorder}
            active={active}
            visited={wasVisited}
          />
        )
      }
      return (
        <foreignObject
          key={node.id}
          id={`fn-${node.id}`}
          x={p.x}
          y={p.y}
          width={p.w}
          height={p.h}
          className="process-model-foreign-object"
        >
          <div className="process-model-foreign-object-inner">{inner}</div>
        </foreignObject>
      )
    })
  }, [graph.nodes, positions, activeNodeId, visitedNodeIds, renderActivityIcon, showNodeBorder])

  return (
    <div
      data-name="process-model-canvas"
      className={clsx('process-model-canvas-wrap', className)}
      style={{ width: canvasW + 64, minHeight: canvasH + 64 }}
    >
      <svg
        className="process-model-svg"
        width={canvasW}
        height={canvasH}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {(['strong', 'medium', 'faint'] as const).map((tier) => {
            const op = tier === 'strong' ? 1 : tier === 'medium' ? 0.65 : 0.32
            return (
              <marker
                key={tier}
                id={`pm-arr-${tier}-${uid}`}
                markerWidth="8"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0,0.5 L0,7.5 L8,4 z"
                  className="process-model-edge-marker-fill"
                  fillOpacity={op}
                />
              </marker>
            )
          })}
          <filter id={`pm-glow-${uid}`} x="-80%" y="-80%" width="360%" height="360%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>
        <g className="process-model-edge-layer">{edgeElements}</g>
        <g className="process-model-node-layer">{nodeElements}</g>
        {replayParticle ? (
          <circle
            className="process-model-replay-particle"
            cx={replayParticle.cx}
            cy={replayParticle.cy}
            r={5}
            fill="var(--color-primary)"
            fillOpacity={replayParticle.opacity}
            filter={`url(#pm-glow-${uid})`}
          />
        ) : null}
      </svg>
    </div>
  )
}
