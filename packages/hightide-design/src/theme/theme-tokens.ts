import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'
import type { ThemeColorTokens } from './color'
import type {
  ThemeBorderTokens,
  ThemePaddingExtensionTokens,
  ThemePaddingTokens,
  ThemeSizeTokens
} from './layout'
import type { ThemeShadowTokens } from './shadow'
import type { ThemeTypographyTokens } from './typography'

export type { ThemeColorTokens, ThemeRoleColorToken } from './color'

export type ThemeTokens = {
  color: ThemeColorTokens,
  spacing: SpacingPrimitiveTokens,
  size: ThemeSizeTokens,
  padding: ThemePaddingTokens,
  paddingExtension: ThemePaddingExtensionTokens,
  typography: ThemeTypographyTokens,
  radius: RadiusPrimitiveTokens,
  border: ThemeBorderTokens,
  shadow: ThemeShadowTokens,
}
