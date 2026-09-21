### TypeScript Enum Pattern

When defining a finite set of string values in TypeScript, use the following pattern instead of a TypeScript enum.

Pattern (replace A with the name of the enum)

```typescript
// 1. Array definition
const aValues = ["value1", "value2"] as const;
// 2. Type definition
export type A = (typeof values)[number];
// 3. Set definition
const allowedAValues: ReadonlySet<string> = new Set(values);
// 4. Type-Check definition
function isAValue(value: unknown): value is A {
  if (typeof value !== "string") return false;
  return allowedAValues.has(value);
}

// 5. Utils definition
export const AUtils = {
  array: aValues,
  set: allowedAValues,
  typeCheck: isAValue,
};
```

1. enum Name in camelCase + "Values" suffix
2. enum Name
3. "allowed" prefix + enum Name + + "Values" suffix
4. "is" prefix + enum Name + "Value" suffix
5. enum Name + "Utils" suffix

For the actual implementation remove the comments
