import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Circle } from 'lucide-react'
import clsx from 'clsx'

const coloringStyles = ['solid', 'text', 'outline', 'tonal', 'tonal-outline'] as const

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

const ColoringStyleElement = ({
  colorKey,
  coloringStyle,
  label,
  isHover,
}: {
  colorKey: ColorKey,
  coloringStyle: ColoringStyle,
  label: string,
  isHover: boolean,
}) => (
  <div
    data-color={colorKey}
    data-coloringstyle={coloringStyle}
    className={clsx(
      'rounded-lg px-3 py-1.5 typography-label-md w-full text-center coloring-color-detect',
      {
        'coloring-style-hover-detect': isHover,
        'coloring-style-detect': !isHover,
      }
    )}
    style={{ transition: 'var(--coloring-transitions)' }}
  >
    {label}
  </div>
)

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
                      isHover={false}
                    />
                    <ColoringStyleElement
                      colorKey={colorKey}
                      coloringStyle={style}
                      label={name + '-hover'}
                      isHover={true}
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
