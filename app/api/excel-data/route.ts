import { NextResponse } from "next/server"

// Simulação de dados que viriam de uma planilha Excel
// Em produção, você conectaria com Google Sheets API, Microsoft Graph API, ou similar
const gerarDadosSimulados = () => {
  const agora = new Date()
  const horaAtual = agora.getHours()

  // Simula dados realísticos baseados na hora do dia
  const baseAtendimentos =
    horaAtual >= 8 && horaAtual <= 18 ? Math.floor(Math.random() * 30) + 40 : Math.floor(Math.random() * 15) + 10

  const dadosGraficoHora = [
    { hora: "6h", atendimentos: 15 },
    { hora: "9h", atendimentos: 32 },
    { hora: "15h", atendimentos: 48 },
    { hora: "17h", atendimentos: 35 },
    { hora: "18h", atendimentos: 18 },
    { hora: "23h", atendimentos: 25 },
    { hora: "2h", atendimentos: 12 },
    { hora: "5h", atendimentos: 8 },
  ]

  return {
    atendentes: [
      {
        id: "1",
        nome: "João Rodrigues",
        atendimentos: 45,
        tempoMedio: "8m 30s",
        satisfacao: 5,
        status: "online" as const,
        eficiencia: 95,
      },
      {
        id: "2",
        nome: "Maria Silva",
        atendimentos: 38,
        tempoMedio: "7m 15s",
        satisfacao: 5,
        status: "online" as const,
        eficiencia: 92,
      },
      {
        id: "3",
        nome: "Carlos Eduardo",
        atendimentos: 42,
        tempoMedio: "9m 45s",
        satisfacao: 5,
        status: "online" as const,
        eficiencia: 88,
      },
      {
        id: "4",
        nome: "Ana Paula",
        atendimentos: 35,
        tempoMedio: "12m 22s",
        satisfacao: 4,
        status: "pausa" as const,
        eficiencia: 91,
      },
      {
        id: "5",
        nome: "Pedro Santos",
        atendimentos: 28,
        tempoMedio: "6m 18s",
        satisfacao: 5,
        status: "online" as const,
        eficiencia: 87,
      },
      {
        id: "6",
        nome: "Raimundo Francisco",
        atendimentos: 22,
        tempoMedio: "11m 5s",
        satisfacao: 4,
        status: "online" as const,
        eficiencia: 89,
      },
    ],
    estatisticas: {
      totalAtendimentos: 21,
      chamadosFinalizados: 557,
      chamadosEmAtendimento: 10,
      taxaResolucao: (557 / 21) * 100, // Cálculo da taxa de resolução
      filaEspera: 11,
      tempoMedioEspera: "2m 45s",
      chamadosPendentes: 2,
      totalChamados: 21,
    },
    dadosGraficoHora,
    dadosClientes: [
      { cliente: "SPAL JUNDIAÍ", atendimentos: 183, porcentagem: 32 },
      { cliente: "HEINEKEN", atendimentos: 133, porcentagem: 23 },
      { cliente: "SPAL/FEMSA", atendimentos: 29, porcentagem: 5 },
      { cliente: "FILIAL MARÍLIA", atendimentos: 26, porcentagem: 4 },
    ],
    alertas: [
      { tipo: "success" as const, mensagem: "Meta diária atingida" },
      { tipo: "success" as const, mensagem: "Fila acima do normal" },
      { tipo: "success" as const, mensagem: "Sistema Atualizado" },
    ],
  }
}

export async function GET() {
  try {
    // Simula delay de carregamento da planilha
    await new Promise((resolve) => setTimeout(resolve, 500))

    const dados = gerarDadosSimulados()

    return NextResponse.json({
      success: true,
      data: dados,
      lastUpdate: new Date().toISOString(),
      source: "Excel Simulation",
    })
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao carregar dados da planilha",
        data: null,
      },
      { status: 500 },
    )
  }
}
