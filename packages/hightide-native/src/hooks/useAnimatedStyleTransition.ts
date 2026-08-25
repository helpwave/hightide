import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  Animated,
  StyleSheet,
  type ViewStyle
} from 'react-native'

import { HexColorUtils } from '../utils/hex'

const TRANSFORM_KEYS = [
  'translateX',
  'translateY',
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skewX',
  'skewY',
  'perspective',
] as const

type TransformKey = typeof TRANSFORM_KEYS[number]
type StyleRecord = Record<string, unknown>
type TransformEntry = Record<string, unknown>
type AnimatedViewStyle = Animated.WithAnimatedObject<ViewStyle>
type AnimatedAttribute = keyof ViewStyle

const POSITION_STYLE_KEYS = [
  'position',
  'left',
  'right',
  'top',
  'bottom',
] as const satisfies readonly AnimatedAttribute[]

const toRecord = (style: ViewStyle): StyleRecord => style as StyleRecord

const resolveAnimatedAttributes = (
  animatedAttributes: AnimatedAttribute[]
): AnimatedAttribute[] => {
  const resolved: AnimatedAttribute[] = []

  for (const key of animatedAttributes) {
    if (key === 'position') {
      resolved.push(...POSITION_STYLE_KEYS)
      continue
    }

    resolved.push(key)
  }

  return [...new Set(resolved)]
}

const parseUnitValue = (value: unknown, unit: string): number | undefined => {
  if (typeof value !== 'string' || !value.endsWith(unit)) {
    return undefined
  }

  const parsed = Number.parseFloat(value.slice(0, -unit.length))
  return Number.isFinite(parsed) ? parsed : undefined
}

const parseHexChannels = (hex: string): [number, number, number, number] => {
  const normalized = hex.startsWith('#') ? hex.slice(1) : hex
  const rgb = normalized.slice(0, 6)
  const alphaHex = normalized.length >= 8 ? normalized.slice(6, 8) : 'ff'

  return [
    Number.parseInt(rgb.slice(0, 2), 16),
    Number.parseInt(rgb.slice(2, 4), 16),
    Number.parseInt(rgb.slice(4, 6), 16),
    Number.parseInt(alphaHex, 16) / 255,
  ]
}

const toHexColor = (r: number, g: number, b: number, alpha: number): string => {
  const channel = (value: number) => Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0')
  const rgb = `#${channel(r)}${channel(g)}${channel(b)}`

  if (alpha >= 1) {
    return rgb
  }

  return `${rgb}${channel(alpha * 255)}`
}

const mixNumber = (from: number, to: number, progress: number): number => (
  from + (to - from) * progress
)

const mixColor = (from: string, to: string, progress: number): string | undefined => {
  const fromHex = HexColorUtils.tryParseColorValue(from)
  const toHex = HexColorUtils.tryParseColorValue(to)

  if (fromHex === undefined || toHex === undefined) {
    return undefined
  }

  const [fr, fg, fb, fa] = parseHexChannels(fromHex)
  const [tr, tg, tb, ta] = parseHexChannels(toHex)

  return toHexColor(
    mixNumber(fr, tr, progress),
    mixNumber(fg, tg, progress),
    mixNumber(fb, tb, progress),
    mixNumber(fa, ta, progress)
  )
}

const mixScalar = (from: unknown, to: unknown, progress: number): unknown => {
  if (from === to) {
    return to
  }

  if (typeof from === 'number' && typeof to === 'number') {
    return mixNumber(from, to, progress)
  }

  const fromPercent = parseUnitValue(from, '%')
  const toPercent = parseUnitValue(to, '%')
  if (fromPercent !== undefined && toPercent !== undefined) {
    return `${mixNumber(fromPercent, toPercent, progress)}%`
  }

  const fromDeg = parseUnitValue(from, 'deg')
  const toDeg = parseUnitValue(to, 'deg')
  if (fromDeg !== undefined && toDeg !== undefined) {
    return `${mixNumber(fromDeg, toDeg, progress)}deg`
  }

  if (typeof from === 'string' && typeof to === 'string') {
    const mixedColor = mixColor(from, to, progress)
    if (mixedColor !== undefined) {
      return mixedColor
    }
  }

  return progress < 1 ? from : to
}

const flattenTransform = (transform: ViewStyle['transform']): TransformEntry => {
  if (!Array.isArray(transform)) {
    return {}
  }

  const flattened: TransformEntry = {}

  for (const entry of transform) {
    if (entry !== undefined && typeof entry === 'object') {
      Object.assign(flattened, entry)
    }
  }

  return flattened
}

const transformKeys = (from: TransformEntry, to: TransformEntry): TransformKey[] => {
  const keys = TRANSFORM_KEYS.filter((key) => from[key] !== undefined || to[key] !== undefined)

  for (const key of Object.keys({ ...from, ...to })) {
    if (!TRANSFORM_KEYS.includes(key as TransformKey)) {
      keys.push(key as TransformKey)
    }
  }

  return keys
}

const mixTransforms = (
  from: ViewStyle['transform'],
  to: ViewStyle['transform'],
  progress: number
): ViewStyle['transform'] => {
  const fromFlat = flattenTransform(from)
  const toFlat = flattenTransform(to)
  const mixed: TransformEntry[] = []

  for (const key of transformKeys(fromFlat, toFlat)) {
    const fromValue = fromFlat[key]
    const toValue = toFlat[key]

    if (toValue === undefined) {
      continue
    }

    mixed.push({
      [key]: fromValue === undefined ? toValue : mixScalar(fromValue, toValue, progress),
    })
  }

  return mixed.length === 0 ? undefined : mixed as unknown as ViewStyle['transform']
}

const mixStyles = (
  from: ViewStyle,
  to: ViewStyle,
  progress: number,
  animatedAttributes: (keyof ViewStyle)[]
): ViewStyle => {
  const fromRecord = toRecord(from)
  const toRecordStyle = toRecord(to)
  const attributes = resolveAnimatedAttributes(animatedAttributes)
  const mixed: StyleRecord = { ...toRecordStyle }

  for (const key of attributes) {
    if (key === 'transform') {
      mixed.transform = mixTransforms(from.transform, to.transform, progress)
      continue
    }

    const fromValue = fromRecord[key]
    const toValue = toRecordStyle[key]

    if (fromValue === undefined || fromValue === toValue) {
      continue
    }

    mixed[key] = mixScalar(fromValue, toValue, progress)
  }

  return mixed as ViewStyle
}

const interpolateScalar = (
  from: unknown,
  to: unknown,
  progress: Animated.Value
): unknown => {
  if (from === to) {
    return to
  }

  if (typeof from === 'number' && typeof to === 'number') {
    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: [from, to],
    })
  }

  const fromPercent = parseUnitValue(from, '%')
  const toPercent = parseUnitValue(to, '%')
  if (fromPercent !== undefined && toPercent !== undefined) {
    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: [`${fromPercent}%`, `${toPercent}%`],
    })
  }

  const fromDeg = parseUnitValue(from, 'deg')
  const toDeg = parseUnitValue(to, 'deg')
  if (fromDeg !== undefined && toDeg !== undefined) {
    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: [`${fromDeg}deg`, `${toDeg}deg`],
    })
  }

  if (typeof from === 'string' && typeof to === 'string') {
    const fromColor = HexColorUtils.tryParseColorValue(from)
    const toColor = HexColorUtils.tryParseColorValue(to)

    if (fromColor !== undefined && toColor !== undefined) {
      return progress.interpolate({
        inputRange: [0, 1],
        outputRange: [fromColor, toColor],
      })
    }
  }

  return to
}

const interpolateTransforms = (
  from: ViewStyle['transform'],
  to: ViewStyle['transform'],
  progress: Animated.Value
): ViewStyle['transform'] | Animated.WithAnimatedValue<ViewStyle['transform']> => {
  const fromFlat = flattenTransform(from)
  const toFlat = flattenTransform(to)
  const interpolated: TransformEntry[] = []

  for (const key of transformKeys(fromFlat, toFlat)) {
    const fromValue = fromFlat[key]
    const toValue = toFlat[key]

    if (toValue === undefined) {
      continue
    }

    interpolated.push({
      [key]: fromValue === undefined ? toValue : interpolateScalar(fromValue, toValue, progress),
    })
  }

  return interpolated.length === 0 ? undefined : interpolated as unknown as ViewStyle['transform']
}

const createInterpolatedStyle = (
  from: ViewStyle,
  to: ViewStyle,
  progress: Animated.Value,
  animatedAttributes: (keyof ViewStyle)[]
): AnimatedViewStyle => {
  const fromRecord = toRecord(from)
  const toRecordStyle = toRecord(to)
  const attributes = resolveAnimatedAttributes(animatedAttributes)
  const interpolated: StyleRecord = { ...toRecordStyle }

  for (const key of attributes) {
    if (key === 'transform') {
      interpolated.transform = interpolateTransforms(from.transform, to.transform, progress)
      continue
    }

    const fromValue = fromRecord[key]
    const toValue = toRecordStyle[key]

    if (fromValue === undefined || fromValue === toValue) {
      continue
    }

    interpolated[key] = interpolateScalar(fromValue, toValue, progress)
  }

  return interpolated as AnimatedViewStyle
}

const pickAnimatedAttributes = (
  style: ViewStyle,
  animatedAttributes: (keyof ViewStyle)[]
): StyleRecord => {
  const flattened = StyleSheet.flatten(style) ?? {}
  const record = toRecord(flattened)
  const picked: StyleRecord = {}
  const attributes = resolveAnimatedAttributes(animatedAttributes)

  for (const key of attributes) {
    picked[key] = record[key]
  }

  return picked
}

const areAnimatedAttributesEqual = (
  left: ViewStyle,
  right: ViewStyle,
  animatedAttributes: (keyof ViewStyle)[]
): boolean => (
  JSON.stringify(pickAnimatedAttributes(left, animatedAttributes))
  === JSON.stringify(pickAnimatedAttributes(right, animatedAttributes))
)

const areStylesEqual = (left: ViewStyle, right: ViewStyle): boolean => {
  const normalize = (style: ViewStyle): string => {
    const flattened = StyleSheet.flatten(style) ?? {}
    const record = toRecord(flattened)
    const normalized: StyleRecord = {}

    for (const key of Object.keys(record).sort()) {
      normalized[key] = record[key]
    }

    return JSON.stringify(normalized)
  }

  return normalize(left) === normalize(right)
}

export type AnimatedStyleTransitionProps = {
  style: ViewStyle,
  duration: number,
  animatedAttributes: (keyof ViewStyle)[],
}

// TODO fix transitions
export const useAnimatedStyleTransition = ({
  style,
  duration,
  animatedAttributes,
}: AnimatedStyleTransitionProps): AnimatedViewStyle => {
  const progress = useRef(new Animated.Value(1)).current
  const fromRef = useRef(style)
  const toRef = useRef(style)
  const isFirstRender = useRef(true)
  const animationRef = useRef<Animated.CompositeAnimation | null>(null)
  const [transition, setTransition] = useState({
    from: style,
    to: style,
  })

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      fromRef.current = style
      toRef.current = style
      return
    }

    if (areAnimatedAttributesEqual(toRef.current, style, animatedAttributes)) {
      if (areStylesEqual(toRef.current, style)) {
        return
      }

      toRef.current = style
      setTransition((current) => ({
        from: current.from,
        to: style,
      }))
      return
    }

    progress.stopAnimation((currentProgress) => {
      const captured = mixStyles(
        fromRef.current,
        toRef.current,
        currentProgress,
        animatedAttributes
      )
      fromRef.current = captured
      toRef.current = style
      setTransition({
        from: captured,
        to: style,
      })
      animationRef.current?.stop()
      progress.setValue(0)
      animationRef.current = Animated.timing(progress, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      })
      animationRef.current.start()
    })
  }, [animatedAttributes, duration, progress, style])

  useLayoutEffect(() => () => {
    animationRef.current?.stop()
  }, [])

  return useMemo(
    () => createInterpolatedStyle(
      transition.from,
      transition.to,
      progress,
      animatedAttributes
    ),
    [animatedAttributes, progress, transition]
  )
}
