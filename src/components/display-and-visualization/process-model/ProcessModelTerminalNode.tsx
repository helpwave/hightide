import type { ReactNode } from 'react'
import { ProcessModelActivityNode } from './ProcessModelActivityNode'
import { ProcessModelLayoutUtilities } from './layoutProcessModel'
import type { ProcessModelTerminalKind } from './types'

export type ProcessModelTerminalNodeProps = {
  nodeId: string,
  variant: ProcessModelTerminalKind,
  label: string,
  count: string,
  bordered?: boolean,
  active?: boolean,
  visited?: boolean,
  className?: string,
}

function TerminalHexIcon({ variant }: { variant: ProcessModelTerminalKind }): ReactNode {
  const isStart = variant === 'start'
  return (
    <svg
      className="process-model-terminal-node-hex shrink-0"
      width="34"
      height="34"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden
    >
      <polygon
        className="process-model-terminal-node-hex-fill"
        points="22,2 40,12 40,32 22,42 4,32 4,12"
      />
      <polygon
        points="22,5 38,14 38,30 22,39 6,30 6,14"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      {isStart ? (
        <polygon points="18,15 30,22 18,29" fill="white" />
      ) : (
        <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
      )}
    </svg>
  )
}

export const ProcessModelTerminalNode = ({
  nodeId,
  variant,
  label,
  count,
  bordered = true,
  active = false,
  visited = false,
  className,
}: ProcessModelTerminalNodeProps) => {
  return (
    <ProcessModelActivityNode
      nodeId={nodeId}
      kind="terminal"
      label={label}
      count={ProcessModelLayoutUtilities.terminalCountDisplayLine(count)}
      customIcon={<TerminalHexIcon variant={variant} />}
      bordered={bordered}
      active={active}
      visited={visited}
      className={className}
    />
  )
}
