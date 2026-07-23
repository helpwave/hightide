import {
  Text,
  View
} from 'react-native'
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
import { HightideConfigUtils } from '../../src/global-contexts/hightide-config/HightideConfigUtils'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'
import { ThemeProvider } from '../../src/global-contexts/theme/ThemeProvider'
import { createHightideTheme } from '../../src/theme/themes/createHightideTheme'
import {
  ThemeSelect,
  ThemeStoryFrame
} from './themeStoryHelpers'

const toBluePrimarySemantic: typeof toHightideSemanticTokens = (args) => ({
  ...toHightideSemanticTokens(args),
  primary: args.primitiveTokens.blue.value[500],
  primaryHover: args.primitiveTokens.blue.value[600],
})

const bluePrimaryDesignTokens = constructThemeTokens({
  themeName: 'blue-primary',
  primitiveTokens: colorPalettes,
  toSemantic: toBluePrimarySemantic,
  toComponents: toHightideComponentTokens,
  toTheme: toHightideTheme,
}) satisfies HightideThemeTokens

const bluePrimaryDarkDesignTokens = constructThemeTokens({
  themeName: 'dark',
  primitiveTokens: colorPalettes,
  toSemantic: toBluePrimarySemantic,
  toComponents: toHightideComponentTokens,
  toTheme: toHightideTheme,
}) satisfies HightideThemeTokens

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
          backgroundColor: theme.semantic.primary,
          borderRadius: 8,
          padding: 12,
        }}
      >
        <Text style={{ color: theme.semantic.onPrimary }}>
          primary / onPrimary
        </Text>
      </View>
      <Text style={{ color: theme.semantic.onBackground }}>
        {`primary: ${theme.semantic.primary}`}
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
