import type { MotionPrimitiveTokens } from '../primitive/motion'
import type { RadiusPrimitiveTokens } from '../primitive/radius'
import type { SpacingPrimitiveTokens } from '../primitive/spacing'
import type { SemanticColorTokens } from '../semantic/color'
import type { ThemeRoleColorTokens } from '../semantic/hightide'
import type {
  ThemeBorderTokens,
  ThemePaddingExtensionTokens,
  ThemePaddingTokens,
  ThemeSizeTokens
} from './layout'
import type { ThemeShadowTokens } from './shadow'
import type { ThemeTypographyTokens } from './typography'

export type ThemeColorTokens = SemanticColorTokens & ThemeRoleColorTokens

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
  motion: MotionPrimitiveTokens,
}
