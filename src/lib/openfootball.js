const PT_TO_EN = {
  'Afeganistão': 'Afghanistan', 'Albânia': 'Albania', 'Argélia': 'Algeria',
  'Angola': 'Angola', 'Argentina': 'Argentina', 'Armênia': 'Armenia',
  'Austrália': 'Australia', 'Áustria': 'Austria', 'Azerbaijão': 'Azerbaijan',
  'Bahrain': 'Bahrain', 'Bélgica': 'Belgium', 'Bielorrússia': 'Belarus',
  'Bolívia': 'Bolivia', 'Bósnia e Herzegovina': 'Bosnia-Herzegovina',
  'Brasil': 'Brazil', 'Bulgária': 'Bulgaria', 'Camarões': 'Cameroon',
  'Canadá': 'Canada', 'Chile': 'Chile', 'China': 'China',
  'Colômbia': 'Colombia', 'Congo': 'Congo', 'Coreia do Norte': 'North Korea',
  'Coreia do Sul': 'South Korea', 'Costa do Marfim': 'Ivory Coast',
  'Costa Rica': 'Costa Rica', 'Croácia': 'Croatia', 'Cuba': 'Cuba',
  'Dinamarca': 'Denmark', 'Egito': 'Egypt', 'Emirados Árabes': 'UAE',
  'Equador': 'Ecuador', 'Escócia': 'Scotland', 'Eslováquia': 'Slovakia',
  'Eslovênia': 'Slovenia', 'Espanha': 'Spain', 'Estados Unidos': 'United States',
  'Etiópia': 'Ethiopia', 'Finlândia': 'Finland', 'França': 'France',
  'Gabão': 'Gabon', 'Gana': 'Ghana', 'Geórgia': 'Georgia',
  'Alemanha': 'Germany', 'Grécia': 'Greece', 'Guatemala': 'Guatemala',
  'Honduras': 'Honduras', 'Hungria': 'Hungary', 'Índia': 'India',
  'Indonésia': 'Indonesia', 'Inglaterra': 'England', 'Irã': 'Iran',
  'Iraque': 'Iraq', 'Irlanda': 'Ireland', 'Irlanda do Norte': 'Northern Ireland',
  'Israel': 'Israel', 'Itália': 'Italy', 'Jamaica': 'Jamaica',
  'Japão': 'Japan', 'Jordânia': 'Jordan', 'Kuwait': 'Kuwait',
  'Mali': 'Mali', 'Marrocos': 'Morocco', 'México': 'Mexico',
  'Nigéria': 'Nigeria', 'Noruega': 'Norway', 'Nova Zelândia': 'New Zealand',
  'Países Baixos': 'Netherlands', 'Holanda': 'Netherlands',
  'País de Gales': 'Wales', 'Panamá': 'Panama', 'Paraguai': 'Paraguay',
  'Peru': 'Peru', 'Polônia': 'Poland', 'Portugal': 'Portugal',
  'República Tcheca': 'Czech Republic', 'Romênia': 'Romania',
  'Rússia': 'Russia', 'Arábia Saudita': 'Saudi Arabia',
  'Senegal': 'Senegal', 'Sérvia': 'Serbia', 'África do Sul': 'South Africa',
  'Suécia': 'Sweden', 'Suíça': 'Switzerland', 'Togo': 'Togo',
  'Trinidad e Tobago': 'Trinidad and Tobago', 'Tunísia': 'Tunisia',
  'Turquia': 'Turkey', 'Ucrânia': 'Ukraine', 'Uruguai': 'Uruguay',
  'Venezuela': 'Venezuela', 'Zâmbia': 'Zambia',
}

const WC_YEARS = [
  1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966,
  1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998,
  2002, 2006, 2010, 2014, 2018, 2022,
]

async function fetchWCMatches(year, enA, enB) {
  const url = `https://raw.githubusercontent.com/openfootball/worldcup.json/master/${year}/worldcup.json`
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return (data.matches ?? [])
      .filter(m => (m.team1 === enA && m.team2 === enB) || (m.team1 === enB && m.team2 === enA))
      .map(m => ({
        competition: `Copa do Mundo ${year}`,
        date: m.date,
        round: m.round ?? '',
        team1: m.team1,
        team2: m.team2,
        score: m.score?.ft ?? null,
      }))
  } catch {
    return []
  }
}

export async function fetchHeadToHead(teamAPt, teamBPt) {
  const enA = PT_TO_EN[teamAPt]
  const enB = PT_TO_EN[teamBPt]
  if (!enA || !enB) return null

  const results = await Promise.all(WC_YEARS.map(year => fetchWCMatches(year, enA, enB)))
  return results.flat()
}
