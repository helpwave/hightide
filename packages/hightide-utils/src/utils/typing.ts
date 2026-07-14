export type DeepPartial<T> =
  // primitives, functions
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  T extends string | number | boolean | bigint | symbol | null | undefined | Function
    ? T
    // arrays
    : T extends Array<infer U>
      ? Array<DeepPartial<U>>
      // maps
      : T extends Map<infer K, infer V>
        ? Map<DeepPartial<K>, DeepPartial<V>>
        // sets
        : T extends Set<infer U>
          ? Set<DeepPartial<U>>
          // objects (including Records)
          : T extends object
            ? { [P in keyof T]?: DeepPartial<T[P]> }
            : T;

export type SuperSet<T, Base> = Base extends T ? T : never;

export type SingleOrArray<T> = T | T[]

export type Exact<T, U extends T> = U;
