import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

export async function generateMatches(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  })

  const text = response.text ?? ''

  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\[[\s\S]*\])/)
  if (!jsonMatch) throw new Error('Gemini não retornou um JSON válido')

  return JSON.parse(jsonMatch[1])
}
