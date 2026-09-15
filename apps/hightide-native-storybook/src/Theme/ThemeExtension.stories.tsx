import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import {
  hightidePrimitiveTokens
} from '@helpwave/hightide-design/primitive-tokens'
import { colorPair, createLightThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import {
  Button,
  Chip,
  ThemedText
} from '@helpwave/hightide-native/components'
import {
  HightideConfigUtils,
  useTheme,
  ThemeProvider
} from '@helpwave/hightide-native/global-contexts'
import { createHightideTheme } from '@helpwave/hightide-native/theme'
import {
  ThemeSelect,
  ThemeStoryFrame
} from './themeStoryHelpers'

const { blue, white } = hightidePrimitiveTokens.color.palettes
const whiteColor = white.value

const oceanTheme = createHightideTheme(createLightThemeTokens({
  color: {
    primary: colorPair(blue[500].value, whiteColor),
    background: colorPair(blue[100].value, blue[900].value),
    surface: colorPair(blue[50].value, blue[900].value),
  },
}))

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
      <ThemedText>
        Ocean theme uses blue background, surface, and primary tokens
      </ThemedText>
      <Button color={theme.colors.primary} onPress={() => undefined}>
        Primary button
      </Button>
      <Chip color={theme.colors.primary}>Primary chip</Chip>
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
