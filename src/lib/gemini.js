import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

// Recebe lista de nomes de times em inglês e retorna mapeamento com nome em PT e emoji de bandeira.
// Tarefa pequena (~48 nomes) → resposta em 2-4s.
export async function enrichTeams(teamNames) {
  const prompt = `Para cada seleção da lista abaixo, retorne um objeto JSON com o nome em português e o emoji da bandeira do país.
Lista: ${JSON.stringify(teamNames)}
Formato de retorno: { "NomeEmIngles": { "pt": "NomeEmPortugues", "emoji": "🏳️" }, ... }
Retorne APENAS o JSON, sem explicações, sem markdown.`

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: { temperature: 0 },
    contents: prompt,
  })

  const text = (response.text ?? '').trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Gemini não retornou mapeamento de times válido')
  return JSON.parse(jsonMatch[0])
}
