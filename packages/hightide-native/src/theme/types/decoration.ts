export type BorderRadius = number | 'full'

export type HightideDecoration = {
  borderRadius: {
    xs: BorderRadius,
    sm: BorderRadius,
    md: BorderRadius,
    lg: BorderRadius,
    xl: BorderRadius,
  } & Record<string, BorderRadius>,
}