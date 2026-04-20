# 开发日志

## 2026-04-20 修复与优化

### 1. 修复打开文件误报"未保存"状态

**问题描述：** 每次打开一个 `.md` 文件，未做任何编辑就会被标记为"未保存"，关闭时弹出保存确认对话框。

**根本原因：** 编辑器加载文件时，`setMarkdown()` 会将原始 markdown 解析为内部 block 结构，然后通过 `setTimeout` 异步触发 `dispatchChange()`。该方法从 block 结构重新导出 markdown，由于格式化规范化（空格、缩进、换行等），重新导出的内容与原始文件存在细微差异。`LISTEN_FOR_CONTENT_CHANGE` 比较两者后误判为"已修改"。

**修复方案：** 在文档状态中添加 `pendingBaselineUpdate` 标志，文件首次加载后的 change 事件仅更新 markdown 基准值，不触发 dirty 状态。后续用户的真实编辑才会正常标记为未保存。

**修改文件：**
- `src/renderer/store/help.js` — 添加 `pendingBaselineUpdate` 字段
- `src/renderer/store/editor.js` — 在 `NEW_TAB_WITH_CONTENT` 中设置标志，在 `LISTEN_FOR_CONTENT_CHANGE` 中处理基准更新逻辑

### 2. 修复 Mermaid 图表渲染

**问题描述：** Mermaid 流程图只显示框架，文字内容不显示。

**根本原因：** 项目中 `@mermaid-js/mermaid-mindmap` 作为独立插件已不再需要（mindmap 已合入 mermaid 主线）。同时 mermaid 的 `securityLevel: 'strict'` 在 v10 中会通过 DOMPurify 过滤掉 `<foreignObject>` 标签，导致节点内文字被移除。

**修复方案：**
- 移除 `@mermaid-js/mermaid-mindmap` 依赖，升级 mermaid 到 10.9.5
- 将 `securityLevel` 从 `'strict'` 改为 `'loose'`（本地 Electron 应用无 XSS 风险）

**修改文件：**
- `package.json` — 移除 `@mermaid-js/mermaid-mindmap`，mermaid 升级到 `^10.9.5`
- `src/muya/lib/renderers/index.js` — 移除 mindmap 插件导入和注册
- `src/muya/lib/parser/render/index.js` — `securityLevel` 改为 `'loose'`
- `src/muya/lib/utils/exportHtml.js` — 同上

### 3. 修复 Webpack 构建错误

**问题描述：** `cytoscape` 模块的 exports 字段未暴露 `./dist/cytoscape.umd.js`，导致 mermaid 依赖解析失败。

**修复方案：** 在 webpack resolve alias 中添加 cytoscape UMD 文件的映射。

**修改文件：**
- `.electron-vue/webpack.renderer.config.js` — 添加 `cytoscape/dist/cytoscape.umd.js` alias

### 4. 修复 ESM 模块兼容性问题

**问题描述：** `snabbdom` 和 `mermaid` 等包使用 ESM 格式，但 Electron 17 的 renderer 进程使用 CommonJS `require()` 加载，导致运行时报错卡在加载界面。

**修复方案：** 将这些包加入 webpack 白名单，让 webpack 将其打包进 bundle 而非运行时加载。

**修改文件：**
- `.electron-vue/webpack.renderer.config.js` — whiteListedModules 添加 `'snabbdom'` 和 `'mermaid'`

### 5. 构建配置调整

- `electron-builder.yml` — Windows 构建目标从 `[ia32, x64]` 改为仅 `[x64]`
- `package.json` — 添加 `deep-equal` 依赖

### 6. 构建环境适配（node_modules 层面，不影响源码）

- 修补 `node-gyp` 的 `find-visualstudio.js` 以支持 VS 2025 (v18)
- 修补 `native-keymap` 的 `binding.gyp` 添加 `/wd4996` 禁用 deprecated 警告
- 修补 `node-gyp` 的 `addon.gypi` 全局禁用 C4996 警告
