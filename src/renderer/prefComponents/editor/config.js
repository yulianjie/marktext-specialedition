import { ENCODING_NAME_MAP } from 'common/encoding'

export const tabSizeOptions = [{
  label: '1',
  value: 1
}, {
  label: '2',
  value: 2
}, {
  label: '3',
  value: 3
}, {
  label: '4',
  value: 4
}]

export const buildEndOfLineOptions = t => [{
  label: t('editor.endOfLine.default'),
  value: 'default'
}, {
  label: t('editor.endOfLine.crlf'),
  value: 'crlf'
}, {
  label: t('editor.endOfLine.lf'),
  value: 'lf'
}]

export const buildTrimTrailingNewlineOptions = t => [{
  label: t('editor.trimTrailingNewline.trimAll'),
  value: 0
}, {
  label: t('editor.trimTrailingNewline.ensureOne'),
  value: 1
}, {
  label: t('editor.trimTrailingNewline.preserve'),
  value: 2
}, {
  label: t('editor.trimTrailingNewline.nothing'),
  value: 3
}]

export const buildTextDirectionOptions = t => [{
  label: t('editor.textDirection.ltr'),
  value: 'ltr'
}, {
  label: t('editor.textDirection.rtl'),
  value: 'rtl'
}]

let defaultEncodingOptions = null
export const getDefaultEncodingOptions = () => {
  if (defaultEncodingOptions) {
    return defaultEncodingOptions
  }

  defaultEncodingOptions = []
  for (const [value, label] of Object.entries(ENCODING_NAME_MAP)) {
    defaultEncodingOptions.push({ label, value })
  }
  return defaultEncodingOptions
}
