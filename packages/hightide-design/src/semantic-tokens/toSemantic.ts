import { toSemanticColorSchemeTokens } from './colorScheme'
import type { HightideThemeTokens } from '../theme-tokens/themeTokens'
import { toSemanticColorTokens } from './color'
import { toHightideElementLayoutFromTheme as toElementLayoutTokens } from './elementLayout'
import { toSemanticShadowTokens } from './shadow'
import type { HightideSemanticTokens } from './semanticTokens'
import { createHightideTypographyTokens as toSemanticTypographyTokens } from './typography'
import { toSemanticSpaccingTokens as toSemanticSpacingTokens } from './spacing'
import { toSemanticBorderRadiusTokens } from './borderRadius'
import { toSemanticBorderWidthTokens } from './borderWidth'

export type ToHightideSemanticArgs = {
  themeTokens: HightideThemeTokens,
}

export const toHightideSemanticTokens = ({
  themeTokens,
}: ToHightideSemanticArgs): HightideSemanticTokens => {
  return {
    colors: toSemanticColorTokens(themeTokens),
    colorSchemes: toSemanticColorSchemeTokens(themeTokens),
    typography: toSemanticTypographyTokens(themeTokens),
    spacing: toSemanticSpacingTokens(themeTokens),
    elementLayout: toElementLayoutTokens(themeTokens),
    borderRadius: toSemanticBorderRadiusTokens(themeTokens),
    borderWidth: toSemanticBorderWidthTokens(themeTokens),
    shadow: toSemanticShadowTokens(themeTokens),
  }
}
