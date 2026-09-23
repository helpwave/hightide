import { componentTokens } from '@helpwave/hightide-design/component-tokens'
import { resolveTokens } from '@helpwave/hightide-design/resolver'
import { semanticTokens } from '@helpwave/hightide-design/semantic-tokens'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import { createLeaves } from '../create-leaves'
import { createSemantics } from '../create-semantics'
import { flattenThemeTokens } from '../flatten-theme'
import { bindTokenContext } from '../token-context'
import type { HightideComponentThemes } from '../types/components/hightide'
import type { HightideTheme } from '../types/theme'
import { toFontWeight, type HightideFontWeights, type HightideTypography, type TypographyStyle } from '../types/typography'

const themeCache = new WeakMap<ThemeTokens, HightideTheme>()

export const createHightideTheme = (themeTokens: ThemeTokens): HightideTheme => {
  const cached = themeCache.get(themeTokens)
  if (cached !== undefined) {
    return cached
  }

  const flattened = flattenThemeTokens(
    resolveTokens(themeTokens, { theme: themeTokens })
  ) as Pick<
    HightideTheme,
    | 'fontFamilies'
    | 'fontSizing'
    | 'icongraphy'
    | 'size'
    | 'spacing'
    | 'padding'
    | 'borderRadius'
    | 'borderWidth'
    | 'elevation'
    | 'motion'
    | 'focusOutline'
    | 'config'
  > & {
    color: HightideTheme['colors'],
    fontWeights: Record<string, number>,
    typography: {
      display: Omit<TypographyStyle, 'fontWeight'> & { fontWeight: number },
      heading: Record<'sm' | 'md' | 'lg', Omit<TypographyStyle, 'fontWeight'> & { fontWeight: number }>,
      body: Record<'sm' | 'md' | 'lg', Omit<TypographyStyle, 'fontWeight'> & { fontWeight: number }>,
      label: Record<'sm' | 'md' | 'lg', Omit<TypographyStyle, 'fontWeight'> & { fontWeight: number }>,
    },
  }

  const bind = bindTokenContext(themeTokens, semanticTokens)
  const leaves = createLeaves(componentTokens, bind) as Record<string, never> & HightideComponentThemes & {
    pressable: HightideComponentThemes['themedPressable'],
    textarea: HightideComponentThemes['textarea']['overlay'],
    icon: HightideComponentThemes['icon']['icon'],
  }
  const listItemAction = {
    ...leaves.listItem.default,
    ...leaves.listItem.action,
  }
  const asContainerGroup = (value: unknown) => (
    typeof value === 'function' ? { container: value } : value
  )
  const mapTypographyStyle = (
    style: Omit<TypographyStyle, 'fontWeight'> & { fontWeight: number }
  ): TypographyStyle => ({
    ...style,
    fontWeight: toFontWeight(style.fontWeight),
  })
  const typographySizes = ['sm', 'md', 'lg'] as const
  const mapTypographyScale = (
    scale: Record<'sm' | 'md' | 'lg', Omit<TypographyStyle, 'fontWeight'> & { fontWeight: number }>
  ) => (
    Object.fromEntries(
      typographySizes.map((size) => [size, mapTypographyStyle(scale[size])])
    ) as Record<'sm' | 'md' | 'lg', TypographyStyle>
  )
  const typography: HightideTypography = {
    display: mapTypographyStyle(flattened.typography.display),
    heading: mapTypographyScale(flattened.typography.heading),
    body: mapTypographyScale(flattened.typography.body),
    label: mapTypographyScale(flattened.typography.label),
  }
  const fontWeights: HightideFontWeights = Object.fromEntries(
    Object.entries(flattened.fontWeights).map(([key, value]) => [key, toFontWeight(value)])
  )

  const theme: HightideTheme = {
    colors: flattened.color,
    fontFamilies: flattened.fontFamilies,
    fontWeights,
    fontSizing: flattened.fontSizing,
    typography,
    icongraphy: flattened.icongraphy,
    size: flattened.size,
    spacing: flattened.spacing,
    padding: flattened.padding,
    borderRadius: flattened.borderRadius,
    borderWidth: flattened.borderWidth,
    elevation: flattened.elevation,
    shadow: {
      raised: flattened.elevation.level1,
      container: flattened.elevation.level2,
      popover: flattened.elevation.level3,
      dialog: flattened.elevation.level4,
    },
    motion: flattened.motion,
    focusOutline: flattened.focusOutline,
    config: flattened.config,
    semantics: createSemantics(themeTokens),
    components: {
      button: leaves.button,
      iconButton: leaves.iconButton,
      themedPressable: leaves.pressable,
      chip: leaves.chip,
      checkbox: leaves.checkbox,
      switch: leaves.switch,
      input: leaves.input,
      textarea: {
        ...leaves.input,
        overlay: leaves.textarea,
      },
      searchBar: {
        ...leaves.searchBar,
        input: leaves.input,
      },
      select: leaves.select,
      multiSelect: leaves.multiSelect,
      chat: leaves.chat,
      card: asContainerGroup(leaves.card) as HightideComponentThemes['card'],
      divider: asContainerGroup(leaves.divider) as HightideComponentThemes['divider'],
      listItem: {
        default: leaves.listItem.default,
        action: listItemAction,
        navigation: listItemAction,
      },
      modal: leaves.modal,
      avatar: leaves.avatar,
      avatarWithStatus: leaves.avatarWithStatus,
      avatarGroup: leaves.avatarGroup,
      icon: {
        icon: leaves.icon,
      },
    },
  }

  themeCache.set(themeTokens, theme)
  return theme
}
