// Os horários dos jogos são salvos sem o offset de fuso (UTC-3 implícito);
// por isso somamos 3h ao exibir para corrigir para o horário de Brasília.
export function formatDate(dt, opts = { dateStyle: 'short', timeStyle: 'short' }) {
  if (!dt) return ''
  const date = new Date(dt)
  date.setHours(date.getHours() + 3)
  return date.toLocaleString('pt-BR', opts)
}

export function useDateFormat() {
  return { formatDate }
}
