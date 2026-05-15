const OPENFOOTBALL_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

const PHASE_MAP = {
  'Matchday 1': 'group',
  'Matchday 2': 'group',
  'Matchday 3': 'group',
  'Round of 32': 'round_of_16',
  'Round of 16': 'round_of_16',
  'Quarter-finals': 'quarter',
  'Semi-finals': 'semi',
  'Third place': 'semi',
  'Final': 'final',
}

// Converte "13:00 UTC-6" + "2026-06-11" para ISO 8601 no horário de Brasília (UTC-3)
function toMatchDate(dateStr, timeStr) {
  if (!timeStr) return `${dateStr}T00:00:00`
  const timeMatch = timeStr.match(/^(\d{2}):(\d{2})\s*UTC([+-]\d+)$/)
  if (!timeMatch) return `${dateStr}T00:00:00`
  const [, hh, mm, offsetStr] = timeMatch
  const offsetHours = parseInt(offsetStr, 10)
  const utcDate = new Date(`${dateStr}T${hh}:${mm}:00`)
  utcDate.setHours(utcDate.getHours() - offsetHours) // converte para UTC
  utcDate.setHours(utcDate.getHours() - 3)           // UTC → Brasília (UTC-3)
  const y = utcDate.getFullYear()
  const mo = String(utcDate.getMonth() + 1).padStart(2, '0')
  const d = String(utcDate.getDate()).padStart(2, '0')
  const h = String(utcDate.getHours()).padStart(2, '0')
  const mi = String(utcDate.getMinutes()).padStart(2, '0')
  return `${y}-${mo}-${d}T${h}:${mi}:00`
}

export async function fetchWorldCupMatches() {
  const res = await fetch(OPENFOOTBALL_URL)
  if (!res.ok) throw new Error(`Erro ao buscar jogos da Copa: HTTP ${res.status}`)
  const data = await res.json()

  const matches = data.matches ?? []
  return matches
    .filter(m => m.team1 && m.team2)
    .map(m => ({
      team1: m.team1,
      team2: m.team2,
      match_date: toMatchDate(m.date, m.time),
      phase: PHASE_MAP[m.round] ?? 'group',
      group_name: m.group ? m.group.replace('Group ', '') : null,
    }))
}
