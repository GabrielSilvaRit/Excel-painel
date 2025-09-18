import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Upload para Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Processar Excel
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer)

    // Processar cada aba conforme a estrutura definida
    const dashboardData = processExcelData(workbook)

    return NextResponse.json({
      success: true,
      blobUrl: blob.url,
      data: dashboardData,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar arquivo" }, { status: 500 })
  }
}

function processExcelData(workbook: XLSX.WorkBook) {
  // Processar aba "Métricas Gerais"
  const metricas = XLSX.utils.sheet_to_json(workbook.Sheets["Métricas Gerais"])

  // Processar aba "Atendimentos por Hora"
  const atendimentosHora = XLSX.utils.sheet_to_json(workbook.Sheets["Atendimentos por Hora"])

  // Processar aba "Atendentes"
  const atendentes = XLSX.utils.sheet_to_json(workbook.Sheets["Atendentes"])

  // Processar aba "Clientes"
  const clientes = XLSX.utils.sheet_to_json(workbook.Sheets["Clientes"])

  return {
    metricas: metricas[0], // Primeira linha com as métricas
    atendimentosHora,
    atendentes,
    clientes,
    lastUpdate: new Date().toISOString(),
  }
}
