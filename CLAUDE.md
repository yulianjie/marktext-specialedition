# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MarkText Special Edition — a Chinese-language fork of MarkText 0.17.1. Electron 17 + Vue 2 + Vuex markdown editor with Muya as the core editing engine. Key additions over upstream: full zh-cn localization, folder-level `marktext.json` settings, image path variables (`{filename}`, `{fileWorkspaceFolder}`, `{relativeFileDirname}`), and Mermaid 10.9.5 diagram support.

## Commands

```bash
yarn run dev          # Dev server with HMR (hot-reload for renderer, auto-restart for main)
yarn run build        # Webpack build + electron-builder package
yarn run build:dev    # Webpack build only (no installer packaging)
yarn run lint         # ESLint check (.js, .vue)
yarn run lint:fix     # ESLint auto-fix
yarn run test         # Unit + E2E tests
yarn run unit         # Unit tests only (Karma + Mocha + Chai)
yarn run e2e          # E2E tests only (Playwright)
yarn run test:specs   # CommonMark + GFM spec validation
yarn run release:win  # Build Windows installer (NSIS + ZIP)
```

## Architecture

**Two-process Electron app:**

- **Main process** (`src/main/`): Entry at `src/main/index.js`. `App` class (`src/main/app/index.js`) orchestrates window management, IPC handlers, menus, keyboard shortcuts, file I/O, spellchecker, and preferences. Uses `electron-store` for persistence.

- **Renderer process** (`src/renderer/`): Entry at `src/renderer/main.js`. Vue 2 SPA with Vue Router, Vuex (12 modules in `src/renderer/store/`), and Element-UI. Bootstrap in `src/renderer/bootstrap.js` parses URL args and sets up `global.marktext`.

- **Muya editor engine** (`src/muya/`): Snabbdom-based virtual DOM markdown editor. Has its own webpack config, theming system, and renderers for Mermaid/KaTeX/Prism/Vega. Themes are copied to `static/themes/` at build time.

- **Shared code** (`src/common/`): Commands, filesystem utilities, keybinding helpers, and encoding shared between both processes.

**IPC flow:** Renderer dispatches Vuex actions → IPC calls to main process for file ops, window management, and system integration.

## Webpack & Build

Build configs live in `.electron-vue/`:
- `webpack.main.config.js` — main process, target `electron-main`
- `webpack.renderer.config.js` — renderer, target `electron-renderer`
- `dev-runner.js` — dev server orchestrator
- `build.js` — production build (clean, copy themes, webpack both processes)

**Webpack aliases:** `@` → `src/renderer`, `main` → `src/main`, `common` → `src/common`, `muya` → `src/muya`

**ESM compatibility:** `vue`, `snabbdom`, and `mermaid` are in `whiteListedModules` (bundled, not externalized) because they're ESM and Electron 17 uses CommonJS.

## Code Style

- ESLint with `standard` + `plugin:vue/base` — no semicolons, 2-space indent, LF line endings
- No Prettier — ESLint handles all formatting
- Babel targets Node 16 / Electron 17

## Key Technical Details

- Mermaid must use `securityLevel: 'loose'` — `'strict'` breaks `<foreignObject>` text rendering
- File dirty-state tracking uses a `pendingBaselineUpdate` flag in `store/help.js` and `store/editor.js` to avoid false "unsaved" indicators caused by markdown parse/reformat on load
- `cytoscape` requires explicit UMD alias in webpack (`cytoscape/dist/cytoscape.umd.js`)
- Output goes to `dist/electron/` (webpack) and `build/` (electron-builder)
