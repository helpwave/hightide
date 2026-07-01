# Component inventory — what goes native, and what doesn't

`@helpwave/hightide-native` ships the **basic app building blocks**. This table
classifies every web component so the scope is explicit and reviewable.

Legend:
- ✅ **Ported** — implemented in `@helpwave/hightide-native` in this PR.
- 🔜 **Planned** — app-appropriate, a good candidate for a later phase.
- 🚫 **Web-only** — desktop/web-optimized; intentionally **excluded** from native.

## Display & visualization

| Web component | Native | Notes |
| --- | --- | --- |
| `Avatar`, `AvatarGroup`, `AvatarWithStatus` | ✅ | Image + initials fallback, overlap group, presence dot. |
| `Card`, `ActionCard` | ✅ | `NavigationCard` deferred (web routing semantics). |
| `Chip`, `ChipList` | ✅ | Full role × treatment coloring. |
| `Tag` (`TagIcon`) | 🚫 | Thin wrapper around `next/image` + a CDN asset. |
| `ProgressIndicator` | 🔜 | Straightforward port (bar + track tokens exist). |
| `ExpansionIcon` | 🔜 | Needs an icon strategy (see "Icons" below). |
| `process-model/*` | 🚫 | SVG/canvas graph editor — desktop tooling. |
| — (`Badge`) | ✅ | New native primitive for counts/status (no exact web twin). |

## User interaction

| Web component | Native | Notes |
| --- | --- | --- |
| `Button` | ✅ | All sizes + all 5 coloring treatments. |
| `IconButton` | ✅ | Square; tooltip behavior dropped on native. |
| `Switch` | ✅ | Controlled/uncontrolled. |
| `Checkbox` | ✅ | Tri-state (checked/unchecked/indeterminate). |
| `Textarea`, `input/*` (`Input`, `SearchBar`, …) | 🔜 | Map to `TextInput`; high value, next phase. |
| `Select`, `Combobox`, `MultiSelect` | 🔜 | Rebuild on RN `Modal`/bottom-sheet, not popovers. |
| `Menu`, `Tooltip` | 🔜 / 🚫 | Hover tooltips are web-centric; menus → action sheets. |
| `ScrollPicker` | 🔜 | Useful on mobile; needs gesture work. |
| `date/*`, `properties/*`, `data/*` (filter/sort) | 🚫 | Data-grid / desktop-form machinery. |
| `CopyToClipboardWrapper` | 🔜 | Trivial via `@react-native-clipboard/clipboard`. |

## Layout

| Web component | Native | Notes |
| --- | --- | --- |
| `Divider`, `VerticalDivider` | ✅ | Single `Divider` with `orientation`. |
| `Expandable` | 🔜 | `LayoutAnimation`/Reanimated accordion. |
| `Visibility` | 🔜 | Trivial conditional-render helper. |
| `loading/*` (`LoadingAnimation`, …) | ✅ (`Spinner`) | `Spinner` wraps `ActivityIndicator`; richer loading/error states later. |
| `dialog/*`, `drawer/*`, `popup/*` | 🔜 | Rebuild on RN `Modal` + bottom-sheet (not DOM portals/popovers). |
| `navigation/*` (`BreadCrumbs`, `Pagination`, `StepperBar`, `Navigation`) | 🚫 | Web navigation; native apps use a navigation library (React Navigation/Expo Router). |
| `table/*`, `VirtualizedTableBody` | 🚫 | Desktop data tables → use `FlatList`/`SectionList` patterns instead. |
| **`AppPage`** | 🚫 | **Explicitly excluded** — desktop app shell (sidebars, multi-pane). |
| **`Carousel`** | 🚫 | **Explicitly excluded** — desktop-tuned. |
| `MarkdownInterpreter`, `FAQSection`, `TextImage`, `InfiniteScroll`, `TabSwitcher`, `AnchoredFloatingContainer`, `DividerInserter` | 🚫 / 🔜 | Marketing/desktop layout helpers; `TabSwitcher` is a 🔜 candidate. |

## Branding

| Web component | Native | Notes |
| --- | --- | --- |
| `HelpwaveLogo`, `HelpwaveBadge` | 🔜 | Need `react-native-svg` versions of the marks. |

## Foundations shared by everything

| Concern | Native |
| --- | --- |
| Design tokens (color/typography/spacing/radii/elevation) | ✅ via `@helpwave/hightide-tokens` |
| Theme provider + light/dark | ✅ `HightideThemeProvider` |
| Typography primitive | ✅ `Text` (named variants) |
| Coloring model (role × treatment) | ✅ `resolveColoring` / `useColoring` |
| Element sizing (xs/sm/md/lg) | ✅ `resolveElement` |

## Icons (cross-cutting)

The web library uses `lucide-react`. On native the equivalent is
`lucide-react-native` (which needs `react-native-svg`). To avoid forcing that
dependency, native components take **icon slots** (`ReactNode` or
`({ color, size }) => ReactNode`) rather than importing icons directly, so the
consumer chooses the icon set.
