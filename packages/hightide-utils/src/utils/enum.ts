export type EnumUtilsType<E extends string> = Readonly<{
  values: readonly E[],
  set: ReadonlySet<string>,
  isValue: (value: unknown) => value is E,
}>