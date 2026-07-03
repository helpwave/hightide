export type Curve = (value: number) => number

export type ExponentialCurveBuilderPropsResolved = {
  basis: number,
  muliplier: number,
}

export type ExponentialCurveBuilderProps = Partial<ExponentialCurveBuilderPropsResolved>

export type ExponentialRateCurveBuilder = (props: ExponentialCurveBuilderProps) => Curve

const ExponentialRateCurveBuilder: ExponentialRateCurveBuilder = ({
  basis = 2,
  muliplier = 1
}: ExponentialCurveBuilderProps) => {
  if(Number.isNaN(muliplier) || !Number.isFinite(muliplier) || muliplier <= 0) {
    throw new Error(`Invalid muliplier: ${muliplier}`)
  }

  return (value) => {
    if(Number.isNaN(value) || !Number.isFinite(value)) {
      return 0
    }
    return muliplier * (basis ** value)
  }
}

export const CurveBuilderUtil = {
  ExponentialRateCurveBuilder,
}