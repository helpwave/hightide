import { Text } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import {
  hightidePrimitiveTokens,
  type ColorToken,
  type HightideColorPalettes
} from '@helpwave/hightide-design/primitive-tokens'
import { toHightideSemanticTokens } from '@helpwave/hightide-design/semantic-tokens'
import { toHightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import { type HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'
import {
  hightideLightThemeTokens,
  type HightideThemeTokens
} from '@helpwave/hightide-design/theme-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'

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

const oceanThemeTokens = ((): HightideThemeTokens => {
  const { blue, white } = hightidePrimitiveTokens.color.palettes as HightideColorPalettes
  return {
    ...hightideLightThemeTokens,
    color: {
      ...hightideLightThemeTokens.color,
      background: blue.value[100] as ColorToken,
      onBackground: blue.value[900] as ColorToken,
      surface: blue.value[50] as ColorToken,
      onSurface: blue.value[900] as ColorToken,
      surfaceHover: blue.value[100] as ColorToken,
      surfaceVariant: blue.value[200] as ColorToken,
      primary: {
        color: blue.value[500] as ColorToken,
        onColor: white.value as ColorToken,
        emphasis: blue.value[600] as ColorToken,
        tint: HexColorUtils.hexWithAlpha(blue.value[500] as ColorToken, 0.2),
        tintEmphasis: HexColorUtils.hexWithAlpha(blue.value[500] as ColorToken, 0.28),
      },
    },
  }
})()

const oceanSemanticTokens = toHightideSemanticTokens({ themeTokens: oceanThemeTokens })

const oceanDesignTokens = {
  theme: oceanThemeTokens,
  ...oceanSemanticTokens,
  components: toHightideComponentTokens({ semanticTokens: oceanSemanticTokens }),
} satisfies HightideDesignSystemTokens

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
      <Text style={{ color: theme.colors.onBackground }}>
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
