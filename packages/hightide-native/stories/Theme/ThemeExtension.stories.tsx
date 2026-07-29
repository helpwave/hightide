import { Text } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import {
  hightidePrimitiveTokens,
  type ColorToken,
  type HightideColorPalettes
} from '@helpwave/hightide-design/primitive'
import { toHightideSemanticTokens } from '@helpwave/hightide-design/semantic'
import { toHightideComponentTokens } from '@helpwave/hightide-design/components'
import {
  constructThemeTokens,
  type DesignSystemTokens
} from '@helpwave/hightide-design/design-system'
import {
  createColoringTokens,
  toLightThemeTokens,
  type ThemeTokens
} from '@helpwave/hightide-design/theme'

import { Button } from '../../src/components/user-interaction/Button'
import { Chip } from '../../src/components/visualization-and-display/Chip'
import { HightideConfigUtils } from '../../src/global-contexts/hightide-config/HightideConfigUtils'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'
import { ThemeProvider } from '../../src/global-contexts/theme/ThemeProvider'
import { createHightideTheme } from '../../src/theme/themes/createHightideTheme'
import {
  ThemeSelect,
  ThemeStoryFrame
} from './themeStoryHelpers'

const toOceanThemeTokens = ({
  primitiveTokens,
}: {
  primitiveTokens: typeof hightidePrimitiveTokens,
}): ThemeTokens => {
  const themeTokens = toLightThemeTokens({ primitiveTokens })
  const { blue, white } = primitiveTokens.color.palettes as HightideColorPalettes
  const color = {
    ...themeTokens.color,
    background: blue.value[100] as ColorToken,
    onBackground: blue.value[900] as ColorToken,
    surface: blue.value[50] as ColorToken,
    onSurface: blue.value[900] as ColorToken,
    surfaceHover: blue.value[100] as ColorToken,
    surfaceVariant: blue.value[200] as ColorToken,
    onSurfaceVariant: blue.value[900] as ColorToken,
    primary: blue.value[500] as ColorToken,
    onPrimary: white.value as ColorToken,
    primaryHover: blue.value[600] as ColorToken,
  }

  return {
    ...themeTokens,
    color,
    coloring: createColoringTokens(color),
  }
}

const oceanDesignTokens = constructThemeTokens({
  primitiveTokens: hightidePrimitiveTokens,
  toThemeTokens: toOceanThemeTokens,
  toSemantic: toHightideSemanticTokens,
  toComponents: toHightideComponentTokens,
}) satisfies DesignSystemTokens

const oceanTheme = createHightideTheme(oceanDesignTokens)

const oceanSupportedThemes = {
  ...HightideConfigUtils.defaultSupportedThemes,
  ocean: {
    nameTranslations: {
      'de-DE': 'Ozean',
      'en-US': 'Ocean',
    },
    theme: oceanTheme,
  },
}

const OceanPreview = () => {
  const { theme } = useTheme()

  return (
    <ThemeStoryFrame>
      <ThemeSelect />
      <Text style={{ color: theme.semantic.onBackground }}>
        Ocean theme uses blue background, surface, and primary tokens
      </Text>
      <Button color="primary" onPress={() => undefined}>
        Primary button
      </Button>
      <Chip color="primary">Primary chip</Chip>
    </ThemeStoryFrame>
  )
}

const ThemeExtensionDemo = () => (
  <ThemeProvider
    fallbackTheme="ocean"
    supportedThemes={oceanSupportedThemes}
  >
    <OceanPreview />
  </ThemeProvider>
)

const meta = {
  component: ThemeExtensionDemo,
} satisfies Meta<typeof ThemeExtensionDemo>

export default meta
type Story = StoryObj<typeof meta>

export const themeExtension: Story = {
  render: () => <ThemeExtensionDemo />,
}
