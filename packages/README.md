# hightide packages

This directory holds the cross-platform members of the _hightide_ family. The
web library lives at the repository root (`@helpwave/hightide`); the packages
here extend the same design language to other platforms.

| Package | Description |
| --- | --- |
| [`hightide-tokens`](./hightide-tokens) | `@helpwave/hightide-tokens` — platform-agnostic design tokens (the single source of truth). Zero runtime deps. |
| [`hightide-native`](./hightide-native) | `@helpwave/hightide-native` — the React Native component library (basic app building blocks). |

See [`docs/native/ARCHITECTURE.md`](../docs/native/ARCHITECTURE.md) for the full
picture: why the family is split this way, the native styling strategy, and the
npm packaging / versioning model.

## At a glance

```
@helpwave/hightide-tokens   ← colors · typography · spacing · radii · coloring model · presets
        ▲              ▲
        │              │
@helpwave/hightide   @helpwave/hightide-native
   (web, root)            (react native)
```

All three packages are released **in lockstep** (same version). Bump them with:

```bash
node scripts/sync-versions.mjs <version>
```
