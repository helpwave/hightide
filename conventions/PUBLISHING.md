# Publishing packages

How to release the public npm packages in this monorepo.

## Packages

| Package | Path |
| --- | --- |
| `@helpwave/hightide` | `packages/hightide` |
| `@helpwave/hightide-native` | `packages/hightide-native` |
| `@helpwave/hightide-utils` | `packages/hightide-utils` |
| `@helpwave/hightide-design` | `packages/hightide-design` |

## Release steps

1. Bump the `version` in that package's `package.json`.
2. Document the changes in that package's `CHANGELOG.md` (Keep a Changelog + SemVer).
3. Open a PR to `main`. Path-filtered dry-run workflows:
   - Fail if the version matches the latest version already on npm (forces a bump).
   - Run `pnpm --filter <package> publish --dry-run --no-git-checks --access public`.
4. Merge to `main`. The matching publish workflow installs deps, runs `init`/`build`, then publishes with:

```bash
pnpm --filter <package> publish --no-git-checks --access public
```

Publishing uses the repository secret `NPM_TOKEN`, exposed to the job as `NODE_AUTH_TOKEN`.

## Dependency order

`@helpwave/hightide` depends on `@helpwave/hightide-utils`.  
`@helpwave/hightide-native` depends on `@helpwave/hightide-utils` and `@helpwave/hightide-design`.

When those dependencies change:

1. Bump and publish `@helpwave/hightide-utils` and/or `@helpwave/hightide-design` first.
2. Then bump and publish dependents (`hightide`, `hightide-native`) so their published manifests resolve the new versions.

`pnpm publish` rewrites `workspace:*` dependency ranges to the concrete workspace versions at publish time.

## Workflows

| Trigger | Workflows |
| --- | --- |
| PR to `main` (package paths) | `publish-dry-run-*.yaml` |
| Push to `main` (package paths) | `publish-*.yaml` |

Always use **pnpm publish** (via `pnpm --filter … publish`), not `npm publish`.
