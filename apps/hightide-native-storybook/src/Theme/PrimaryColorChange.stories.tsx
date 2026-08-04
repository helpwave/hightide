import {
  Text,
  View
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react'
import {
  hightidePrimitiveTokens,
  type ColorToken,
  type HightideColorPalettes
} from '@helpwave/hightide-design/primitive-tokens'
import {
  createDarkThemeTokens,
  createLightThemeTokens
} from '@helpwave/hightide-design/theme-tokens'

import { Button } from '@helpwave/hightide-native/components'
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

const bluePrimaryTheme = createHightideTheme(createLightThemeTokens({
  colors: {
    primary: {
      color: blue.value[500] as ColorToken,
      onColor: whiteColor,
    },
  },
}))

const bluePrimaryDarkTheme = createHightideTheme(createDarkThemeTokens({
  colors: {
    primary: {
      color: blue.value[400] as ColorToken,
      onColor: whiteColor,
    },
  },
}))

const bluePrimarySupportedThemes = {
  ...HightideConfigUtils.defaultSupportedThemes,
  'blue-primary': {
    nameTranslations: {
      'de-DE': 'Blau Primary',
      'en-US': 'Blue Primary',
    },
    theme: bluePrimaryTheme,
  },
  'blue-primary-dark': {
    nameTranslations: {
      'de-DE': 'Blau Primary Dunkel',
      'en-US': 'Blue Primary Dark',
    },
    theme: bluePrimaryDarkTheme,
  },
}

const PrimarySwatch = () => {
  const { theme } = useTheme()

  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          backgroundColor: theme.colorSchemes.primary.filled.base.color,
          borderRadius: 8,
          padding: 12,
        }}
      >
        <Text style={{ color: theme.colorSchemes.primary.filled.base.foreground }}>
          primary / onPrimary
        </Text>
      </View>
      <Text style={{ color: theme.colors.onBackground }}>
        {`primary: ${theme.colorSchemes.primary.filled.base.color}`}
      </Text>
    </View>
  )
}

const PrimaryColorChangeDemo = () => (
  <ThemeProvider
    fallbackTheme="blue-primary"
    supportedThemes={bluePrimarySupportedThemes}
  >
    <ThemeStoryFrame>
      <ThemeSelect />
      <PrimarySwatch />
      <Button color="primary" onPress={() => undefined}>
        Primary button
      </Button>
    </ThemeStoryFrame>
  </ThemeProvider>
)

const meta = {
  component: PrimaryColorChangeDemo,
} satisfies Meta<typeof PrimaryColorChangeDemo>

export default meta
type Story = StoryObj<typeof meta>

export const primaryColorChange: Story = {
  render: () => <PrimaryColorChangeDemo />,
}
