import { GoogleGenAI } from '@google/genai'
import { fetchHeadToHead } from './openfootball.js'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

// Recebe lista de nomes de times em inglês e retorna mapeamento com nome em PT e emoji de bandeira.
// Tarefa pequena (~48 nomes) → resposta em 2-4s.
export async function enrichTeams(teamNames) {
  const prompt = `Para cada seleção da lista abaixo, retorne um objeto JSON com o nome em português e o emoji da bandeira do país.
Lista: ${JSON.stringify(teamNames)}
Formato de retorno: { "NomeEmIngles": { "pt": "NomeEmPortugues", "emoji": "🏳️" }, ... }
Retorne APENAS o JSON, sem explicações, sem markdown.`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: { temperature: 0 },
    contents: prompt,
  })

  const text = (response.text ?? '').trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Gemini não retornou mapeamento de times válido')
  return JSON.parse(jsonMatch[0])
}

export async function analyzeMatch(teamA, teamB) {
  const h2hMatches = await fetchHeadToHead(teamA, teamB)

  let dadosReais = ''
  if (h2hMatches && h2hMatches.length > 0) {
    dadosReais = `\n\nDADOS REAIS VERIFICADOS — confrontos entre ${teamA} e ${teamB} em Copas do Mundo (fonte: OpenFootball):\n`
    dadosReais += h2hMatches.map(m => {
      const score = m.score ? `${m.score[0]}-${m.score[1]}` : 'placar não disponível'
      return `- ${m.competition} (${m.date}): ${m.team1} ${score} ${m.team2} [${m.round}]`
    }).join('\n')
    dadosReais += `\nTotal de confrontos confirmados em Copas do Mundo: ${h2hMatches.length}`
  } else if (h2hMatches !== null) {
    dadosReais = `\n\nDADOS VERIFICADOS: ${teamA} e ${teamB} NUNCA se enfrentaram em Copas do Mundo (fonte: OpenFootball, registros de 1930 a 2022).`
  }

  const prompt = `Você é um analista esportivo especializado em futebol internacional. Forneça uma análise completa e FIEL do histórico entre ${teamA} e ${teamB}.
${dadosReais}

Com base nos dados verificados acima (para Copa do Mundo) e no seu conhecimento de Copa América, Eliminatórias e amistosos, retorne APENAS este objeto JSON (sem markdown):
{
  "total_jogos": <total de jogos em TODAS as competições, inteiro>,
  "vitorias_a": <vitórias de ${teamA} em todas as competições, inteiro>,
  "vitorias_b": <vitórias de ${teamB} em todas as competições, inteiro>,
  "empates": <empates em todas as competições, inteiro>,
  "gols_a": <total de gols de ${teamA} em todas as competições ou null se incerto>,
  "gols_b": <total de gols de ${teamB} em todas as competições ou null se incerto>,
  "ultima_copa": "<use os dados verificados acima para descrever o último confronto em Copa do Mundo com ano e placar exato; se não há dados verificados, use seu conhecimento>",
  "probabilidade_a": <inteiro 0-100 baseado no histórico real>,
  "probabilidade_empate": <inteiro 0-100>,
  "probabilidade_b": <inteiro 0-100>,
  "placar_sugerido": "<placar mais provável baseado na média histórica de gols>",
  "analise": "<2 a 3 frases factuais sobre a rivalidade usando os dados verificados e o contexto atual das seleções>"
}

REGRAS: probabilidade_a + probabilidade_empate + probabilidade_b = 100. Os dados de Copa do Mundo fornecidos acima são fatos — não os altere.`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: { temperature: 0 },
    contents: prompt,
  })

  const text = (response.text ?? '').trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Gemini não retornou análise válida')
  return JSON.parse(jsonMatch[0])
}
