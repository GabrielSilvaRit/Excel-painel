export interface Atendente {
  id: number
  nome: string
  atendimentos: number
  tempoMedio: string
  satisfacao: number
  status: "online" | "ocupado" | "pausa"
  eficiencia: number
}

export interface Estatisticas {
  totalAtendimentos: number
  chamadosFinalizados: number
  chamadosEmAtendimento: number
  taxaResolucao: number
  filaEspera: number
  tempoMedioEspera: string
  chamadosPendentes: number
  totalChamados: number
}

export interface DadosGraficoHora {
  hora: string
  atendimentos: number
}

export interface DadosCliente {
  cliente: string
  atendimentos: number
  porcentagem: number
}

export interface Pendencia {
  protocolo: string
  cliente: string
  titulo: string
  solicitante: string
  abertura: string
}

export interface Alerta {
  tipo: "success" | "warning" | "error"
  mensagem: string
}

export interface DashboardData {
  atendentes: Atendente[]
  estatisticas: Estatisticas
  dadosGraficoHora: DadosGraficoHora[]
  dadosClientes: DadosCliente[]
  pendencias: Pendencia[]
  alertas: Alerta[]
  outrosSetores?: number
}
