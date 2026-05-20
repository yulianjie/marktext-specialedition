export const themes = [
  { name: 'light' },
  { name: 'dark' },
  { name: 'graphite' },
  { name: 'material-dark' },
  { name: 'ulysses' },
  { name: 'one-dark' },
  { name: 'minimalist' },
  { name: 'glass' },
  { name: 'macos' }
]

export const buildAutoSwitchThemeOptions = t => [{
  label: t('theme.autoSwitch.atStartup'),
  value: 0
}, /* {
  label: 'Only at runtime',
  value: 1
}, */ {
  label: t('theme.autoSwitch.never'),
  value: 2
}]
