import type { MouseEventHandler, PointerEventHandler, ReactNode } from 'react'
import clsx from 'clsx'
import { PropsUtil } from '@/src/utils/propsUtil'

export type ProcessModelActivityNodeKind = 'activity' | 'terminal'

export type ProcessModelActivityNodeProps = {
  nodeId: string,
  label: string,
  count: string,
  customIcon: ReactNode,
  kind?: ProcessModelActivityNodeKind,
  bordered?: boolean,
  active?: boolean,
  visited?: boolean,
  className?: string,
  onClick?: MouseEventHandler<HTMLDivElement>,
  onPointerEnter?: PointerEventHandler<HTMLDivElement>,
  onPointerLeave?: PointerEventHandler<HTMLDivElement>,
}

export const ProcessModelActivityNode = ({
  nodeId,
  label,
  count,
  customIcon,
  kind = 'activity',
  bordered = true,
  active = false,
  visited = false,
  className,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: ProcessModelActivityNodeProps) => {
  const interactive = !!onClick
  const rootName = kind === 'terminal' ? 'process-model-terminal-node' : 'process-model-activity-node'
  return (
    <div
      data-name={rootName}
      id={`nd-${nodeId}`}
      className={clsx('process-model-activity-node', className)}
      data-kind={kind}
      data-bordered={PropsUtil.dataAttributes.bool(bordered)}
      data-active={PropsUtil.dataAttributes.bool(active)}
      data-visited={PropsUtil.dataAttributes.bool(visited)}
      data-interactive={PropsUtil.dataAttributes.bool(interactive)}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? label : undefined}
      onClick={(event) => {
        onClick?.(event)
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
      }}
      onKeyDown={(event) => {
        if (!interactive) {
          return
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          event.currentTarget.click()
        }
      }}
    >
      <div className="process-model-activity-node-icon">{customIcon}</div>
      <div className="process-model-activity-node-text">
        <div className="process-model-activity-node-label">{label}</div>
        <div className="process-model-activity-node-count">{count}</div>
      </div>
    </div>
  )
}
