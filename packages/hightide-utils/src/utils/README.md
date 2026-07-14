# Utils

Platform-agnostic utility modules for `@helpwave/hightide-utils`.

See [conventions](../../conventions/README.md) for how Utils objects, deprecations, and barrels are structured.

| Module | Utils object | Summary |
| --- | --- | --- |
| [array.ts](./array.ts) | `ArrayUtil` | Array grouping, ranges, neighbours, looping lists, uniqueness, and difference helpers |
| [bagFunctions.ts](./bagFunctions.ts) | `BagFunctionUtil` | Resolves render-prop style bag functions and related React types |
| [builder.ts](./builder.ts) | `BuilderUtils` | Mutable builder-pattern helper for in-place object updates |
| [curve.ts](./curve.ts) | `CurveBuilderUtil` | Easing and rate curves including cubic bezier and exponential builders |
| [date.ts](./date.ts) | `DateUtils` | Date/time parsing, formatting, time zones, calendars, and duration arithmetic |
| [duration.ts](./duration.ts) | `DurationUtils` | Immutable duration value object with date arithmetic |
| [emailValidation.ts](./emailValidation.ts) | `EmailValidationUtils` | Email address format validation |
| [loopingArray.ts](./loopingArray.ts) | `LoopingArrayUtils` | Circular array position, distance, and direction calculations |
| [match.ts](./match.ts) | `MatchUtils` | Key lookup against a record map |
| [math.ts](./math.ts) | `MathUtil` | Clamping, step ranges, and looping numeric bounds |
| [noop.ts](./noop.ts) | `NoopUtils` | No-op callback helper |
| [promise.ts](./promise.ts) | `PromiseUtils` | Promise sleep and delayed value helpers |
| [reactRefs.ts](./reactRefs.ts) | `ReactRefsUtil` | React ref assignment and merged ref builders |
| [resolveSetState.ts](./resolveSetState.ts) | `ResolveSetStateUtils` | Resolves React `SetStateAction` values |
| [simpleSearch.ts](./simpleSearch.ts) | `SimpleSearchUtils` | String and mapped object search/filter helpers |
| [typing.ts](./typing.ts) | — | Shared TypeScript utility types (`DeepPartial`, `SingleOrArray`, etc.) |

## Usage

```ts
import { ArrayUtil, DateUtils } from '@helpwave/hightide-utils'

const items = ArrayUtil.range(5)
const formatted = DateUtils.formatAbsolute(new Date(), 'date')
```

Legacy standalone imports still work but are deprecated. Prefer the Utils object form shown above.
