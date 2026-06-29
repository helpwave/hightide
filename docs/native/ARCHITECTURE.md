# hightide for React + React Native — Architecture

This document describes how _hightide_ is being extended from a web-only
component library into a **hybrid design system** that serves both React (web)
and React Native (mobile) from one shared design language.

It is the "think about the architecture first" part of the work: the _why_
behind the package layout, the styling strategy, and the versioning model.

---

## 1. Goals & constraints

1. **One design language, two platforms.** Web and native must look the same and
   never silently drift. A color or spacing change should happen in exactly one
   place.
2. **Don't disrupt the web library.** `@helpwave/hightide` is in production. The
   native work is **additive** — it must not change the web build, lint, tests
   or publish pipeline.
3. **App-appropriate scope on native.** Native ships the _basic app building
   blocks_. Desktop-web patterns (AppPage, Carousel, Table, data-grid filtering,
   …) are deliberately excluded — see
   [`COMPONENT-INVENTORY.md`](./COMPONENT-INVENTORY.md).
4. **Shared versioning.** The packages should release together so a given
   version means the same design language everywhere.

### The core technical challenge

The web library is **Tailwind-CSS-v4 driven**. Components are deliberately thin:
they emit DOM with `data-*` attributes (`data-color`, `data-coloringstyle`,
`data-size`), and _all_ visual styling lives in CSS that targets those
attributes (`src/style/theme/**`). React Native has **no CSS, no cascade and no
`data-*` selectors**, so the web stylesheets cannot be reused directly.

What _can_ be shared is everything underneath the CSS: the **design tokens**
(colors, typography, spacing, radii, elevation) and the **semantics** of the
component variants (e.g. what `coloringStyle="tonal"` means).

---

## 2. How other hybrid libraries solve this

| Library | Strategy | Takeaway for us |
| --- | --- | --- |
| **gluestack-ui v2** | Components styled with **NativeWind** (Tailwind for RN); ships as copy-paste source; tokens via a Tailwind preset + CSS variables. | Tailwind mental model transfers to native. But it **requires** the consumer to wire up NativeWind (babel + metro + jsxImportSource) — real setup friction. |
| **Tamagui** | Its own styling system + **optimizing compiler**; uses `react-native-web` on web for 100% parity. | Best raw perf and parity, but a heavy, opinionated framework and compiler — too much to retrofit onto an existing Tailwind library. |
| **react-native-web** (alone) | Run the _same_ RN components on web. | Great for app code, but our **web** library is already a mature, Tailwind-native codebase we don't want to throw away. |
| **Shopify Restyle / Dripsy** | Theme object + typed style props, plain `StyleSheet` under the hood. | A themed-`StyleSheet` core is robust and dependency-light — exactly what a _foundational_ library wants. |
| **tailwind-variants / cva** | Map component variants → class strings. | Confirms the value of a small, explicit variant→style resolver. |

**Conclusion.** The common thread in every successful hybrid library is a
**single source of truth for design tokens** feeding platform-specific styling.
Where they differ is the styling _mechanism_ — and that choice is a trade-off
between "same authoring API" (NativeWind) and "zero-config robustness"
(themed `StyleSheet`).

---

## 3. Chosen architecture

### 3.1 A three-package family (shared tokens at the center)

```
hightide/  (this repo)
├── src/ …                         @helpwave/hightide          (web, unchanged)
└── packages/
    ├── hightide-tokens/           @helpwave/hightide-tokens   (shared, 0 deps)
    │     colors · typography · spacing · radii · elevation
    │     coloring model · Tailwind/NativeWind preset · CSS vars
    │
    └── hightide-native/           @helpwave/hightide-native   (React Native)
          theme provider · Text · Button · Card · Chip · Avatar · …
```

- **`@helpwave/hightide-tokens`** is the **single source of truth**. It is pure
  TypeScript with **no runtime dependencies** and no React/DOM/RN imports, so it
  can be consumed by anything: the web Tailwind config, NativeWind, React Native
  `StyleSheet`, charts, e-mails, Figma export, etc.
- **`@helpwave/hightide`** (web) is unchanged today. The follow-up is to make it
  _consume_ the tokens package instead of duplicating values (see §6).
- **`@helpwave/hightide-native`** builds the native components on those tokens.

> Why a separate tokens package rather than importing from the web package?
> Because the web package pulls in `react-dom`, `lucide-react`, `@tanstack/*`
> and the whole Tailwind toolchain. Native must not depend on any of that. A
> tiny, dependency-free tokens package is the clean seam between the two.

### 3.2 Styling strategy on native: themed `StyleSheet` core, NativeWind-ready

The native components are styled with **React Native `StyleSheet`**, driven by
the shared tokens through a small styling layer:

- `resolveColorRole(role, colors)` (in tokens) reproduces the web
  `@utility primary { --coloring-color … }` mapping.
- `resolveColoring(theme, { role, coloringStyle, pressed, disabled })` (in
  native) turns a `(role, treatment)` pair into concrete RN styles — an exact
  port of the web `coloring-{solid,tonal,outline,text,tonal-outline}` utilities,
  including the tonal opacity steps and the hover→press color swap.
- `resolveElement(theme, size)` ports the `sizing-{xs,sm,md,lg}` element
  geometry.

**Why `StyleSheet` and not NativeWind for the components themselves?**

| | themed `StyleSheet` (chosen) | NativeWind-only |
| --- | --- | --- |
| Consumer setup | none — works out of the box | babel plugin + metro + `jsxImportSource` + global.css |
| Robustness | renders correctly always | unstyled if setup is missing/misconfigured |
| Dark mode | React context swap, deterministic | CSS-var + `dark:` on native (more edge cases) |
| Verifiability | plain TS, unit-testable | needs a full RN build to verify |
| Design-language parity | identical tokens & semantics | identical tokens & semantics |

A _foundational_ library should render correctly with **zero build setup** —
forcing the full NativeWind toolchain on every consumer is the single biggest
friction point teams report with gluestack-ui. So the components depend only on
`StyleSheet`.

**But we are not anti-NativeWind.** The same tokens are exported as a NativeWind
preset (`@helpwave/hightide-native/tailwind.preset`) plus a generated
`global.css`, and every component forwards `className`. Teams that want
utility-class ergonomics get the hightide tokens as Tailwind classes
(`bg-primary`, `text-title-md`, …) and can extend any component — it is an
opt-in layer, not a requirement.

This gives us the best of both: **NativeWind's authoring ergonomics are
available**, but **correctness never depends on them**.

---

## 4. Packaging & versioning on npm

> _"Can we package both into the same or a sub-package on npm, with the same
> versioning?"_

**Recommendation: separate, scoped packages under `@helpwave/*`, released in
lockstep (same version) from this one monorepo.**

```
@helpwave/hightide          0.x.y   (web)
@helpwave/hightide-native   0.x.y   (react native)   ← same version
@helpwave/hightide-tokens   0.x.y   (shared)         ← same version
```

### Why not a single combined package?

A single `@helpwave/hightide` that also exports `@helpwave/hightide/native`
sounds convenient but is the wrong trade-off:

- **Divergent peer dependencies.** Native needs `react-native` (and optionally
  `nativewind`); web needs `react-dom`. Merging them forces every web consumer's
  install/resolver to reason about `react-native`, and vice-versa.
- **Divergent build/tooling.** Metro vs. Vite/Next, different `jsxImportSource`,
  different bundling. One package can't cleanly satisfy both.
- **Bundle bloat & tree-shaking.** Web apps would pull native-only code into
  their dependency graph and vice-versa.

Separate scoped packages keep each install lean while a shared **version number**
communicates "same design language". This is exactly how the ecosystem ships
hybrid systems (gluestack, Tamagui, etc. publish multiple coordinated packages).

### How "same versioning" is enforced

The packages live in **one repo** and are bumped together. A helper script keeps
their versions in lockstep:

```bash
node scripts/sync-versions.mjs 0.13.0   # sets web + native + tokens to 0.13.0
```

The recommended adoption step (a one-line, opt-in change — see §5) is to enable
**npm workspaces** so local development resolves the packages to each other
automatically and a single release flow publishes all three.

### Dependency direction

```
@helpwave/hightide-tokens   (no deps)
        ▲                 ▲
        │                 │
@helpwave/hightide   @helpwave/hightide-native
   (web, future)         (depends on tokens)
```

`hightide-native` depends on `hightide-tokens` at the **same exact version**
(`"@helpwave/hightide-tokens": "0.12.7"`), so a published native build always
pairs with the matching tokens build.

---

## 5. Local development & enabling workspaces (opt-in)

This PR is intentionally **additive** and does **not** modify the root
`package.json` or lockfile, so the web pipeline is untouched. Each package builds
and type-checks on its own (verified in CI-less form during development).

When the team is ready to adopt the monorepo workflow, enable npm workspaces with
a single change to the root `package.json`:

```jsonc
{
  // …existing fields…
  "workspaces": ["packages/*"]
}
```

Then `npm install` at the repo root will:

- symlink `@helpwave/hightide-tokens` into `@helpwave/hightide-native` (so the
  `0.12.7` dependency resolves locally, no publish needed), and
- hoist shared dev tooling.

Until then, a package can be developed in isolation by temporarily pointing the
tokens dependency at the local path (`"@helpwave/hightide-tokens":
"file:../hightide-tokens"`).

> Workspaces were left opt-in on purpose: turning them on requires regenerating
> the root lockfile (which pulls `react-native` into the root install), and we
> didn't want to couple that to the web library's `npm ci` in the same PR.

---

## 6. Follow-up work

1. **Web consumes the tokens package.** Migrate `src/style/theme/**` to import
   values from `@helpwave/hightide-tokens` (or generate the `@theme` CSS from
   it) so web and native share _literally_ the same numbers, not transcribed
   copies. Until then, the tokens package is the documented source of truth and
   the transcription is covered by a snapshot test opportunity.
2. **Enable workspaces + a single release flow** (changesets or the
   `sync-versions.mjs` script + the existing publish action per package).
3. **On-device Storybook.** Add an `@storybook/react-native` (Metro) target
   alongside the `react-native-web` one for true-device previews.
4. **Grow the component set** per the [inventory](./COMPONENT-INVENTORY.md):
   overlays (Modal/BottomSheet on RN primitives), inputs, Select/Combobox.

---

## 7. TL;DR

- **3 packages, 1 repo:** `tokens` (shared truth) → `hightide` (web) +
  `hightide-native` (RN).
- **Tokens are platform-agnostic;** native styles with themed `StyleSheet` and
  is **NativeWind-ready** (preset + `global.css` + `className`), but never
  _requires_ NativeWind.
- **Release as separate `@helpwave/*` packages on the same version**, not one
  combined package — leaner installs, coordinated meaning.
- **Additive & non-breaking** to the web library today; workspaces are a
  documented opt-in.
