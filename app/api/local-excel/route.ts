import { NextResponse } from "next/server"
import * as XLSX from "xlsx"
import fs from "fs/promises"
import path from "path"

// Caminho padrão para o arquivo Excel - pode ser configurado via variável de ambiente
const DEFAULT_EXCEL_PATH = process.env.EXCEL_FILE_PATH || "C:\\Temp\\dados-atendimentos.xlsx"

export async function GET() {
  try {
    // Verificar se o arquivo existe
    try {
      await fs.access(DEFAULT_EXCEL_PATH)
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: `Arquivo Excel não encontrado em: ${DEFAULT_EXCEL_PATH}`,
          suggestion: "Configure a variável EXCEL_FILE_PATH ou coloque o arquivo na pasta raiz do projeto",
        },
        { status: 404 }
      )
    }

    // Ler o arquivo Excel
    const fileBuffer = await fs.readFile(DEFAULT_EXCEL_PATH)
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' })

    // Processar os dados conforme a estrutura esperada
    const dashboardData = processExcelData(workbook)

    return NextResponse.json({
      success: true,
      data: dashboardData,
      lastUpdate: new Date().toISOString(),
      source: "Local Excel File",
      filePath: DEFAULT_EXCEL_PATH,
    })
  } catch (error) {
    console.error("Erro ao ler arquivo Excel local:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar arquivo Excel local",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}

function processExcelData(workbook: XLSX.WorkBook) {
  // Tenta encontrar as abas pelo nome ou usa padrão
  const sheetNames = workbook.SheetNames
  
  // Procurar por abas com nomes comuns
  const metricasSheet = sheetNames.find(name => 
    name.toLowerCase().includes('métrica') || name.toLowerCase().includes('geral')
  ) || sheetNames[0]
  
  const atendentesSheet = sheetNames.find(name => 
    name.toLowerCase().includes('atendente') || name.toLowerCase().includes('agente')
  ) || (sheetNames[1] || sheetNames[0])
  
  const horaSheet = sheetNames.find(name => 
    name.toLowerCase().includes('hora') || name.toLowerCase().includes('tempo')
  ) || (sheetNames[2] || sheetNames[0])
  
  const clientesSheet = sheetNames.find(name => 
    name.toLowerCase().includes('cliente') || name.toLowerCase().includes('empresa')
  ) || (sheetNames[3] || sheetNames[0])
  
  const pendenciasSheet = sheetNames.find(name => 
    name.toLowerCase().includes('pendência') || name.toLowerCase().includes('pendencias') || name.toLowerCase().includes('chamado')
  ) || (sheetNames[4] || sheetNames[0])

  // Converter para JSON - usando tipo any para flexibilidade
  const metricas: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[metricasSheet])
  const atendentes: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[atendentesSheet])
  const atendimentosHora: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[horaSheet])
  const clientes: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[clientesSheet])
  const pendencias: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[pendenciasSheet])
  const outrosSetores: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['Outros Setores'] || {});

  // Mapear para a estrutura esperada pelo dashboard
  return {
    atendentes: atendentes.map((at: any, index) => ({
      id: at.id || at.ID || `temp-${index + 1}`,
      nome: at.nome || at.Nome || at.ATENDENTE || `Atendente ${index + 1}`,
      atendimentos: parseInt(at.atendimentos || at.Atendimentos || at.QTD || 0),
      tempoMedio: at.tempoMedio || at['Tempo Médio'] || at.TEMPO || '0m 0s',
      satisfacao: parseInt(at.satisfacao || at.Satisfação || at.NPS || 5),
      status: (at.status || at.Status || 'online').toLowerCase(),
      eficiencia: parseInt(at.eficiencia || at.Eficiência || at.EFF || 90)
    })),

    estatisticas: {
      totalAtendimentos: parseInt(metricas[0]?.totalAtendimentos || metricas[0]?.TOTAL || 0),
      chamadosFinalizados: parseInt(metricas[0]?.chamadosFinalizados || metricas[0]?.FINALIZADOS || 0),
      chamadosEmAtendimento: parseInt(metricas[0]?.chamadosEmAtendimento || metricas[0]?.EM_ATENDIMENTO || 0),
      taxaResolucao: ((parseInt(metricas[0]?.chamadosFinalizados || metricas[0]?.FINALIZADOS || 0)) / (parseInt(metricas[0]?.totalAtendimentos || metricas[0]?.TOTAL || 0))) * 100 || 0,
      filaEspera: parseInt(metricas[0]?.filaEspera || metricas[0]?.FILA || 0),
      tempoMedioEspera: metricas[0]?.tempoMedioEspera || metricas[0]?.TEMPO_ESPERA || '0m 0s',
      chamadosPendentes: parseInt(metricas[0]?.chamadosPendentes || metricas[0]?.PENDENTES || 0),
      totalChamados: parseInt(metricas[0]?.totalChamados || metricas[0]?.TOTAL_CHAMADOS || 0)
    },

    dadosGraficoHora: atendimentosHora.map((h: any) => ({
      hora: h.hora || h.Hora || h.HORARIO || '',
      atendimentos: parseInt(h.atendimentos || h.Atendimentos || h.QTD || 0)
    })),

    dadosClientes: clientes.map((c: any) => ({
      cliente: c.cliente || c.Cliente || c.EMPRESA || '',
      atendimentos: parseInt(c.atendimentos || c.Atendimentos || c.QTD || 0),
      porcentagem: parseFloat(c.porcentagem || c.Porcentagem || c['%'] || 0)
    })),

    pendencias: pendencias.map((p: any) => ({
      protocolo: p.protocolo || p.Protocolo || p.CODIGO || '',
      cliente: p.cliente || p.Cliente || p.EMPRESA || '',
      titulo: p.titulo || p.Título || p.DESCRICAO || '',
      solicitante: p.solicitante || p.Solicitante || p.EMAIL || '',
      abertura: p.abertura || p.Abertura || p.DATA_ABERTURA || new Date().toLocaleString('pt-BR')
    })),

    alertas: [
      { tipo: "success", mensagem: "Dados carregados do arquivo local" },
      { tipo: "success", mensagem: `Arquivo: ${DEFAULT_EXCEL_PATH}` },
      { tipo: "success", mensagem: `Atualizado: ${new Date().toLocaleString('pt-BR')}` }
    ],
    outrosSetores: outrosSetores.length > 0 ? parseInt(outrosSetores[0]?.atendimentos || outrosSetores[0]?.Atendimentos || 0) : 0
  }
}
