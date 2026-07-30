import type { HightideRadiusPrimitiveTokens } from '../primitive/radius'
import type { HightideSpacingPrimitiveTokens } from '../primitive/spacing'
import type { HightideThemeColorTokens } from './color'
import type {
  HightideThemeBorderTokens,
  HightideThemePaddingExtensionTokens,
  HightideThemePaddingTokens,
  HightideThemeSizeTokens
} from './layout'
import type { HightideThemeShadowTokens } from './shadow'
import type { HightideThemeHightideTypographyTokens } from './typography'

export type { HightideThemeColorTokens, HightideThemeRoleColorToken } from './color'

export type HightideThemeTokens = {
  color: HightideThemeColorTokens,
  spacing: HightideSpacingPrimitiveTokens,
  size: HightideThemeSizeTokens,
  padding: HightideThemePaddingTokens,
  paddingExtension: HightideThemePaddingExtensionTokens,
  typography: HightideThemeHightideTypographyTokens,
  radius: HightideRadiusPrimitiveTokens,
  border: HightideThemeBorderTokens,
  shadow: HightideThemeShadowTokens,
}
