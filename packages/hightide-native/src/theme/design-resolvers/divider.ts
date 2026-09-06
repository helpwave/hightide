import {
  dividerTokens,
  type DividerDirection,
  type DividerTokenResolver,
  type DividerTokens
} from '@helpwave/hightide-design/component-tokens'
import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'

type DividerParams = {
  color: ColorToken,
  width: number,
  margin: number,
}

export const dividerTokenResolver: DividerTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
}) => {
  const direction = overrides?.direction ?? 'horizontal'
  const states = new Set<DividerDirection>([direction])

  return resolveTokenConfig<DividerTokens>(
    dividerTokens,
    states,
    {
      theme: themeTokens,
      params: {
        color: overrides?.color ?? semanticResolvers.asFaded({
          themeTokens,
          colorPair: themeTokens.color.surface,
        }),
        width: overrides?.width ?? 1,
        margin: overrides?.margin ?? themeTokens.padding.md,
      } satisfies DividerParams,
    }
  )
}
