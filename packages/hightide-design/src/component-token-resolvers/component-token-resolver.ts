export type ComponentTokenResolver<TThemeTokens, TState, TResult> = (params: {
  themeTokens: TThemeTokens,
  state: TState,
}) => TResult
