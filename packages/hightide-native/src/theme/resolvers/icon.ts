import { createIconSizeTokens } from '@helpwave/hightide-design/component-token-resolvers'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import type { IconTheme } from '../types/components/hightide'

export const toIconTheme = (themeTokens: ThemeTokens): IconTheme => createIconSizeTokens(themeTokens)
