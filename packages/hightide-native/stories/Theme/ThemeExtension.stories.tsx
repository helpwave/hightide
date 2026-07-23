import { Text } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { constructThemeTokens } from '@helpwave/hightide-design/utils'
import {
  colorPalettes,
  toHightideComponentTokens,
  toHightideSemanticTokens,
  toHightideTheme
} from '@helpwave/hightide-design/tokens'
import type { HightideThemeTokens } from '@helpwave/hightide-design/types'

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

const toOceanSemantic: typeof toHightideSemanticTokens = (args) => {
  const { blue } = args.primitiveTokens

  return {
    ...toHightideSemanticTokens(args),
    background: blue.value[100],
    onBackground: blue.value[900],
    surface: blue.value[50],
    onSurface: blue.value[900],
    surfaceHover: blue.value[100],
    surfaceVariant: blue.value[200],
    onSurfaceVariant: blue.value[900],
    primary: blue.value[500],
    onPrimary: args.primitiveTokens.white.value,
    primaryHover: blue.value[600],
  }
}

const oceanDesignTokens = constructThemeTokens({
  themeName: 'ocean',
  primitiveTokens: colorPalettes,
  toSemantic: toOceanSemantic,
  toComponents: toHightideComponentTokens,
  toTheme: toHightideTheme,
}) satisfies HightideThemeTokens

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
