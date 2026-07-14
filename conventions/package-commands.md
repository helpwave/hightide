# Package Command Conventions

## Required package scripts

Every package under `packages/` and every app under `apps/` must define the following `package.json` scripts. Scripts may be no-ops when a workspace has nothing to do for that step (for example `node -e "process.exit(0)"`).

| Script  | Description                                                                                                                                                                                                                                    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clean` | Remove generated artifacts and `node_modules` for the workspace (build output, generated barrels, caches, and other files that should not be committed). The repository root runs workspace cleans first, then removes its own `node_modules`. |
| `init`  | Prepare the workspace after install (generate sources, run local setup, or other bootstrap tasks). Assumes `clean` has not left required generated files behind, and that dependencies are already installed.                                  |
| `build` | Compile or bundle the workspace. Assumes `init` has been run. May be a no-op when the workspace is source-only.                                                                                                                                |
| `lint`  | Run static analysis for the workspace (typically ESLint). Assumes `init` has been run when generated sources are required.                                                                                                                     |
| `test`  | Run automated tests for the workspace. Assumes `init` has been run when generated sources are required.                                                                                                                                        |

Packages that do not produce build output (for example `@helpwave/hightide-utils` and `@helpwave/hightide-design`) should still define `build` as a no-op.

## Root orchestration

| Script  | Description                                                                 |
| ------- | --------------------------------------------------------------------------- |
| `clean` | Runs `clean` in every workspace, then removes the root `node_modules`.      |
| `init`  | Runs `init` in every workspace. Does not install dependencies.              |
| `reset` | Runs `clean`, reinstalls dependencies, then runs `init` in every workspace. |
| `build` | Runs `build` in every workspace. Assumes `init` has been run.               |
| `lint`  | Runs `lint` in every workspace.                                             |
| `test`  | Runs `test` in every workspace.                                             |

Typical flows:

- Fresh clone: `pnpm install && pnpm run init`
- Full reset: `pnpm run reset`
- Build: `pnpm run init && pnpm run build`
- CI: `pnpm install --frozen-lockfile`, then `pnpm -r run init`, then the job-specific command (`build`, `lint`, or `test`)

Each command should do only its own responsibility. Do not run `clean` inside `init`, or `init` inside `build`.
