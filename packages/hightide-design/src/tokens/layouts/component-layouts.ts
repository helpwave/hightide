import type { ComponentLayouts } from '../../types'

const spacingBase = 4
const outlineWidth = 2

export const componentLayouts = {
  shared: {
    spacingBase,
    drawerIndent: 16,
    scrollbarWidth: 10,
    scrollbarPadding: 1,
    coloringOutlineWidth: outlineWidth,
    breakpoints: {
      tablet: 768,
      desktop: 1024,
    },
    animation: {
      durationIn: '250ms',
      durationOut: '170ms',
    },
  },
  element: {
    xs: { height: 28, borderRadius: 4 },
    sm: { height: 36, borderRadius: 6 },
    md: { height: 44, borderRadius: 6 },
    lg: { height: 52, borderRadius: 8 },
  },
  elementPadding: {
    xs: { vertical: 6, horizontal: 9 },
    sm: { vertical: 6, horizontal: 12 },
    md: { vertical: 10, horizontal: 20 },
    lg: { vertical: 10, horizontal: 30 },
  },
  button: {
    xs: {
      paddingY: 6,
      paddingX: 9,
      paddingYOutline: 4,
      paddingXOutline: 7,
      gap: 4,
      minWidth: 80,
      borderRadius: 4,
    },
    sm: {
      paddingY: 6,
      paddingX: 12,
      paddingYOutline: 4,
      paddingXOutline: 10,
      gap: 4,
      minWidth: 112,
      borderRadius: 6,
    },
    md: {
      paddingY: 10,
      paddingX: 20,
      paddingYOutline: 8,
      paddingXOutline: 18,
      gap: 8,
      minWidth: 144,
      borderRadius: 6,
    },
    lg: {
      paddingY: 10,
      paddingX: 30,
      paddingYOutline: 8,
      paddingXOutline: 28,
      gap: 8,
      minWidth: 180,
      borderRadius: 8,
    },
  },
  iconButton: {
    xs: { paddingYOutline: 4, paddingXOutline: 4, borderRadius: 4 },
    sm: { paddingYOutline: 4, paddingXOutline: 4, borderRadius: 6 },
    md: { paddingYOutline: 8, paddingXOutline: 8, borderRadius: 6 },
    lg: { paddingYOutline: 8, paddingXOutline: 8, borderRadius: 8 },
  },
  icon: {
    xs: { size: 12, strokeWidth: 2 },
    sm: { size: 14, strokeWidth: 2 },
    md: { size: 16, strokeWidth: 2 },
    lg: { size: 20, strokeWidth: 2 },
  },
  input: {
    md: {
      height: 44,
      paddingX: 12,
      paddingY: 8,
      borderRadius: 6,
    },
  },
  chip: {
    xs: { minHeight: 24, paddingVertical: 3, paddingHorizontal: 4, gap: 4, borderRadius: 4, fontSize: 14 },
    sm: { minHeight: 32, paddingVertical: 4, paddingHorizontal: 6, gap: 4, borderRadius: 6, fontSize: 14 },
    md: { minHeight: 40, paddingVertical: 8, paddingHorizontal: 12, gap: 8, borderRadius: 6, fontSize: 14 },
    lg: { minHeight: 48, paddingVertical: 10, paddingHorizontal: 16, gap: 8, borderRadius: 6, fontSize: 14 },
  },
} as const satisfies ComponentLayouts
