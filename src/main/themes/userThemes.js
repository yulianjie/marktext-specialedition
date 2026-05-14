import fs from 'fs'
import path from 'path'
import { shell } from 'electron'
import log from 'electron-log'

const USER_THEMES_DIR_NAME = 'themes'
const README_FILE_NAME = 'README.md'
const THEME_FILE_EXT = '.css'
// Maximum CSS file size (1 MB) to avoid loading garbage / accidental binary files.
const MAX_THEME_FILE_SIZE = 1024 * 1024

const README_CONTENT = `# 自定义主题

将你的主题 CSS 文件放在该文件夹下（扩展名 \`.css\`），重启 MarkText 后即可在「偏好设置 → 主题」中选择。

## 文件名 = 主题 ID

例如 \`my-theme.css\` 会被识别为 ID \`my-theme\`。

## 可选元数据（写在文件首行）

\`\`\`css
/* @name 我的极简主题 */
/* @type dark */
\`\`\`

- \`@name\`：在菜单/设置中显示的名称（缺省时回退为文件名）
- \`@type\`：\`light\` 或 \`dark\`（控制图标色调与代码高亮主题，缺省 \`light\`）

## 可用的 CSS 变量

主题通过覆盖 \`:root\` 上的 CSS 变量生效，关键变量包括：

\`\`\`
--editorColor        正文文字颜色
--editorBgColor      编辑区背景
--sideBarBgColor     侧边栏背景
--sideBarColor       侧边栏文字
--themeColor         主题强调色（按钮、链接、光标）
--codeBlockBgColor   代码块背景
--floatBgColor       浮层背景
--floatShadow        浮层阴影
\`\`\`

完整变量列表可参考内置主题文件（dark/light/graphite 等）的源码。
`

class UserThemes {
  constructor (userDataPath) {
    this.themesDir = path.join(userDataPath, USER_THEMES_DIR_NAME)
    this._cache = null
  }

  ensureDir () {
    if (!fs.existsSync(this.themesDir)) {
      try {
        fs.mkdirSync(this.themesDir, { recursive: true })
        fs.writeFileSync(path.join(this.themesDir, README_FILE_NAME), README_CONTENT, 'utf8')
      } catch (err) {
        log.error('Failed to create user themes directory:', err)
      }
    }
  }

  getDir () {
    return this.themesDir
  }

  openDir () {
    this.ensureDir()
    shell.openPath(this.themesDir).catch(err => log.error('openPath failed:', err))
  }

  /**
   * Scan the themes directory and return a list of user themes.
   * Each item: { id, name, type ('light'|'dark'), css }
   */
  list ({ refresh = false } = {}) {
    if (this._cache && !refresh) return this._cache
    this.ensureDir()
    const out = []
    try {
      const entries = fs.readdirSync(this.themesDir, { withFileTypes: true })
      for (const ent of entries) {
        if (!ent.isFile()) continue
        if (path.extname(ent.name).toLowerCase() !== THEME_FILE_EXT) continue
        const fullPath = path.join(this.themesDir, ent.name)
        try {
          const stat = fs.statSync(fullPath)
          if (stat.size > MAX_THEME_FILE_SIZE) {
            log.warn(`Skip user theme (too large): ${ent.name}`)
            continue
          }
          const css = fs.readFileSync(fullPath, 'utf8')
          const id = path.basename(ent.name, THEME_FILE_EXT)
          const meta = parseMetadata(css)
          out.push({
            id,
            name: meta.name || id,
            type: meta.type === 'dark' ? 'dark' : 'light',
            css
          })
        } catch (err) {
          log.error(`Failed to read user theme ${ent.name}:`, err)
        }
      }
    } catch (err) {
      log.error('Failed to list user themes:', err)
    }
    // Stable order by id
    out.sort((a, b) => a.id.localeCompare(b.id))
    this._cache = out
    return out
  }

  invalidate () {
    this._cache = null
  }
}

const META_PATTERN = /\/\*\s*@(\w+)\s+([^*]+?)\s*\*\//g

function parseMetadata (css) {
  // Only scan the first 4KB to be safe
  const header = css.slice(0, 4096)
  const meta = {}
  let m
  META_PATTERN.lastIndex = 0
  while ((m = META_PATTERN.exec(header)) !== null) {
    const key = m[1].toLowerCase()
    const value = m[2].trim()
    if (!(key in meta)) meta[key] = value
  }
  return meta
}

export default UserThemes
