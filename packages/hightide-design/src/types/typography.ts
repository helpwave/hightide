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

export type TypographyStyleToken = {
  fontSize: number,
  lineHeight: number,
  fontWeight: FontWeightToken,
  fontFamily?: string,
}

export type TypographyTokens = {
  fontWeights: FontWeightVariableTokens,
  scales: {
     headline: {
    large: TypographyStyleToken,
    medium: TypographyStyleToken,
    small: TypographyStyleToken,
    },
    title: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
      small: TypographyStyleToken,
    },
    body: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
    },
    label: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
    },
    caption: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
      small: TypographyStyleToken,
    },
    button: {
      large: TypographyStyleToken,
      medium: TypographyStyleToken,
      small: TypographyStyleToken,
    },
  },
}
