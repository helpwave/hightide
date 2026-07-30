import {
  Text,
  View
} from 'react-native'
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
  hightideDarkThemeTokens,
  hightideLightThemeTokens,
  type HightideThemeTokens
} from '@helpwave/hightide-design/theme-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'

import { Button } from '../../src/components/user-interaction/Button'
import { HightideConfigUtils } from '../../src/global-contexts/hightide-config/HightideConfigUtils'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'
import { ThemeProvider } from '../../src/global-contexts/theme/ThemeProvider'
import { createHightideTheme } from '../../src/theme/themes/createHightideTheme'
import {
  ThemeSelect,
  ThemeStoryFrame
} from './themeStoryHelpers'

const withBluePrimary = (themeTokens: HightideThemeTokens): HightideThemeTokens => {
  const { blue, white } = hightidePrimitiveTokens.color.palettes as HightideColorPalettes
  const color = {
    ...themeTokens.color,
    primary: {
      color: blue.value[500] as ColorToken,
      onColor: white.value as ColorToken,
      emphasis: blue.value[600] as ColorToken,
      tint: HexColorUtils.hexWithAlpha(blue.value[500] as ColorToken, 0.2),
      tintEmphasis: HexColorUtils.hexWithAlpha(blue.value[500] as ColorToken, 0.28),
    },
  }

  return {
    ...themeTokens,
    color,
  }
}

const toHightideDesignSystemTokens = (themeTokens: HightideThemeTokens): HightideDesignSystemTokens => {
  const semantic = toHightideSemanticTokens({ themeTokens })
  return {
    theme: themeTokens,
    ...semantic,
    components: toHightideComponentTokens({ semanticTokens: semantic }),
  }
}

const bluePrimaryDesignTokens = toHightideDesignSystemTokens(withBluePrimary(hightideLightThemeTokens))
const bluePrimaryDarkDesignTokens = toHightideDesignSystemTokens(withBluePrimary(hightideDarkThemeTokens))

const bluePrimaryTheme = createHightideTheme(bluePrimaryDesignTokens)
const bluePrimaryDarkTheme = createHightideTheme(bluePrimaryDarkDesignTokens)

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
          backgroundColor: theme.colorSchemes.primary.filled.base.background,
          borderRadius: 8,
          padding: 12,
        }}
      >
        <Text style={{ color: theme.colorSchemes.primary.filled.base.foreground }}>
          primary / onPrimary
        </Text>
      </View>
      <Text style={{ color: theme.colors.onBackground }}>
        {`primary: ${theme.colorSchemes.primary.filled.base.background}`}
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
