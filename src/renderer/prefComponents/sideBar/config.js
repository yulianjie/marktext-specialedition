import GeneralIcon from '@/assets/icons/pref_general.svg'
import EditorIcon from '@/assets/icons/pref_editor.svg'
import MarkdownIcon from '@/assets/icons/pref_markdown.svg'
import ThemeIcon from '@/assets/icons/pref_theme.svg'
import ImageIcon from '@/assets/icons/pref_image.svg'
import SpellIcon from '@/assets/icons/pref_spellcheck.svg'
import KeyBindingIcon from '@/assets/icons/pref_key_binding.svg'

import preferences from '../../../main/preferences/schema'

export const buildCategory = t => [{
  name: t('sidebar.categories.general'),
  label: 'general',
  icon: GeneralIcon,
  path: '/preference/general'
}, {
  name: t('sidebar.categories.editor'),
  label: 'editor',
  icon: EditorIcon,
  path: '/preference/editor'
}, {
  name: t('sidebar.categories.markdown'),
  label: 'markdown',
  icon: MarkdownIcon,
  path: '/preference/markdown'
}, {
  name: t('sidebar.categories.spelling'),
  label: 'spelling',
  icon: SpellIcon,
  path: '/preference/spelling'
}, {
  name: t('sidebar.categories.theme'),
  label: 'theme',
  icon: ThemeIcon,
  path: '/preference/theme'
}, {
  name: t('sidebar.categories.image'),
  label: 'image',
  icon: ImageIcon,
  path: '/preference/image'
}, {
  name: t('sidebar.categories.keybindings'),
  label: 'keybindings',
  icon: KeyBindingIcon,
  path: '/preference/keybindings'
}]

const categoryLabels = ['general', 'editor', 'markdown', 'spelling', 'theme', 'image', 'keybindings']

export const searchContent = Object.keys(preferences).map(k => {
  const { description, enum: emums } = preferences[k]
  let [category, preference] = description.split('--')
  if (Array.isArray(emums)) {
    preference += ` optional values: ${emums.join(', ')}`
  }
  return {
    category,
    preference
  }
})
  .filter(({ category: ca }) => categoryLabels.includes(ca.toLowerCase()))
