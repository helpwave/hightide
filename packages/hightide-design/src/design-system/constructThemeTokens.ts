export type ThemeTokenConstructorOptions<
  PrimitiveTokens,
  ThemeTokens extends { color: unknown },
  SemanticTokens,
  ComponentTokens,
  DesignSystemTokens
> = {
  primitiveTokens: PrimitiveTokens,
  toThemeTokens: (args: {
    primitiveTokens: PrimitiveTokens,
  }) => ThemeTokens,
  toSemantic: (args: {
    themeTokens: ThemeTokens,
  }) => SemanticTokens,
  toComponents: (args: {
    semanticTokens: SemanticTokens,
  }) => ComponentTokens,
  toDesignSystemTheme?: (args: {
    themeTokens: ThemeTokens,
    semanticTokens: SemanticTokens,
    componentTokens: ComponentTokens,
  }) => DesignSystemTokens,
}

export const constructThemeTokens = <
  PrimitiveTokens,
  ThemeTokens extends { color: unknown },
  SemanticTokens,
  ComponentTokens,
  DesignSystemTokens = {
    semantic: SemanticTokens,
    components: ComponentTokens,
  }
>(
  options: ThemeTokenConstructorOptions<
    PrimitiveTokens,
    ThemeTokens,
    SemanticTokens,
    ComponentTokens,
    DesignSystemTokens
  >
): DesignSystemTokens => {
  const {
    primitiveTokens,
    toThemeTokens,
    toSemantic,
    toComponents,
    toDesignSystemTheme,
  } = options

  const themeTokens = toThemeTokens({ primitiveTokens })
  const semanticTokens = toSemantic({ themeTokens })
  const componentTokens = toComponents({ semanticTokens })

  if (toDesignSystemTheme) {
    return toDesignSystemTheme({
      themeTokens,
      semanticTokens,
      componentTokens,
    })
  }

  return {
    semantic: semanticTokens,
    components: componentTokens,
  } as DesignSystemTokens
}
