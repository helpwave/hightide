export type FontWeightToken =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'

export type FontFamilyToken = string

export type FontWeightVariableTokens = Record<string, FontWeightToken>
