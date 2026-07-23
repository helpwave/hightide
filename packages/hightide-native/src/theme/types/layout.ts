export type ElementSize = 'xs' | 'sm' | 'md' | 'lg'

export type HightideLayout = {
  shared: {
    spacingBase: number,
    drawerIndent: number,
    scrollbarWidth: number,
    scrollbarPadding: number,
    coloringOutlineWidth: number,
    breakpoints: {
      tablet: number,
      desktop: number,
    },
  },
  element: Record<ElementSize, { height: number, borderRadius: number }>,
  elementPadding: Record<ElementSize, { vertical: number, horizontal: number }>,
  button: Record<ElementSize, {
    paddingY: number,
    paddingX: number,
    paddingYOutline: number,
    paddingXOutline: number,
    gap: number,
    minWidth: number,
    borderRadius: number,
  }>,
  iconButton: Record<ElementSize, {
    paddingYOutline: number,
    paddingXOutline: number,
    borderRadius: number,
  }>,
  icon: Record<ElementSize, { size: number, strokeWidth: number }>,
  input: Record<'md', {
    height: number,
    paddingX: number,
    paddingY: number,
    borderRadius: number,
  }>,
  chip: Record<ElementSize, {
    minHeight: number,
    paddingVertical: number,
    paddingHorizontal: number,
    gap: number,
    borderRadius: number,
    fontSize: number,
  }>,
  avatar: Record<ElementSize, {
    size: number,
    padding: number,
    fontSize: number,
    statusDotSize: number,
    statusDotBorderWidth: number,
  }>,
  avatarGroup: {
    overlap: number,
    maxShown: number,
    gap: number,
  },
}