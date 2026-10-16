This file gives AI coding assistants (Claude Code, etc.) and new developers a
fast on-ramp to this repository. Keep it short, factual, and up to date — when
behavior here drifts from the code, update this document in the same PR.

## AI Coding Agent Ground Rules

1. Ask, don't assume. If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

2. Simplest solution first. Always implement the simplest thing that could work. Do not add abstractions or flexibility that weren't explicitly requested.

3. Don't touch unrelated code. If a file or function is not directly part of the current task, do not modify it, even if you think it could be improved.

4. Flag uncertainty explicitly. If you are not confident about an approach or technical detail, say so before proceeding. Confidence without certainty causes more damage than admitting a gap.

## Project Overview

Shopgate Connect extension `@shopgate/shopware6-user` (`extension-config.json`). It implements the
Shopgate `shopgate.user.*` pipelines (login, logout, getUser, getRegistrationUrl) against the
Shopware 6 Store API and keeps the Shopware `sw-context-token` in sync with the cart and catalog
extensions. Marked `"trusted": true`. Licensed Apache-2.0.

## Tech Stack

- Backend steps (`extension/`): Node.js, CommonJS (`"type": "commonjs"`), JSDoc types, no TypeScript.
- Only runtime dependency: `@shopgate/shopware6-utility` ^3.0.0 (axios client, context-token storage, error mapping).
- Frontend (`frontend/`): Shopgate PWA 6.19.2 (`@shopgate/pwa-common`, `@shopgate/engage`, `@shopgate/pwa-webcheckout-shopify`), ESM, Redux subscribers only — no React components.
- Package manager: npm (three separate packages: `extension/`, `frontend/`, `tests/`, each with its own lockfile).
- Node: no `.nvmrc`/`engines` in `extension/` or `frontend/`; CI uses Node 24. `tests/package.json` declares `node <= 10.0.0`, which CI ignores.
- Unit tests: Jest 30 (`extension/`). API tests: Postman via Newman (`tests/`).
- Lint: ESLint `standard` in `extension/`, `@shopgate/eslint-config` (ESLint 5) in `frontend/`. No Prettier, no `.editorconfig`.

## Common Commands

Run from the directory shown. There is no build step: sgconnect consumes the source directly.

- Install both packages: `cd extension && npm run init` (runs `npm i` in `extension/` and `frontend/`).
- Install API tests: `cd tests && npm i`.
- Run backend locally: `cd extension && SW_ENDPOINT=<store-url> SW_ACCESS_KEY=<key> node $(which sgconnect) backend start` (README.md). Requires a Shopgate Connect app initialised with `sgconnect init`.
- Run frontend locally: `cd extension && npm run frontend` (= `sgconnect frontend start`).
- Unit tests: `cd extension && npm run test:unit` (= `jest`). CI adds `--ci --reporters=default --reporters=jest-junit`.
- API tests: `cd tests && npm run postman-user` (needs a running backend plus Shopware 6, see Testing Notes).
- Lint frontend: `cd frontend && npm run lint`.
- Lint backend: no script exists. `npx eslint src` in `extension/` — verify before use.
- Link a local utility clone: `cd extension && npm run utility:develop` (installs `../../shopware6-utility` and rewrites `package.json`, do not commit that change).

## Repository Structure

- `extension-config.json` is the extension manifest: admin config keys (`endpoint`, `accessToken`, `languageId`, `registrationPath`), one hook step (`extension/src/hooks/getUserContext.js` on `shopgate.user.getUser.v1:before`), and the two frontend subscribers.
- `pipelines/*.json` define pipelines; file name equals pipeline id. Steps reference backend files as `@shopgate/shopware6-user/src/<folder>/<file>.js`, which resolves to `extension/src/...`. Hook paths in `extension-config.json` are repo-relative instead.
- Pipeline naming: `shopgate.user.*.v1` are the core Shopgate user pipelines this extension implements; `shopgate.shopware6-user.*.v1` are extension-private (`setContextToken`, `initContextToken`, `getOrCreateCartToken`, `getRegistrationUrl`).
- Backend step folders are grouped by concern: `context/` (token storage and sync), `customer/` (needs logged-in user), `guest/` (before login), `hooks/` (steps registered in `extension-config.json`), `services/` (non-step helpers). Every step exports `async (context, input) => output`.
- All Shopware HTTP access goes through `@shopgate/shopware6-utility` (`clientManger.createApiConfig`, `contextManager`, `errorManager.throwOnApiError`). There is no local HTTP client. Note the real export name is `clientManger` (typo lives in the utility).
- Context token flow: `shopgate.shopware6-user.setContextToken.v1` stores the token and fans out to `shopgate.shopware6-cart.setCartContextToken.v1` and `shopgate.catalog-shopware6.setContextToken.v1`. Login, logout and registration all end in this pipeline.
- `frontend/subscriptions/register.js` wires the PWA register route to the `getRegistrationUrl` pipeline and the in-app browser. `frontend/subscriptions/errors.js` logs the user out on pipeline error code `EDESYNC` (thrown by `hooks/getUserContext.js`).
- `extension/typedefs/typedefs.js` holds JSDoc typedefs under the `ApiteSW6User` namespace; `ApiteSW6Utility.*` and `SGConnectAPI.*` types come from the utility package.
- `extension/src/context/getTokenFromSW6.js` is not referenced by any pipeline or config.

## Internal Knowledge Base

Additional internal documentation may be available in the Knowledge Base:

https://gitlab.localdev.cc/internal/knowledge-base

Future AI coding assistants and developers should check this Knowledge Base when they need context about cross-service dependencies, shared platform conventions, infrastructure, deployment, authentication/authorization, internal libraries, or service contracts.

Do not copy Knowledge Base content into this file. Keep AGENTS.md focused on this repository.

## Local Development Notes

- Runtime config lives in git-ignored `extension/config.json` (keys from `extension-config.json`). `frontend/config.json` is also ignored.
- Env overrides take precedence over config: `SW_ENDPOINT`, `SW_ACCESS_KEY`, `SW_LANG_ID` (utility) and `REGISTER_PATH` (`extension/src/services/configManager.js`).
- README suggests `node -r dotenv/config` with an `extension/.env`, but `dotenv` is not a dependency of `extension/`. Verify before use.
- Requires the Shopgate Shopware 6 plugin (`shopgate/webcheckout-shopware6`) on the store. A missing `/store-api/sgwebcheckout/login/token` route means it is not installed (README.md).
- Requires sibling extensions at runtime: `@shopgate/shopware6-cart` >= 3.1.0 and `@shopgate/catalog-shopware6` >= 1.3.0 (CHANGELOG.md). Their pipelines are called by name from `pipelines/`.

## Testing Notes

- Unit tests sit next to the code in `extension/src/<folder>/__tests__/<step>.test.js`. Pattern: `jest.resetModules()` in `beforeEach`, `require()` the step inside the test, hand-built `context` objects (`config`, `log`, `meta`, `storage`).
- Jest config is inline in `extension/package.json`. Its `moduleNameMapper` points `@shopgate/shopware6-utility` to `src/__mocks__/@shopgate/shopware6-utility.js`, but the only tracked mock is `src/__mocks__/@apite/shopware6-utility.js`. Existing tests work around this with inline `jest.mock` factories.
- Only `guest/login.js` and `guest/getRegistrationUrl.js` have unit tests.
- Postman collection (`tests/postman/`) needs a Shopware 6 with sample data, the Shopgate plugin, a running `sgconnect backend`, and the cart extension attached (`tests/README.md`). Globals define the `endpoint_user_*` pipeline URLs.

## Deployment / CI Notes

- `unit-test` (Node 24 alpine) and `test` run on default-branch pushes and merge requests. `test` spins up `dockware/dev:6.6.8.2`, installs the Shopware plugin via composer, installs `@shopgate/platform-sdk@2.0.0`, clones and attaches `ext-shopware6-cart`, starts the backend and runs `npm run postman-ci`.
- Release is tag-driven: `register package` tars the repo into the GitLab generic package registry; `publish to shopgate` then runs `sgconnect extension upload temp --force`. There is no `npm publish`.
- Version source of truth is `extension-config.json` `version`. `extension/package.json` and `frontend/package.json` have no version field. Release commits are titled with the version (e.g. `v4.0.0-beta.1`) and tagged the same.
- CI needs the variables `SG_USER`, `SG_PASS`, `APP_ID`. Lint is not run in CI.

## Project-Specific Pitfalls

- Pipelines across `pipelines/` pass data via numeric `id` slots; `contextToken` uses id `105` between pipelines and `1000`/`1040` within. Keep ids consistent when editing a pipeline.
- Cart pipelines are called with `trusted: false`, own `setContextToken` with `trusted: true`. Do not change trust flags without a reason.
- `guest/login.js` and `customer/logout.js` create the API client with `createApiConfig(context, false)` on purpose so the token is not written to guest storage. Token persistence happens in `context/setContextToken.js` only.
- `guest/login.js` accepts `strategy === 'auth_code'` and uses `parameters.code` directly as the context token.
- Git tags mix bare (`3.1.0`) and `v`-prefixed (`v3.1.1`, `v4.0.0-beta.1`) names. CI uses `$CI_COMMIT_TAG` verbatim as the package version.
- `CHANGELOG.md` top entry is `4.0.0 - unreleased` while `extension-config.json` is `4.0.0-beta.1`; there is no 3.1.1 entry although tag `v3.1.1` exists.
- `extension/package-lock.json` still records the old package name `@apite/shopware6-user`.
- `customer/getUser.js` formats the birthday month with `date.getMonth()` without `+1` (zero-based). Do not "fix" silently; confirm intent first.

## Editing Guidelines for AI Agents

- Backend (`extension/`): no semicolons, single quotes, `'use strict'`, CommonJS, JSDoc on every exported step (`standard` style). Frontend (`frontend/`): ESM, semicolons, trailing commas (`@shopgate/eslint-config`). Do not mix the two styles.
- Add a new backend step as `extension/src/<folder>/<name>.js` and reference it in a `pipelines/*.json` file as `@shopgate/shopware6-user/src/<folder>/<name>.js`. Hooks go into `extension-config.json` `steps` instead.
- Call Shopware only through `@shopgate/shopware6-utility`; map errors with `errorManager.throwOnApiError` / `throwOnMessage`. Log via `extension/src/services/logDecorator.js`.
- New admin config keys must be added to `extension-config.json` `configuration` and read from `context.config`.
- Do not edit `extension/config.json`, `frontend/config.json`, `.env`, or any lockfile by hand. Do not commit `package.json` changes produced by `npm run utility:develop`.
- Bump `extension-config.json` `version` and `CHANGELOG.md` together for a release.
- Keep `pipelines/` JSON in the existing `{"version":"1","pipeline":{...}}` shape and name the file exactly after the pipeline id.
