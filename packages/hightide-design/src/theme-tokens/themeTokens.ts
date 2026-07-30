import type { HightideRadiusPrimitiveTokens } from '../primitive-tokens/radius'
import type { HightideSpacingPrimitiveTokens } from '../primitive-tokens/spacing'
import type { HightideThemeColorTokens } from './color'
import type {
  HightideThemeBorderTokens,
  HightideThemePaddingExtensionTokens,
  HightideThemePaddingTokens,
  HightideThemeSizeTokens
} from './layout'
import type { HightideThemeShadowTokens } from './shadow'
import type { HightideThemeTypographyTokens } from './typography'

export type { HightideThemeColorTokens, HightideThemeRoleColorToken } from './color'

export type HightideThemeTokens = {
  color: HightideThemeColorTokens,
  spacing: HightideSpacingPrimitiveTokens,
  size: HightideThemeSizeTokens,
  padding: HightideThemePaddingTokens,
  paddingExtension: HightideThemePaddingExtensionTokens,
  typography: HightideThemeTypographyTokens,
  radius: HightideRadiusPrimitiveTokens,
  border: HightideThemeBorderTokens,
  shadow: HightideThemeShadowTokens,
}
