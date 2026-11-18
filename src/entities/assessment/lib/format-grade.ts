export const gradeFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })

export function formatGrade(grade: number) {
  return `${gradeFormat.format(grade)} ${grade === 1 ? 'ponto' : 'pontos'}`
}
