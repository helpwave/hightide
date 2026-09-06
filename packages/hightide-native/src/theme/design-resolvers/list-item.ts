import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  listItemTokens,
  type ListItemTokenResolver,
  type ListItemTokens
} from '@helpwave/hightide-design/component-tokens'
import type { ControlElementLayoutToken } from '@helpwave/hightide-design/semantic-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
import {
  resolveColoringColorVariant,
  resolveColoringStyle
} from './semantic'

type ListItemParams = {
  layout: ControlElementLayoutToken,
  largeLayout: ControlElementLayoutToken,
  titleColor: ColorToken,
  descriptionColor: ColorToken,
  backgroundColor?: ColorToken,
}

export const listItemTokenResolver: ListItemTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
}) => {
  const layout = semanticResolvers.controlLayout({ themeTokens, size: 'md' })
  const largeLayout = semanticResolvers.controlLayout({ themeTokens, size: 'lg' })
  const tonal = overrides?.color !== undefined
    ? resolveColoringStyle({
      themeTokens,
      coloring: resolveColoringColorVariant({
        themeTokens,
        colorPair: overrides.color,
        variant: 'tonal',
      }),
      style: 'filled',
    })
    : undefined
  const descriptionColor = tonal?.foreground ?? semanticResolvers.asDescription({
    themeTokens,
    colorPair: themeTokens.color.surface,
  })
  const states = new Set<'tonal'>()

  if (tonal !== undefined) {
    states.add('tonal')
  }

  return resolveTokenConfig<ListItemTokens>(
    listItemTokens,
    states,
    {
      theme: themeTokens,
      params: {
        layout,
        largeLayout,
        titleColor: tonal?.foreground ?? themeTokens.color.surface.onColor,
        descriptionColor,
        backgroundColor: tonal?.background ?? themeTokens.color.surface.color,
      } satisfies ListItemParams,
    }
  )
}
