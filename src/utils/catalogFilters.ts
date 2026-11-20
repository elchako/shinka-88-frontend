export const filterOptions = (values: unknown): string[] =>
  Array.isArray(values) ? [...new Set(values.filter((value): value is string => typeof value === 'string' && value.trim() !== ''))]
    .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true })) : []

export const tyreSeasonOptions = [
  { value: 'all', label: 'Все' }, { value: 'summer', label: 'Лето' }, { value: 'winter', label: 'Зима' },
] as const
export const tyreStuddingOptions = [
  { value: 'all', label: 'Все' }, { value: 'unstudded', label: 'Без шипов' }, { value: 'studded', label: 'С шипами' },
] as const
export type TyreSeason = typeof tyreSeasonOptions[number]['value']
export type TyreStudding = typeof tyreStuddingOptions[number]['value']

export const seasonValues = (values: unknown, season: TyreSeason): string[] => {
  if (season === 'all') return []
  const pattern = season === 'summer' ? /лет|summer/i : /зим|winter/i
  const found = filterOptions(values).filter(value => pattern.test(value))
  return found.length ? found : [season === 'summer' ? 'Летняя' : 'Зимняя']
}

export const classifyStudding = (value: string): TyreStudding | null => {
  const normalized = value.trim().toLowerCase()
  if (['ш.', 'ш', 'шипы', 'шипованная', 'шипованные', 'studded'].includes(normalized)) return 'studded'
  if (['_', 'н/ш.', 'н/ш', 'б/ш', 'без шипов', 'нешипованная', 'нешипованные', 'unstudded'].includes(normalized)) return 'unstudded'
  return null
}
export const studdingValues = (values: unknown, studding: TyreStudding): string[] => {
  if (studding === 'all') return []
  const found = filterOptions(values).filter(value => classifyStudding(value) === studding)
  return found.length ? found : studding === 'studded' ? ['Ш.'] : ['_', 'н/ш.']
}

export const diskTypeOptions = [
  { value: 'all', label: 'Все' }, { value: 'stamped', label: 'Штампованные' }, { value: 'alloy', label: 'Литые' },
] as const
export const classifyDiskType = (value: string): 'stamped' | 'alloy' | null => {
  if (/штамп|сталь|стальн|steel|stamp/i.test(value)) return 'stamped'
  if (/лит|алюм|alloy|cast/i.test(value)) return 'alloy'
  return null
}
