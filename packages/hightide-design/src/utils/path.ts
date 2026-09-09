export type DotPath<Object, Type> = {
  [Key in keyof Object & string]:
    NonNullable<Object[Key]> extends Type
      ? Key
      : NonNullable<Object[Key]> extends Record<string, unknown>
        ? `${Key}.${DotPath<NonNullable<Object[Key]>, Type>}`
        : never
}[keyof Object & string]

export type PrefixedDotPath<
  Object,
  Type,
  Prefix extends string
> = `${Prefix}.${DotPath<Object, Type>}`