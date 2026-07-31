import type { HightideThemeColorTokens } from './color'
import type {
  HightideThemeBorderRadiusTokens,
  HightideThemeBorderWidthTokens,
  HightideThemePaddingExtensionTokens,
  HightideThemePaddingTokens,
  HightideThemeSizeTokens,
  HightideThemeSpacingTokens
} from './layout'
import type { HightideThemeShadowTokens } from './shadow'
import type { HightideThemeTypographyTokens } from './typography'

export type HightideThemeTokens = {
  colors: HightideThemeColorTokens,
  spacing: HightideThemeSpacingTokens,
  size: HightideThemeSizeTokens,
  padding: HightideThemePaddingTokens,
  paddingExtension: HightideThemePaddingExtensionTokens,
  typography: HightideThemeTypographyTokens,
  borderRadius: HightideThemeBorderRadiusTokens,
  borderWidth: HightideThemeBorderWidthTokens,
  shadow: HightideThemeShadowTokens,
}
