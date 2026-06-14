import { phaseMap } from '@/utils/phaseMap'

export function slugify(text) {
  return (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function gameSlug(game) {
  const phaseLabel = phaseMap[game.phase] ?? game.phase
  let slug = `${slugify(game.team_a)}-x-${slugify(game.team_b)}-${slugify(phaseLabel)}`
  if (game.phase === 'group' && game.group_name) {
    slug += `-grupo-${slugify(game.group_name)}`
  }
  return slug
}
