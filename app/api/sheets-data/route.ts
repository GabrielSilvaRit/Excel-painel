import { NextResponse } from "next/server"

export async function GET() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY

    if (!SHEET_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuração do Google Sheets não encontrada" }, { status: 500 })
    }

    // Buscar dados de todas as abas necessárias
    const sheets = ["Métricas Gerais", "Atendimentos por Hora", "Atendentes", "Clientes"]
    const responses = await Promise.all(
      sheets.map((sheet) =>
        fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheet)}!A:Z?key=${API_KEY}`,
        ).then((res) => res.json()),
      ),
    )

    // Processar dados das métricas gerais
    const metricsData = responses[0].values || []
    const total = Number.parseInt(metricsData[1]?.[1] || "21")
    const finalizados = Number.parseInt(metricsData[2]?.[1] || "557")
    const metrics = {
      total,
      finalizados,
      emAtendimento: Number.parseInt(metricsData[3]?.[1] || "10"),
      resolucao: (finalizados / total) * 100, // Cálculo da taxa de resolução
      chamadosPendentes: Number.parseFloat(metricsData[5]?.[1] || "0.04"),
      eficienciaMedia: Number.parseFloat(metricsData[6]?.[1] || "89.2"),
      tempoMedio: metricsData[7]?.[1] || "18m 14s",
      picoDia: Number.parseInt(metricsData[8]?.[1] || "75"),
      filaAtual: Number.parseInt(metricsData[9]?.[1] || "11"),
      filaEspera: Number.parseInt(metricsData[10]?.[1] || "11"),
      tempoMedioEspera: metricsData[11]?.[1] || "2m 45s",
    }

    // Processar dados do gráfico por hora
    const hourlyData = responses[1].values?.slice(1) || []
    const atendimentosPorHora = hourlyData.map((row) => ({
      hora: row[0] || "",
      atendimentos: Number.parseInt(row[1] || "0"),
    }))

    // Processar dados dos atendentes
    const attendantsData = responses[2].values?.slice(1) || []
    const atendentes = attendantsData.map((row, index) => ({
      id: index + 1,
      nome: row[0] || "",
      iniciais: row[1] || "",
      atendimentos: Number.parseInt(row[2] || "0"),
      tempoMedio: row[3] || "",
      rating: Number.parseInt(row[4] || "5"),
      online: row[5]?.toLowerCase() === "true",
    }))

    // Processar dados dos clientes
    const clientsData = responses[3].values?.slice(1) || []
    const clientes = clientsData.map((row) => ({
      nome: row[0] || "",
      atendimentos: Number.parseInt(row[1] || "0"),
      porcentagem: Number.parseFloat(row[2] || "0"),
      cor: row[3] || "#3b82f6",
    }))

    return NextResponse.json({
      metrics,
      atendimentosPorHora,
      atendentes,
      clientes,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao buscar dados do Google Sheets:", error)
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 })
  }
}
