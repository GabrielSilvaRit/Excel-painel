// Biblioteca para leitura de arquivos Excel no Vercel
export interface ExcelData {
  atendentes: Array<{
    id: string
    nome: string
    status: "online" | "pausa" | "offline"
    atendimentos: number
    tempoMedio: string
    satisfacao: number
  }>
  estatisticas: {
    totalAtendimentos: number
    chamadosFinalizados: number
    chamadosEmAtendimento: number
    taxaResolucao: number
    filaEspera: number
    tempoMedioEspera: string
  }
  dadosGraficoHora: Array<{
    hora: string
    atendimentos: number
  }>
  dadosClientes: Array<{
    cliente: string
    atendimentos: number
    porcentagem: number
  }>
}

export async function lerDadosExcel(): Promise<ExcelData> {
  // Em produção, você usaria uma biblioteca como 'xlsx' para ler o arquivo Excel
  // Por enquanto, retornamos dados simulados que correspondem à estrutura esperada

  return {
    atendentes: [
      { id: "1", nome: "João Rodrigues", status: "online", atendimentos: 45, tempoMedio: "8m 30s", satisfacao: 5 },
      { id: "2", nome: "Maria Silva", status: "online", atendimentos: 38, tempoMedio: "7m 15s", satisfacao: 5 },
      { id: "3", nome: "Carlos Eduardo", status: "online", atendimentos: 42, tempoMedio: "9m 45s", satisfacao: 5 },
      { id: "4", nome: "Ana Paula", status: "pausa", atendimentos: 35, tempoMedio: "12m 22s", satisfacao: 4 },
      { id: "5", nome: "Pedro Santos", status: "online", atendimentos: 28, tempoMedio: "6m 18s", satisfacao: 5 },
      { id: "6", nome: "Raimundo Francisco", status: "online", atendimentos: 22, tempoMedio: "11m 5s", satisfacao: 4 },
    ],
    estatisticas: {
      totalAtendimentos: 21,
      chamadosFinalizados: 557,
      chamadosEmAtendimento: 10,
      taxaResolucao: (557 / 21) * 100, // Cálculo da taxa de resolução
      filaEspera: 11,
      tempoMedioEspera: "2m 45s",
    },
    dadosGraficoHora: [
      { hora: "6h", atendimentos: 15 },
      { hora: "9h", atendimentos: 32 },
      { hora: "15h", atendimentos: 48 },
      { hora: "17h", atendimentos: 35 },
      { hora: "18h", atendimentos: 18 },
      { hora: "23h", atendimentos: 25 },
      { hora: "2h", atendimentos: 12 },
      { hora: "5h", atendimentos: 8 },
    ],
    dadosClientes: [
      { cliente: "SPAL JUNDIAÍ", atendimentos: 183, porcentagem: 32 },
      { cliente: "HEINEKEN", atendimentos: 133, porcentagem: 23 },
      { cliente: "SPAL/FEMSA", atendimentos: 29, porcentagem: 5 },
      { cliente: "FILIAL MARÍLIA", atendimentos: 26, porcentagem: 4 },
    ],
  }
}
