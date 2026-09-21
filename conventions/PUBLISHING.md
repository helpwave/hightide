# Publishing packages

How to release the public npm packages in this monorepo.

## Packages

| Package | Folder | Release tag |
| --- | --- | --- |
| `@helpwave/hightide` | `packages/hightide-web` | `hightide-web@<version>` |
| `@helpwave/hightide-native` | `packages/hightide-native` | `hightide-native@<version>` |
| `@helpwave/hightide-utils` | `packages/hightide-utils` | `hightide-utils@<version>` |
| `@helpwave/hightide-design` | `packages/hightide-design` | `hightide-design@<version>` |

The npm package name for the web library stays `@helpwave/hightide`. Release tags use the folder prefix `hightide-web`.

## Release steps

1. Bump the `version` in that package's `package.json`.
2. Document the changes in that package's `CHANGELOG.md` under a Keep a Changelog heading for that version, for example `## [0.0.1] - 2026-09-21`.
3. Open a PR and merge to `main`.
4. Create and push a tag on the commit to publish, matching the table above:

```bash
git tag hightide-design@0.0.1
git push origin hightide-design@0.0.1
```

The matching `*-publish.yaml` workflow then:

- Checks that the tag is `<prefix>@<version>`, that `package.json` `version` equals the tagged version, and that `CHANGELOG.md` has a `## [<version>]` heading.
- Installs deps, runs `init`/`build`, then publishes with:

```bash
pnpm --filter <package> publish --no-git-checks --access public
```

Publishing uses the repository secret `NPM_TOKEN`, exposed to the job as `NODE_AUTH_TOKEN`.

## Dependency order

`@helpwave/hightide` depends on `@helpwave/hightide-utils`.  
`@helpwave/hightide-native` depends on `@helpwave/hightide-utils` and `@helpwave/hightide-design`.

When those dependencies change:

1. Bump, merge, and tag-publish `@helpwave/hightide-utils` and/or `@helpwave/hightide-design` first.
2. Then bump, merge, and tag-publish dependents (`@helpwave/hightide`, `@helpwave/hightide-native`) so their published manifests resolve the new versions.

`pnpm publish` rewrites `workspace:*` dependency ranges to the concrete workspace versions at publish time.

## Workflows

| Trigger | Workflows |
| --- | --- |
| Push of `hightide-web@*`, `hightide-native@*`, `hightide-utils@*`, or `hightide-design@*` | matching `*-publish.yaml` |

Always use **pnpm publish** (via `pnpm --filter … publish`), not `npm publish`.
