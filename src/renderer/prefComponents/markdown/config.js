export const bulletListMarkerOptions = [{
  label: '*',
  value: '*'
}, {
  label: '-',
  value: '-'
}, {
  label: '+',
  value: '+'
}]

export const orderListDelimiterOptions = [{
  label: '.',
  value: '.'
}, {
  label: ')',
  value: ')'
}]

export const buildPreferHeadingStyleOptions = t => [{
  label: t('markdown.preferHeadingStyle.atx'),
  value: 'atx'
}, {
  label: t('markdown.preferHeadingStyle.setext'),
  value: 'setext'
}]

export const buildListIndentationOptions = t => [{
  label: t('markdown.listIndentation.docFx'),
  value: 'dfm'
}, {
  label: t('markdown.listIndentation.tab'),
  value: 'tab'
}, {
  label: t('markdown.listIndentation.one'),
  value: 1
}, {
  label: t('markdown.listIndentation.two'),
  value: 2
}, {
  label: t('markdown.listIndentation.three'),
  value: 3
}, {
  label: t('markdown.listIndentation.four'),
  value: 4
}]

export const frontmatterTypeOptions = [{
  label: 'YAML',
  value: '-'
}, {
  label: 'TOML',
  value: '+'
}, {
  label: 'JSON (;;;)',
  value: ';'
}, {
  label: 'JSON ({})',
  value: '{'
}]

export const buildSequenceThemeOptions = t => [{
  label: t('markdown.sequenceTheme.hand'),
  value: 'hand'
}, {
  label: t('markdown.sequenceTheme.simple'),
  value: 'simple'
}]
