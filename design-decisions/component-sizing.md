# Component sizing

This document describes how hightide sizes UI controls across token layers, and how nested controls are meant to align inside one another.

## Size ladders by layer

| Layer | Keys | Count | Role |
| --- | --- | --- | --- |
| Theme | `xs`, `sm`, `md`, `lg`, `xl` | 5 | Foundation scale for height, padding, radius, and related layout roles |
| Semantic | `sm`–`lg` **or** `xs`–`xl` | 3 or 5 | Depends on the semantic map: outer control/container use the full five; content that sits *inside* a control uses three |
| Component | `sm`, `md`, `lg` | 3 | Public API size on components (`Button`, `Input`, `IconButton`, `Chip`, `Checkbox`, `Icon`, …) |

Theme tokens such as `size`, `padding`, `paddingExtension`, and `borderRadius` are always keyed by the five theme sizes.

Semantic `elementLayout.control` and `elementLayout.container` keep that five-step scale. Semantic `elementLayout.insideControl` (and other “content inside a control” maps) use only `sm` / `md` / `lg`, derived from the outer control so nested content stays one step denser than its host.

Component tokens expose **three sizes only**. Call sites never choose `xs` or `xl` on a component prop; those exist at theme/semantic foundation so the scale can grow without widening every component API.

## Shared control height

Primary interactive shells share the same height per size step:

- `Button`
- `Input`
- `IconButton`
- other full-height controls built from `elementLayout.control`

At a given size (`sm` / `md` / `lg`), these controls are designed to sit on one baseline row: same outer height, consistent inset and border treatment from the shared control layout tokens.

## Nested fit

Some components are not full-height shells. They are sized to sit **inside** a control without stretching or clipping it vertically:

- `Icon`
- `Checkbox`
- `Chip`
- other inside-control content

Their layout comes from `elementLayout.insideControl` (and related component maps). For a host at size `S`, nested content is computed so that:

```text
host height  ≈  nested height + host vertical inset + borders
```

So an icon, checkbox, or chip at the matching size fits vertically flush inside a `Button`, `Input`, or `IconButton` of that size—aligned with sibling labels and without fighting the host’s padding.

## Practical rules

- Prefer the three component sizes in product UI; reach for theme `xs` / `xl` only when defining or extending foundation tokens.
- Keep shell controls on the shared control height scale so mixed toolbars and forms stay even.
- Size nested content with the same component size as its host (or from inside-control tokens) so icons, chips, and checkboxes remain vertically perfect inside buttons and inputs.
