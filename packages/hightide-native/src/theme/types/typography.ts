export type TextStyle = {
  fontSize: number,
  lineHeight: number,
  fontWeight: string,
  fontFamily?: string,
}

export type HightideTypography = {
  fontWeights: Record<string, string>,
  scales: {
    headline: { large: TextStyle, medium: TextStyle, small: TextStyle },
    title: { large: TextStyle, medium: TextStyle, small: TextStyle },
    body: { large: TextStyle, medium: TextStyle },
    label: { large: TextStyle, medium: TextStyle },
    caption: { large: TextStyle, medium: TextStyle, small: TextStyle },
    button: { large: TextStyle, medium: TextStyle, small: TextStyle },
  },
}