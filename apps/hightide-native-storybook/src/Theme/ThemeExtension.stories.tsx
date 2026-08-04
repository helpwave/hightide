import { Text } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react'
import {
  hightidePrimitiveTokens,
  type ColorToken,
  type HightideColorPalettes
} from '@helpwave/hightide-design/primitive-tokens'
import { createLightThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { Button, Chip } from '@helpwave/hightide-native/components'
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

const { blue, white } = hightidePrimitiveTokens.color.palettes as HightideColorPalettes
const whiteColor = white.value as ColorToken

const oceanTheme = createHightideTheme(createLightThemeTokens({
  colors: {
    primary: {
      color: blue.value[500] as ColorToken,
      onColor: whiteColor,
    },
    background: {
      color: blue.value[100] as ColorToken,
      onColor: blue.value[900] as ColorToken,
    },
    surface: {
      color: blue.value[50] as ColorToken,
      onColor: blue.value[900] as ColorToken,
    },
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
