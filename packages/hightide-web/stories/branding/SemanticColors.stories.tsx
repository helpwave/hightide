import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Circle } from 'lucide-react'
import { ColoringUtils, type ColoringMode } from '../../src/utils/coloring'

const coloringStyles = ['filled', 'foreground', 'outlined', 'tonal', 'tonal-outlined'] as const

type ColoringStyle = typeof coloringStyles[number]

type ColorKey = 'primary' | 'secondary' | 'positive' | 'warning' | 'negative' | 'neutral' | 'disabled' | 'description' | 'surface' | 'surface-variant' | 'surface-warning'

type SemanticColor = {
  name: string,
  colorKey?: ColorKey,
}

const semanticColors: SemanticColor[] = [
  { name: 'background' },
  { name: 'warning', colorKey: 'warning' },
  { name: 'positive', colorKey: 'positive' },
  { name: 'negative', colorKey: 'negative' },
  { name: 'disabled', colorKey: 'disabled' },
  { name: 'surface', colorKey: 'surface' },
  { name: 'surface-variant', colorKey: 'surface-variant' },
  { name: 'surface-warning', colorKey: 'surface-warning' },
  { name: 'text-primary' },
  { name: 'text-secondary' },
  { name: 'text-tertiary' },
  { name: 'placeholder' },
  { name: 'description' },
  { name: 'label' },
  { name: 'primary', colorKey: 'primary' },
  { name: 'secondary', colorKey: 'secondary' },
  { name: 'neutral', colorKey: 'neutral' },
  { name: 'faded' },
  { name: 'highlight' },
]

const colorStyle = (name: string): CSSProperties => ({
  color: `var(--color-${name})`,
})

const coloringAttributes = (color: ColorKey, coloringStyle: ColoringStyle, mode: ColoringMode) => {
  switch (coloringStyle) {
  case 'filled':
    return ColoringUtils.build({ color, mode })
  case 'foreground':
    return ColoringUtils.build({ color, mode, coloringStyle: 'foreground' })
  case 'outlined':
    return ColoringUtils.build({ color, mode, coloringStyle: 'foreground', bordered: true })
  case 'tonal':
    return ColoringUtils.build({ color, mode, colorVariant: 'tonal' })
  case 'tonal-outlined':
    return ColoringUtils.build({ color, mode, colorVariant: 'tonal', bordered: true })
  }
}

const ColoringStyleElement = ({
  colorKey,
  coloringStyle,
  label,
  mode,
}: {
  colorKey: ColorKey,
  coloringStyle: ColoringStyle,
  label: string,
  mode: ColoringMode,
}) => {
  return (
    <div
      {...coloringAttributes(colorKey, coloringStyle, mode)}
      className="rounded-lg px-3 py-1.5 typography-label-md w-full text-center"
    >
      {label}
    </div>
  )
}

const SemanticColorsTable = () => {
  return (
    <table className="w-full border-collapse typography-body-md">
      <thead>
        <tr className="border-b border-faded text-left">
          <th className="p-3 typography-label-md text-label">name</th>
          <th className="p-3 typography-label-md text-label">icon</th>
          <th className="p-3 typography-label-md text-label">text</th>
          {coloringStyles.map((style) => (
            <th key={style} className="p-3 typography-label-md text-label">{style}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {semanticColors.map(({ name, colorKey }) => (
          <tr key={name} className="border-b border-faded">
            <td className="p-3 text-text-primary">{name}</td>
            <td className="p-3">
              <Circle className="size-5" style={colorStyle(name)} />
            </td>
            <td className="p-3">
              <span style={colorStyle(name)}>{name}</span>
            </td>
            {colorKey ? (
              coloringStyles.map((style) => (
                <td key={style} className="p-3">
                  <div className="flex-col-2">
                    <ColoringStyleElement
                      colorKey={colorKey}
                      coloringStyle={style}
                      label={name}
                      mode="static"
                    />
                    <ColoringStyleElement
                      colorKey={colorKey}
                      coloringStyle={style}
                      label={name}
                      mode="interactive"
                    />
                  </div>
                </td>
              ))
            ) : (
              <td colSpan={coloringStyles.length} className="p-3 typography-label-md text-description">
                Only Icon/Text
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const meta = {
  component: SemanticColorsTable,
} satisfies Meta<typeof SemanticColorsTable>

export default meta
type Story = StoryObj<typeof meta>

export const all: Story = {
  args: {},
}
