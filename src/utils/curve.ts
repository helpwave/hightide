import { MathUtil } from './math'

export type Curve = (value: number) => number

export type ExponentialCurveBuilderPropsResolved = {
  basis: number,
  multiplier: number,
}

export type ExponentialCurveBuilderProps = Partial<ExponentialCurveBuilderPropsResolved>

export type ExponentialRateCurveBuilder = (props: ExponentialCurveBuilderProps) => Curve

export type CubicBezierCurveBuilder = (x1: number, y1: number, x2: number, y2: number) => Curve

const ExponentialRateCurveBuilder: ExponentialRateCurveBuilder = ({
  basis = 2,
  multiplier = 1
}: ExponentialCurveBuilderProps) => {
  if(Number.isNaN(multiplier) || !Number.isFinite(multiplier) || multiplier <= 0) {
    throw new Error(`Invalid muliplier: ${multiplier}`)
  }

  return (value) => {
    if(Number.isNaN(value)) {
      return 0
    }
    return multiplier * (basis ** value)
  }
}

const cubicBezierGeneric = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { x: Curve, y: Curve } => {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx

  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by

  const x = (t: number) => ((ax * t + bx) * t + cx) * t
  const y = (t: number) => ((ay * t + by) * t + cy) * t

  return { x, y }
}

const CubicBezierCurveBuilder: CubicBezierCurveBuilder = (x1, y1, x2, y2) => {
  const { y } = cubicBezierGeneric(x1, y1, x2, y2)
  return (t) => y(MathUtil.clamp(t, 0, 1))
}

const easeInEaseOut: Curve = CubicBezierCurveBuilder(0.65, 0, 0.35, 1)

export const CurveBuilderUtil = {
  ExponentialRateCurveBuilder,
  CubicBezierCurveBuilder,
  cubicBezierGeneric,
  easeInEaseOut,
}