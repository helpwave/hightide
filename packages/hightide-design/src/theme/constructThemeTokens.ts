export type ThemeTokenConstructorOptions<
  PrimitiveTokens,
  SemanticTokens,
  ComponentTokens,
  ThemeTokens
> = {
  themeName: string,
  primitiveTokens: PrimitiveTokens,
  toSemantic: (args: {
    themeName: string,
    primitiveTokens: PrimitiveTokens,
  }) => SemanticTokens,
  toComponents: (args: {
    themeName: string,
    primitiveTokens: PrimitiveTokens,
    semanticTokens: SemanticTokens,
  }) => ComponentTokens,
  toTheme: (args: {
    themeName: string,
    primitiveTokens: PrimitiveTokens,
    semanticTokens: SemanticTokens,
    componentTokens: ComponentTokens,
  }) => ThemeTokens,
}

export const constructThemeTokens = <
  PrimitiveTokens,
  SemanticTokens,
  ComponentTokens,
  ThemeTokens
>(
    options: ThemeTokenConstructorOptions<
    PrimitiveTokens,
    SemanticTokens,
    ComponentTokens,
    ThemeTokens
  >
  ): ThemeTokens => {
  const {
    themeName,
    primitiveTokens,
    toSemantic,
    toComponents,
    toTheme,
  } = options

  const semanticTokens = toSemantic({ themeName, primitiveTokens })
  const componentTokens = toComponents({ themeName, primitiveTokens, semanticTokens })

  return toTheme({
    themeName,
    primitiveTokens,
    semanticTokens,
    componentTokens,
  })
}
