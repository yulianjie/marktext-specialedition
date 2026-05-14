# MarkText 0.17.1分叉的特别版

## 为什么会有这个特别版

> 笔者的Ebook的项目选择了Markdown作为工件格式，期望编辑器能够：

- 至少部分实现所见即所得的效果，提高编辑效率；
- 能够基于项目体系的来持久化图片文件，图片文件的存储结构相对于Ebook项目应该是稳定的。
- 最好能够内联思维导图、流程图及UML图形，则无需再采用第三方工具来制图。
- 编辑器支持的Markdown组件应与Ebook网站完全兼容，且复制原始md文件来直接生成网站，结构稳定后不应该有额外的修改工作。

> MarkText 0.17.1能大部分满足上述需求，但存在以下几点比较严重的问题：

1. 自2022-3-8后就没有再更新了，不支持Mermaid 中的 mindmap；
2. 全局的配置文件，不利于每个不同Ebook项目的个性化配置；
3. 用于存储图片的相对路径图像文件夹支持的预置变量太少，不能满足复杂结构项目的需求；

## 更新历史
> 感谢[Ran Luo](https://github.com/Jocs)及其他贡献者的贡献，您如果喜欢原始的MarkText，请访问[原始仓库](https://github.com/marktext/marktext)

- v1.0.4 (2026-05-14)
  - 新增**用户自定义主题**支持：将 `.css` 主题文件放入用户数据目录下的 `themes/` 文件夹（Windows 路径为 `%APPDATA%\MarkText\themes\`），重启或在"偏好设置 → 主题"中点击"重新加载"即可生效
  - 偏好设置面板新增"打开文件夹"与"重新加载"按钮；主题菜单与设置卡片均会自动列出用户主题
  - 自定义主题支持文件首部元数据注释 `/* @name 显示名 */` 和 `/* @type light|dark */`，详见首次启动自动生成的 `themes/README.md`
  - 新增 3 个现代化内置主题：
    - **Minimalist**：纯净留白 + 衬线字体的极简书写界面
    - **Frosted Glass**：极光渐变背景 + `backdrop-filter` 毛玻璃面板
    - **macOS**：SF Pro 系统字体 + 系统蓝强调色 + Safari 风格胶囊标签页
  - 构建脚手架：`electron-builder.yml` 加入 `npmRebuild: false`，打包时直接使用 `node_modules` 中已存在的原生模块二进制，避免本机缺少 Visual Studio Spectre 缓解库时打包失败（升级 Electron 后需手动跑 `electron-builder install-app-deps`）
- v1.0.1 (2026-04-20)
  - 修复打开文件未编辑即被标记为"未保存"的问题
  - Mermaid 升级至 10.9.5，修复流程图文字不显示的问题
  - 移除不再需要的 `@mermaid-js/mermaid-mindmap` 插件（mindmap 已合入 mermaid 主线）
  - 修复 snabbdom、mermaid 等 ESM 模块在 Electron 中的兼容性问题
  - 修复 cytoscape 模块 exports 解析失败导致构建报错的问题
  - Windows 构建目标调整为仅 x64
  - 详细开发日志见 [develop.md](./develop.md)
- v1.0.0beta发布，包含win_x64、MacOS x64、Arm64等版本；

## 已实现特色

- 优化样式，提升空间利用率及操作体验；

- Mermaid 升级至 10.9.5，内置支持 mindmap、flowchart 等全部图表类型；

- 修改为中文版本，感谢[chinayangxiaowei](https://github.com/chinayangxiaowei/marktext-chinese-language-pack)提供的思路；

- 类似于vscode工作区，打开不同的目录可以应用不同的设置，folder settings 文件名为marktext.json；

  > 例如针对文件夹

  ```json
  {
    "imageRelativeDirectoryName": "${fileWorkspaceFolder}/markdown/_images/${relativeFileDirname}/${fileBasenameNoExtension}",
    "imagePreferRelativeDirectory": true,
    "imageInsertAction": "folder",
    "theme": "one-dark"
  }
  ```

- 优化剪贴板图片的复制的处理，可以通过多个预置变量来个性化图片的本地存储路径；

  | 变量名                       | 说明                           |
  | ------------------------- | ---------------------------- |
  | {filename}                | 不包含扩展名                       |
  | {fileBasenameNoExtension} | 同filename，用于与vscode变量兼容      |
  | {fileWorkspaceFolder}     | 当前打开的项目目录，与vscode变量兼容        |
  | {relativeFileDirname}     | 当前文件相对项目根目录的相对路径，与vscode变量兼容 |

## 截图
- Mindmap
<img src="./assets/README/2023-02-20-17-10-10-image.png" title="" alt="" width="930">
- 更多的预置变量
<img src="./assets/README/2023-02-20-17-10-56-image.png" title="" alt="" width="931">
