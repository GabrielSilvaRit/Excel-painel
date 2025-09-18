"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, User, Building, Mail, RefreshCw } from "lucide-react"

// Função para converter data no formato brasileiro para Date object
function parseDataBrasileira(dataStr: any): Date {
  // Verifica se dataStr é uma string válida antes de tentar split
  if (typeof dataStr !== 'string' || !dataStr) {
    // Se não for string ou estiver vazia, tenta parsear como Date ou retorna data atual
    try {
      const date = new Date(dataStr)
      if (!isNaN(date.getTime())) {
        return date
      }
    } catch (error) {
      // Se falhar, retorna data atual
    }
    return new Date()
  }
  
  // Tenta parsear o formato "dd/MM/yyyy HH:mm:ss"
  const partes = dataStr.split(' ')
  if (partes.length >= 2) {
    const dataPartes = partes[0].split('/')
    const horaPartes = partes[1].split(':')
    
    if (dataPartes.length === 3 && horaPartes.length >= 2) {
      const dia = parseInt(dataPartes[0])
      const mes = parseInt(dataPartes[1]) - 1 // Meses são 0-indexed no JavaScript
      const ano = parseInt(dataPartes[2])
      const hora = parseInt(horaPartes[0])
      const minuto = parseInt(horaPartes[1])
      const segundo = horaPartes.length > 2 ? parseInt(horaPartes[2]) : 0
      
      return new Date(ano, mes, dia, hora, minuto, segundo)
    }
  }
  
  // Fallback: tenta parsear como Date ISO
  const date = new Date(dataStr)
  if (!isNaN(date.getTime())) {
    return date
  }
  
  // Se não conseguir parsear, retorna data atual (para evitar erros)
  return new Date()
}

// Função para calcular o tempo de espera desde a abertura
function calcularTempoEspera(dataAbertura: string): {
  dias: number
  horas: number
  minutos: number
  totalMinutos: number
  porcentagem: number
} {
  const agora = new Date()
  const abertura = parseDataBrasileira(dataAbertura)
  
  const diferencaMs = agora.getTime() - abertura.getTime()
  
  // Se a diferença for negativa (data futura), trata como 0
  if (diferencaMs < 0) {
    return { dias: 0, horas: 0, minutos: 0, totalMinutos: 0, porcentagem: 0 }
  }
  
  const totalMinutos = Math.floor(diferencaMs / (1000 * 60))
  
  const dias = Math.floor(totalMinutos / (24 * 60))
  const horas = Math.floor((totalMinutos % (24 * 60)) / 60)
  const minutos = totalMinutos % 60
  
  // Calcula porcentagem baseada no tempo máximo de 7 dias (10080 minutos)
  const porcentagem = Math.min((totalMinutos / 10080) * 100, 100)
  
  return { dias, horas, minutos, totalMinutos, porcentagem }
}

// Função para formatar o tempo de espera
function formatarTempoEspera(dias: number, horas: number, minutos: number): string {
  if (dias > 0) {
    return `${dias}d ${horas}h ${minutos}m`
  } else if (horas > 0) {
    return `${horas}h ${minutos}m`
  } else {
    return `${minutos}m`
  }
}

interface Pendencia {
  protocolo: string
  cliente: string
  titulo: string
  solicitante: string
  abertura: string
}

interface PendenciasTabProps {
  pendencias: Pendencia[]
}

export default function PendenciasTab({ pendencias }: PendenciasTabProps) {
  const [pendenciasData, setPendenciasData] = useState<Pendencia[]>(pendencias)
  const [isLoading, setIsLoading] = useState(false)

  const carregarPendencias = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/local-excel") // Endpoint para carregar dados da planilha
      const result = await response.json()

      if (response.ok && !result.error) {
        // Se a planilha retornar dados de pendências, use-os
        if (result.pendencias && Array.isArray(result.pendencias)) {
          setPendenciasData(result.pendencias)
        }
        // Caso contrário, mantenha os dados de exemplo (não mostra erro)
      }
      // Não exibe erros no console para o usuário
    } catch (error) {
      // Não exibe erros no console para o usuário
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    carregarPendencias()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-200 mb-2">Chamados em Pendência</h1>
          <p className="text-slate-400 text-sm">Lista de chamados que aguardam resolução</p>
        </div>

        {/* Botão de atualização */}
        <div className="flex justify-center mb-4">
          <button
            onClick={carregarPendencias}
            disabled={isLoading}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Carregando...' : 'Atualizar Pendências'}
          </button>
        </div>

        {/* Lista de Pendências */}
        <div className="space-y-4">
          {pendenciasData.map((pendencia, index) => (
            <Card key={index} className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Coluna Esquerda */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300 font-medium">Protocolo:</span>
                      <span className="text-slate-200">{pendencia.protocolo}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300 font-medium">Cliente:</span>
                      <span className="text-slate-200">{pendencia.cliente}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-purple-400 mt-0.5" />
                      <div>
                        <span className="text-slate-300 font-medium">Título:</span>
                        <p className="text-slate-200 text-sm mt-1">{pendencia.titulo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-orange-400" />
                      <span className="text-slate-300 font-medium">Solicitante:</span>
                      <span className="text-slate-200 text-xs">{pendencia.solicitante}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-400" />
                      <span className="text-slate-300 font-medium">Abertura:</span>
                      <span className="text-slate-200">{pendencia.abertura}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-yellow-400 text-sm font-medium">Status: Pendente</span>
                    </div>
                  </div>
                </div>

                {/* Barra de progresso dinâmica */}
                <div className="mt-4">
                  {(() => {
                    const tempoEspera = calcularTempoEspera(pendencia.abertura)
                    const tempoFormatado = formatarTempoEspera(tempoEspera.dias, tempoEspera.horas, tempoEspera.minutos)
                    
                    return (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-xs">Tempo de espera</span>
                          <span className="text-slate-300 text-xs">{tempoFormatado}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${tempoEspera.porcentagem}%` }}
                          ></div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estatísticas */}
        <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              Resumo de Pendências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{pendenciasData.length}</div>
                <div className="text-slate-400">Total de Pendências</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {pendenciasData.length > 0 
                    ? (pendenciasData.reduce((total, pendencia) => {
                        const tempo = calcularTempoEspera(pendencia.abertura)
                        return total + tempo.totalMinutos
                      }, 0) / pendenciasData.length / (24 * 60)).toFixed(1)
                    : '0.0'
                  }
                </div>
                <div className="text-slate-400">Dias Médios</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
