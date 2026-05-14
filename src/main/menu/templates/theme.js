import * as actions from '../actions/theme'

const BUILT_IN = [
  { id: 'light', label: 'Cadmium Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'graphite', label: 'Graphite Light' },
  { id: 'material-dark', label: 'Material Dark' },
  { id: 'one-dark', label: 'One Dark' },
  { id: 'ulysses', label: 'Ulysses Light' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'glass', label: 'Frosted Glass' },
  { id: 'macos', label: 'macOS' }
]

export default function (userPreference, userThemes = []) {
  const { theme } = userPreference.getAll()

  const submenu = BUILT_IN.map(t => ({
    label: t.label,
    type: 'radio',
    id: t.id,
    checked: theme === t.id,
    click () {
      actions.selectTheme(t.id)
    }
  }))

  if (userThemes.length > 0) {
    submenu.push({ type: 'separator' })
    for (const t of userThemes) {
      submenu.push({
        label: t.name || t.id,
        type: 'radio',
        id: t.id,
        checked: theme === t.id,
        click () {
          actions.selectTheme(t.id)
        }
      })
    }
  }

  return {
    label: '&Theme',
    id: 'themeMenu',
    submenu
  }
}
