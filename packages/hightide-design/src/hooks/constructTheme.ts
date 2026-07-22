export type ThemeConstructorOptions<
  PrimitiveTokens,
  SemanticTokens,
  ComponentTokens,
  Theme
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
  }) => Theme,
}

export const constructTheme = <
  PrimitiveTokens,
  SemanticTokens,
  ComponentTokens,
  Theme
>(
    options: ThemeConstructorOptions<
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
