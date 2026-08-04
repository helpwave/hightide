import type { ColorToken } from '../primitive-tokens/color'

export type ContainerTokens = {
  backgroundColor: ColorToken,
  borderColor: ColorToken,
  borderWidth: number,
  borderRadius: number,
  paddingVertical: number,
  paddingHorizontal: number,
  gap: number,
  minWidth: number,
  minHeight: number,
  opacity: number,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}
