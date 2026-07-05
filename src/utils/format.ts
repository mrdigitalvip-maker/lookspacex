export function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR')
}

export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  return parsedDate.toLocaleDateString('pt-BR')
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(amount)
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}…` : str
}
