import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Button } from '@/src/components/user-interaction/Button'
import { Select } from '@/src/components/user-interaction/Select/Select'
import { SelectOption } from '@/src/components/user-interaction/Select/SelectOption'
import { ProcessModelCanvas } from './ProcessModelCanvas'
import { ProcessModelLayoutUtilities } from './layoutProcessModel'
import type { ProcessModelGraphWithTraces, ProcessModelTrace } from './types'
import { Pause, Play, RotateCcw } from 'lucide-react'

export type ProcessModelTraceReplayProps = {
  graph: ProcessModelGraphWithTraces,
  className?: string,
}

type LogLine = {
  id: string,
  time: string,
  text: string,
}

const SPEED_OPTIONS = [
  { value: 1, label: '1×' },
  { value: 1.5, label: '1.5×' },
  { value: 2, label: '2×' },
  { value: 3, label: '3×' },
] as const

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve()
      return
    }
    const id = setTimeout(() => {
      resolve()
    }, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(id)
      resolve()
    }, { once: true })
  })
}

function runParticleAlongPath(
  path: SVGPathElement,
  durationMs: number,
  signal: AbortSignal,
  onFrame: (cx: number, cy: number, opacity: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve()
      return
    }
    const len = path.getTotalLength()
    if (!Number.isFinite(len) || len <= 0) {
      onFrame(0, 0, 0)
      resolve()
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      if (signal.aborted) {
        onFrame(0, 0, 0)
        resolve()
        return
      }
      const u = Math.min(1, (now - start) / durationMs)
      const pt = path.getPointAtLength(u * len)
      const opacity = u < 0.06 ? u / 0.06 : u > 0.88 ? (1 - u) / 0.12 : 1
      onFrame(pt.x, pt.y, opacity)
      if (u < 1) {
        requestAnimationFrame(tick)
      } else {
        onFrame(0, 0, 0)
        resolve()
      }
    }
    requestAnimationFrame(tick)
  })
}

export const ProcessModelTraceReplay = ({ graph, className }: ProcessModelTraceReplayProps) => {
  const translation = useHightideTranslation()
  const pathPrefix = useId().replace(/:/g, '')
  const hostRef = useRef<HTMLDivElement>(null)
  const traceIndexRef = useRef(0)
  const playbackRef = useRef<AbortController | null>(null)
  const playbackLoopLockRef = useRef(false)

  const [speedMult, setSpeedMult] = useState(2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeNodeId, setActiveNodeId] = useState<string | undefined>()
  const [visitedNodeIds, setVisitedNodeIds] = useState<ReadonlySet<string>>(new Set())
  const [edgeReplayHighlight, setEdgeReplayHighlight] = useState<{ from: string, to: string } | null>(null)
  const [replayParticle, setReplayParticle] = useState<{ cx: number, cy: number, opacity: number } | null>(null)
  const [logLines, setLogLines] = useState<LogLine[]>([])
  const [logPlaceholder, setLogPlaceholder] = useState(true)

  const getPath = useCallback(
    (from: string, to: string): SVGPathElement | null => {
      const root = hostRef.current
      if (!root) {
        return null
      }
      const svg = root.querySelector('svg.process-model-svg')
      if (!svg) {
        return null
      }
      const id = ProcessModelLayoutUtilities.getProcessModelEdgePathDomId(pathPrefix, from, to)
      return svg.querySelector(`#${CSS.escape(id)}`)
    },
    [pathPrefix]
  )

  const addLog = useCallback((text: string) => {
    setLogPlaceholder(false)
    const time = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLogLines((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, time, text },
    ])
  }, [])

  const getLabel = useCallback(
    (id: string) => {
      const n = graph.nodes.find((x) => x.id === id)
      return n ? `${n.label} (${n.count})` : id
    },
    [graph.nodes]
  )

  const stopPlayback = useCallback(() => {
    playbackRef.current?.abort()
    playbackRef.current = null
    setIsPlaying(false)
    setReplayParticle(null)
  }, [])

  const resetReplay = useCallback(() => {
    stopPlayback()
    traceIndexRef.current = 0
    setActiveNodeId(undefined)
    setVisitedNodeIds(new Set())
    setEdgeReplayHighlight(null)
    setLogLines([])
    setLogPlaceholder(true)
  }, [stopPlayback])

  const awaitDoubleRaf = useCallback(() => {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve())
      })
    })
  }, [])

  const runTraceOnce = useCallback(
    async (trace: ProcessModelTrace, signal: AbortSignal) => {
      await awaitDoubleRaf()
      if (signal.aborted) {
        return
      }
      const BASE = 650 / speedMult
      const ns = trace.nodes
      addLog(`▶ ${trace.name}`)
      setVisitedNodeIds(new Set())
      setEdgeReplayHighlight(null)
      setActiveNodeId(ns[0])
      addLog(`↳ ${getLabel(ns[0])}`)

      for (let i = 0; i < ns.length - 1; i++) {
        if (signal.aborted) {
          return
        }
        const from = ns[i]
        const to = ns[i + 1]
        const dur = (BASE + Math.random() * 180) / speedMult
        const pathEl = getPath(from, to)
        const particleMs = dur / speedMult
        if (pathEl) {
          await runParticleAlongPath(pathEl, particleMs, signal, (cx, cy, opacity) => {
            if (opacity <= 0) {
              setReplayParticle(null)
            } else {
              setReplayParticle({ cx, cy, opacity })
            }
          })
        } else {
          setReplayParticle(null)
          await sleep(particleMs, signal)
        }
        if (signal.aborted) {
          return
        }
        setVisitedNodeIds((prev) => new Set([...prev, from]))
        setActiveNodeId(to)
        setEdgeReplayHighlight({ from, to })
        addLog(`↳ ${getLabel(to)}`)
        if (i === ns.length - 2) {
          await sleep(500 / speedMult, signal)
          if (signal.aborted) {
            return
          }
          setActiveNodeId(undefined)
          setEdgeReplayHighlight(null)
        }
      }
    },
    [addLog, awaitDoubleRaf, getLabel, getPath, speedMult]
  )

  const startPlayback = useCallback(async () => {
    if (!graph.traces.length || playbackLoopLockRef.current) {
      return
    }
    playbackLoopLockRef.current = true
    stopPlayback()
    const ac = new AbortController()
    playbackRef.current = ac
    setIsPlaying(true)
    setLogPlaceholder(false)
    try {
      while (!ac.signal.aborted) {
        const idx = traceIndexRef.current % graph.traces.length
        const trace = graph.traces[idx]
        traceIndexRef.current += 1
        await runTraceOnce(trace, ac.signal)
        if (ac.signal.aborted) {
          break
        }
        const gap = (600 + Math.random() * 300) / speedMult
        await sleep(gap, ac.signal)
      }
    } finally {
      if (playbackRef.current === ac) {
        playbackRef.current = null
      }
      playbackLoopLockRef.current = false
      setIsPlaying(false)
      setReplayParticle(null)
    }
  }, [graph.traces, runTraceOnce, speedMult, stopPlayback])

  useEffect(() => {
    resetReplay()
  }, [graph, resetReplay])

  useEffect(() => () => {
    playbackRef.current?.abort()
  }, [])

  return (
    <div data-name="process-model-trace-replay" className={clsx('process-model-trace-replay', className)}>
      <div className="process-model-trace-replay-toolbar">
        <Button
          color="primary"
          coloringStyle={isPlaying ? 'outline' : 'solid'}
          className="min-w-48"
          onClick={() => {
            if (isPlaying) {
              stopPlayback()
            } else {
              void startPlayback()
            }
          }}
        >
          {isPlaying ? <Pause /> : <Play />}
          {isPlaying ? translation('pauseTrace') : translation('playTrace')}
        </Button>
        <Button
          color="primary"
          coloringStyle="outline"
          onClick={resetReplay}
        >
          <RotateCcw />
          {translation('reset')}
        </Button>
        <div className="process-model-trace-replay-speed">
          <span className="process-model-trace-replay-speed-label">{translation('speed')}</span>
          <Select
            value={speedMult}
            onValueChange={setSpeedMult}
            showSearch={false}
          >
            {SPEED_OPTIONS.map((option) => (
              <SelectOption key={option.value} value={option.value} label={option.label} />
            ))}
          </Select>
        </div>
      </div>
      <div ref={hostRef}>
        <ProcessModelCanvas
          graph={graph}
          edgePathIdPrefix={pathPrefix}
          activeNodeId={activeNodeId}
          visitedNodeIds={visitedNodeIds}
          edgeReplayHighlight={edgeReplayHighlight}
          replayParticle={replayParticle}
        />
      </div>
      <div className="process-model-trace-log">
        <div className="process-model-trace-log-header">Trace log</div>
        <div className="process-model-trace-log-body">
          {logPlaceholder ? (
            <div className="process-model-trace-log-placeholder">
              Press Play to start trace replay…
            </div>
          ) : (
            logLines.map((line) => (
              <div key={line.id} className="process-model-trace-log-event">
                <span className="process-model-trace-log-dot" aria-hidden />
                <span className="process-model-trace-log-time">{line.time}</span>
                <span>{line.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
