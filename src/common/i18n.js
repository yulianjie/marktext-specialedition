import enMessages from '../locales/en'
import zhCNMessages from '../locales/zh-CN'

const messages = {
  en: enMessages,
  'zh-CN': zhCNMessages
}

export const SUPPORTED_LOCALES = ['en', 'zh-CN']
export const DEFAULT_LOCALE = 'en'

export const normalizeLocale = locale => {
  if (!locale) return DEFAULT_LOCALE
  if (SUPPORTED_LOCALES.includes(locale)) return locale
  if (/^zh/i.test(locale)) return 'zh-CN'
  return DEFAULT_LOCALE
}

const lookup = (bag, key) => {
  const parts = key.split('.')
  let cur = bag
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = cur[p]
    } else {
      return undefined
    }
  }
  return typeof cur === 'string' ? cur : undefined
}

export const t = (key, locale = DEFAULT_LOCALE) => {
  const normalized = normalizeLocale(locale)
  return lookup(messages[normalized], key) ||
    lookup(messages[DEFAULT_LOCALE], key) ||
    key
}

export default { t, normalizeLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE }
