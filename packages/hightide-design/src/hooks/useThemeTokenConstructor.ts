import { useMemo } from 'react'
import { useUnstableMapperWarning } from '@helpwave/hightide-utils/hooks/useUnstableMapperWarning'
import type { ThemeConstructorOptions } from './constructTheme'

export type ThemeTokenConstructorOptions<
  PrimitiveTokens,
  SemanticTokens,
  ComponentTokens,
  Theme
> = ThemeConstructorOptions<
  PrimitiveTokens,
  SemanticTokens,
  ComponentTokens,
  Theme
> & {
  disabled?: boolean,
}

export const useThemeTokenConstructor = <
  PrimitiveTokens,
  SemanticTokens,
  ComponentTokens,
  Theme
>(
    options: ThemeTokenConstructorOptions<
    PrimitiveTokens,
    SemanticTokens,
    ComponentTokens,
    Theme
  >
  ): Theme => {
  const {
    themeName,
    primitiveTokens,
    toSemantic,
    toComponents,
    toTheme,
    disabled = false,
  } = options

  useUnstableMapperWarning('useThemeTokenConstructor', 'toSemantic', toSemantic, disabled)
  useUnstableMapperWarning('useThemeTokenConstructor', 'toComponents', toComponents, disabled)
  useUnstableMapperWarning('useThemeTokenConstructor', 'toTheme', toTheme, disabled)

  const semanticTokens = useMemo(
    () => toSemantic({ themeName, primitiveTokens }),
    [themeName, primitiveTokens, toSemantic]
  )

  const componentTokens = useMemo(
    () => toComponents({ themeName, primitiveTokens, semanticTokens }),
    [themeName, primitiveTokens, semanticTokens, toComponents]
  )

  return useMemo(
    () => toTheme({
      themeName,
      primitiveTokens,
      semanticTokens,
      componentTokens,
    }),
    [themeName, primitiveTokens, semanticTokens, componentTokens, toTheme]
  )
}
