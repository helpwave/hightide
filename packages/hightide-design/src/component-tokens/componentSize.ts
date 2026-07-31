export const componentSizes = ['sm', 'md', 'lg'] as const
export type ComponentSize = typeof componentSizes[number]