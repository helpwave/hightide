import { colorInputStateFromHex, colorInputStateTransition } from '../../src/components/data-input/color/ColorInput/ColorInputState'
import {
  clampUnit,
  expandHexInput,
  hueDegreesToUnit,
  hueUnitToDegrees,
  pointerRatio,
  sanitizeHexText,
  saturatedHueHex
} from '../../src/components/data-input/color/ColorInput/hexColor'

describe('hex color text', () => {
  test('drops characters that are not hex digits', () => {
    expect(sanitizeHexText('zz#g12p', false)).toBe('#12')
    expect(sanitizeHexText('#ff00gg', false)).toBe('#ff00')
  })

  test('expands one and three digits to seven characters', () => {
    expect(expandHexInput('f', false)).toBe('#ffffff')
    expect(expandHexInput('#abc', false)).toBe('#aabbcc')
    expect(expandHexInput('#ff00aa', false)).toBe('#ff00aa')
  })

  test('expands one, three, and four digits to nine characters when alpha is enforced', () => {
    expect(expandHexInput('f', true)).toBe('#ffffffff')
    expect(expandHexInput('#abc', true)).toBe('#aabbccff')
    expect(expandHexInput('#abcd', true)).toBe('#aabbccdd')
    expect(expandHexInput('#ff0000', true)).toBe('#ff0000ff')
    expect(expandHexInput('#ff000080', true)).toBe('#ff000080')
  })

  test('rejects lengths that are not shorthand or complete', () => {
    expect(expandHexInput('#ab', false)).toBeUndefined()
    expect(expandHexInput('#ab', true)).toBeUndefined()
    expect(expandHexInput('#abcde', true)).toBeUndefined()
  })
})

describe('color position', () => {
  test('clamps pointer positions to the edges', () => {
    expect(clampUnit(-0.4)).toBe(0)
    expect(clampUnit(1.4)).toBe(1)
    expect(pointerRatio(-20, 0, 100)).toBe(0)
    expect(pointerRatio(180, 0, 100)).toBe(1)
  })

  test('keeps the hue slider end from wrapping to the start', () => {
    expect(hueUnitToDegrees(1)).toBeCloseTo(359.999)
    expect(hueDegreesToUnit(hueUnitToDegrees(1))).toBeCloseTo(1)
    expect(hueDegreesToUnit(hueUnitToDegrees(1))).not.toBe(0)
  })
})

describe('color input state', () => {
  test('commits a complete hex while typing and expands shorthand on commit', () => {
    const initial = colorInputStateFromHex('#000000')
    const partial = colorInputStateTransition(initial, { type: 'textChange', text: 'ab' })
    expect(partial.value).toBe('#000000ff')
    expect(partial.text).toBe('#ab')

    const shorthand = colorInputStateTransition(partial, { type: 'commitText' })
    expect(shorthand.value).toBe('#000000ff')

    const three = colorInputStateTransition(
      { ...initial, text: '#abc' },
      { type: 'commitText' }
    )
    expect(three.value).toBe('#aabbccff')
    expect(three.text).toBe('#aabbccff')

    const complete = colorInputStateTransition(initial, { type: 'textChange', text: '#112233ff' })
    expect(complete.value).toBe('#112233ff')
  })

  test('expands shorthand onto an alpha value', () => {
    const initial = colorInputStateFromHex('#000000ff')
    const fromOne = colorInputStateTransition({ ...initial, text: '#a' }, { type: 'blur' })
    expect(fromOne.value).toBe('#aaaaaaaa')

    const fromThree = colorInputStateTransition({ ...initial, text: '#abc' }, { type: 'commitText' })
    expect(fromThree.value).toBe('#aabbccff')

    const fromFour = colorInputStateTransition({ ...initial, text: '#abcd' }, { type: 'commitText' })
    expect(fromFour.value).toBe('#aabbccdd')

    const fromSix = colorInputStateTransition({ ...initial, text: '#ff0000' }, { type: 'commitText' })
    expect(fromSix.value).toBe('#ff0000ff')
  })

  test('maps the square to white on the left, dark on the bottom, and saturated on the top right', () => {
    const initial = colorInputStateFromHex('#112233')
    const left = colorInputStateTransition(initial, { type: 'pickSaturation', saturation: 0, valueLevel: 1 })
    const bottom = colorInputStateTransition(initial, { type: 'pickSaturation', saturation: 1, valueLevel: 0 })
    const topRight = colorInputStateTransition(initial, { type: 'pickSaturation', saturation: 1, valueLevel: 1 })

    expect(left.value).toBe('#ffffffff')
    expect(bottom.value).toBe('#000000ff')
    expect(topRight.value).toBe(`${saturatedHueHex(initial.hue)}ff`)
    expect(topRight.hue).toBe(initial.hue)
  })

  test('resets alpha to fully opaque', () => {
    const initial = colorInputStateFromHex('#11223380')
    const reset = colorInputStateTransition(initial, { type: 'resetAlpha' })
    expect(reset.value).toBe('#112233ff')
    expect(reset.alphaLevel).toBe(1)
    expect(colorInputStateTransition(reset, { type: 'resetAlpha' })).toBe(reset)
  })

  test('stores the hue edge instead of jumping back to the start', () => {
    const initial = colorInputStateFromHex('#000000')
    const picked = colorInputStateTransition(initial, { type: 'pickHue', hue: 1 })
    expect(picked.hue).toBe(1)
    expect(picked.hue).not.toBe(0)

    const saturated = colorInputStateTransition(picked, {
      type: 'pickSaturation',
      saturation: 1.4,
      valueLevel: -1,
    })
    expect(saturated.saturation).toBe(1)
    expect(saturated.valueLevel).toBe(0)
    expect(saturated.hue).toBe(1)
  })
})
