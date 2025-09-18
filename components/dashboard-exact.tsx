"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  Users,
  PhoneCall,
  Award,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Truck,
  Package,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
} from "lucide-react"
import type { DashboardData } from "@/types/dashboard"

interface DashboardProps {
  dados: DashboardData
}

function getIniciais(nome: string) {
  const palavras = nome.split(" ")
  const primeira = palavras[0]?.[0] || ""
  const ultima = palavras[palavras.length - 1]?.[0] || ""
  return (primeira + ultima).toUpperCase()
}

function getStatusColor(status: string) {
  switch (status) {
    case "online":
      return "bg-green-500"
    case "pausa":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

function tempoMedioParaMinutos(tempoMedio: string): number {
  const match = tempoMedio.match(/(\d+)m\s*(\d+)s/)
  if (match) {
    const minutos = parseInt(match[1])
    const segundos = parseInt(match[2])
    return minutos + (segundos / 60)
  }
  return 0
}

function minutosParaTempoFormatado(minutos: number): string {
  const minutosInt = Math.floor(minutos)
  const segundos = Math.round((minutos - minutosInt) * 60)
  return `${minutosInt}m ${segundos}s`
}

export default function DashboardExact({ dados }: DashboardProps) {
  const { 
    atendentes = [], 
    estatisticas = {
      totalAtendimentos: 0,
      chamadosFinalizados: 0,
      chamadosEmAtendimento: 0,
      taxaResolucao: 0,
      filaEspera: 0,
      tempoMedioEspera: '0m 0s',
      chamadosPendentes: 0,
      totalChamados: 0
    }, 
    dadosGraficoHora = [], 
    dadosClientes = [], 
    alertas = [] 
  } = dados || {}

  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [slideAtual, setSlideAtual] = useState(0)
  const [picoMaximoDiario, setPicoMaximoDiario] = useState<number>(0)
  const [horarioPicoMaximo, setHorarioPicoMaximo] = useState<string>('')
  const [ultimaAtualizacaoTravada, setUltimaAtualizacaoTravada] = useState<string>('')
  const [estaAtualizando, setEstaAtualizando] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % 2)
    }, 5000)
    return () => clearInterval(slideTimer)
  }, [])

  // Lógica para atualizar o pico máximo às 23:45
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      if (now.getHours() === 23 && now.getMinutes() === 45 && !estaAtualizando) {
        setEstaAtualizando(true)
        const maxPico = Math.max(...dadosGraficoHora.map(item => item.atendimentos))
        setPicoMaximoDiario(maxPico)
        const horario = dadosGraficoHora.find(item => item.atendimentos === maxPico)?.hora || ''
        setHorarioPicoMaximo(horario)
        // Trava a última atualização com o horário atual
        setUltimaAtualizacaoTravada(now.toLocaleString('pt-BR'))
        
        // Libera o estado de atualização após 1 minuto
        setTimeout(() => {
          setEstaAtualizando(false)
        }, 60000)
      }
    }, 60000) // Verifica a cada minuto

    return () => clearInterval(timer)
  }, [dadosGraficoHora, estaAtualizando])

  // Filtrar apenas atendentes online para Status da Equipe
  const atendentesOnline = atendentes.filter((a) => a.status === "online")
  
  // Ordenar atendentes por número de atendimentos (maior para menor) para Performance
  const atendentesOrdenados = [...atendentes].sort((a, b) => b.atendimentos - a.atendimentos)
  
  // Encontrar o melhor atendente (que mais atendeu) para Período
  const melhorAtendente = atendentes.length > 0 
    ? atendentes.reduce((prev, current) => 
        prev.atendimentos > current.atendimentos ? prev : current
      )
    : null
  
  // Calcular tempo médio do melhor atendente
  const tempoMedioMelhorAtendente = melhorAtendente 
    ? melhorAtendente.tempoMedio 
    : "N/A"
  
  const maxValue = dadosGraficoHora.length > 0 ? Math.max(...dadosGraficoHora.map((item) => item.atendimentos)) : 60
  const scaleMax = Math.ceil((maxValue * 1.2) / 10) * 10

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-2 md:p-4 overflow-y-auto scrollbar-hide">
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="h-full max-w-[1920px] mx-auto flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-4 space-y-2 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-slate-200">Painel de Atendimentos</h1>
              <p className="text-slate-400 text-xs">
                {currentTime.toLocaleDateString("pt-BR")} - {currentTime.toLocaleTimeString("pt-BR")}
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-slate-300">Meta diária atingida</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-slate-300">Fila acima do normal</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-slate-300">Sistema Atualizado</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-xs">Sistema Online</span>
          </div>
        </div>
        <div className="text-center text-xs text-slate-400 mb-2">
          Última atualização: {ultimaAtualizacaoTravada || currentTime.toLocaleDateString("pt-BR")},{" "}
          {ultimaAtualizacaoTravada ? ultimaAtualizacaoTravada.split(', ')[1] : currentTime.toLocaleTimeString("pt-BR")}
        </div>

        {/* Grid Principal */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 space-y-4 md:space-y-0">
          {/* Coluna Esquerda - Métricas */}
          <div className="md:col-span-3 space-y-2 md:space-y-4">
            {/* Cards de Métricas Principais */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-2 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Total</p>
                      <p className="text-lg md:text-2xl font-bold text-white">{estatisticas.totalAtendimentos || 21}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-2 md:h-3 w-2 md:w-3 text-green-400" />
                        <span className="text-green-400 text-xs">+12%</span>
                      </div>
                    </div>
                    <div className="p-1 md:p-2 bg-blue-500/20 rounded-lg">
                      <Phone className="h-3 md:h-4 w-3 md:w-4 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-2 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Finalizados</p>
                      <p className="text-lg md:text-2xl font-bold text-white">
                        {estatisticas.chamadosFinalizados || 557}
                      </p>
                    </div>
                    <div className="p-1 md:p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="h-3 md:h-4 w-3 md:w-4 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-2 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Em Atendimento</p>
                      <p className="text-lg md:text-2xl font-bold text-white">
                        {estatisticas.chamadosEmAtendimento || 10}
                      </p>
                    </div>
                    <div className="p-1 md:p-2 bg-orange-500/20 rounded-lg">
                      <Activity className="h-3 md:h-4 w-3 md:w-4 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-2 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Resolução</p>
                      <p className="text-lg md:text-2xl font-bold text-white">
                        {(estatisticas.taxaResolucao || 94.5).toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-1 md:p-2 bg-purple-500/20 rounded-lg">
                      <Target className="h-3 md:h-4 w-3 md:w-4 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Atendimentos Finalizados */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Atendimentos Finalizados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                {dadosClientes
                  .sort((a, b) => b.atendimentos - a.atendimentos) // Ordenar do maior para o menor
                  .map((cliente, index) => {
                  const cores = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"]
                  const corBarra = cores[index % cores.length]

                  return (
                    <div key={index} className="space-y-1 md:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-xs font-medium">{cliente.cliente}</span>
                        <span className="text-slate-200 text-xs font-bold">{cliente.atendimentos}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-1.5 md:h-2">
                          <div
                            className={`${corBarra} h-1.5 md:h-2 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${cliente.porcentagem}%` }}
                          ></div>
                        </div>
                        <span className="text-slate-400 text-xs min-w-[35px]">{cliente.porcentagem}%</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Tempo Real */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Fila de Espera</span>
                  <span className="text-orange-400 font-bold text-sm">{estatisticas.filaEspera || 11}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Tempo Médio Espera</span>
                  <span className="text-cyan-400 font-bold text-sm">{estatisticas.tempoMedioEspera || "2m 45s"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Fila Outros Setores</span>
                  <span className="text-orange-400 font-bold text-sm">{dados.outrosSetores || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Central - Gráficos */}
          <div className="md:col-span-6 space-y-2 md:space-y-4">
            {/* Gráfico Principal */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <BarChart3 className="h-4 md:h-5 w-4 md:w-5 text-blue-400" />
                  Atendimentos por Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 md:h-40 relative overflow-hidden px-2 md:px-4">
                  {/* Grid de fundo com escala dinâmica */}
                  <div className="absolute inset-0 flex flex-col justify-between px-2 md:px-4">
                    {[scaleMax, scaleMax * 0.75, scaleMax * 0.5, scaleMax * 0.25, 0].map((value) => (
                      <div key={value} className="flex items-center">
                        <span className="text-xs text-slate-500 w-6 md:w-8">{Math.round(value)}</span>
                        <div className="flex-1 h-px bg-slate-700/50"></div>
                      </div>
                    ))}
                  </div>

                  {/* Área do gráfico com escala dinâmica */}
                  {dadosGraficoHora.length > 0 && (
                    <svg className="w-full h-full" viewBox="0 0 800 200">
                      {/* Área preenchida */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>

                      <path
                        d={`M 0 ${180 - ((dadosGraficoHora[0]?.atendimentos || 0) / scaleMax) * 180} ${dadosGraficoHora
                          .map(
                            (item, index) =>
                              `L ${(index * 750) / (dadosGraficoHora.length - 1)} ${180 - (item.atendimentos / scaleMax) * 180}`,
                          )
                          .join(" ")} L 750 180 L 0 180 Z`}
                        fill="url(#areaGradient)"
                      />

                      {/* Linha principal */}
                      <path
                        d={`M 0 ${180 - ((dadosGraficoHora[0]?.atendimentos || 0) / scaleMax) * 180} ${dadosGraficoHora
                          .map(
                            (item, index) =>
                              `L ${(index * 750) / (dadosGraficoHora.length - 1)} ${180 - (item.atendimentos / scaleMax) * 180}`,
                          )
                          .join(" ")}`}
                        stroke="rgb(139, 92, 246)"
                        strokeWidth="2"
                        fill="none"
                      />

                      {/* Pontos */}
                      {dadosGraficoHora.map((item, index) => (
                        <circle
                          key={index}
                          cx={(index * 750) / (dadosGraficoHora.length - 1)}
                          cy={180 - (item.atendimentos / scaleMax) * 180}
                          r="3"
                          fill="rgb(139, 92, 246)"
                          stroke="white"
                          strokeWidth="1"
                        />
                      ))}
                    </svg>
                  )}

                  {/* Labels do eixo X */}
                  <div className="absolute bottom-0 left-8 md:left-12 right-2 md:right-4 flex justify-between">
                    {["6h", "9h", "15h", "17h", "18h", "23h", "2h", "5h"].map((hora, index) => (
                      <span key={index} className="text-xs text-slate-400">
                        {hora}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards inferiores */}
            <div className="space-y-2 md:space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-2">Chamados Pendentes</div>
                      <div className="relative w-12 md:w-16 h-12 md:h-16 mx-auto mb-2">
                        <svg className="w-12 md:w-16 h-12 md:h-16 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            className="text-slate-700 md:hidden"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-slate-700 hidden md:block"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - 0.04)}`}
                            className="text-yellow-400 transition-all duration-1000 md:hidden"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.04)}`}
                            className="text-yellow-400 transition-all duration-1000 hidden md:block"
                          />
                        </svg>
<div className="absolute inset-0 flex items-center justify-center">
  <span className="text-white font-bold text-sm">
    {estatisticas.chamadosPendentes > 0 && estatisticas.filaEspera > 0 
      ? `${Math.round((estatisticas.chamadosPendentes / estatisticas.filaEspera) * 100)}%`
      : '0%'}
  </span>
</div>
                      </div>
<div className="text-slate-300 text-xs">{estatisticas.chamadosPendentes || 0}/{estatisticas.filaEspera || 0}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-2">Eficiência Média</div>
<div className="text-xl md:text-2xl font-bold text-green-400 mb-1">89.2%</div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-2 md:h-3 w-2 md:w-3 text-green-400" />
                        <span className="text-green-400 text-xs">+3.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm col-span-2 md:col-span-1">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-2">Tempo Médio</div>
<div className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">
  {atendentes.length > 0 
    ? minutosParaTempoFormatado(atendentes.reduce((acc, atendente) => acc + tempoMedioParaMinutos(atendente.tempoMedio), 0) / atendentes.length)
    : '0m 0s'}
</div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingDown className="h-2 md:h-3 w-2 md:w-3 text-green-400" />
                        <span className="text-green-400 text-xs">-15s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4 md:max-w-2xl md:mx-auto">
                <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-2">Pico do Dia</div>
<div className="text-xl md:text-2xl font-bold text-orange-400 mb-1">{Math.max(...dadosGraficoHora.map(item => item.atendimentos)) || 0}</div>
<div className="text-slate-300 text-xs">
  {dadosGraficoHora.length > 0 
    ? `às ${dadosGraficoHora.find(item => item.atendimentos === Math.max(...dadosGraficoHora.map(i => i.atendimentos)))?.hora || ''}`
    : 'N/A'}
</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-center">
<div className="text-slate-400 text-xs mb-2">Pico do dia passado</div>
<div className="text-xl md:text-2xl font-bold text-blue-400 mb-1">{picoMaximoDiario || 0}</div>
<div className="text-slate-300 text-xs">
  {horarioPicoMaximo ? `às ${horarioPicoMaximo}` : 'N/A'}
</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Central de Manifesto */}
            <div className="text-center py-2 md:py-4 mt-2 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="flex items-center gap-4 md:gap-8">
                  <Truck className="h-8 md:h-16 w-8 md:w-16 text-blue-400 animate-pulse" />
                  <Phone className="h-6 md:h-12 w-6 md:w-12 text-cyan-400" />
                  <Package className="h-7 md:h-14 w-7 md:w-14 text-purple-400" />
                  <FileText className="h-5 md:h-10 w-5 md:w-10 text-green-400" />
                </div>
              </div>
              <div className="relative z-10">
                <h1 className="text-lg md:text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text">
                  Central de Manifesto
                </h1>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Status da Equipe / Período */}
          <div className="md:col-span-3 space-y-2 md:space-y-4">
            {/* Alternância entre Status da Equipe e Período */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-2 md:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                    {slideAtual === 0 ? (
                      <>
                        <Users className="h-4 w-4 text-blue-400" />
                        Status da Equipe
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 text-yellow-400" />
                        Período
                      </>
                    )}
                  </CardTitle>
                  <div className="flex gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${slideAtual === 0 ? "bg-blue-400" : "bg-slate-600"}`}
                    ></div>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${slideAtual === 1 ? "bg-blue-400" : "bg-slate-600"}`}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {slideAtual === 0 ? (
                  // Status da Equipe - dados exatos da imagem
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Equipe Online</span>
                      <span className="text-green-400 font-bold text-lg">{atendentesOnline.length}</span>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      {atendentesOnline.slice(0, 8).map((atendente) => (
                        <div key={atendente.id} className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {getIniciais(atendente.nome)}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full border border-slate-800"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-slate-200 font-medium text-sm">
                              {atendente.nome.split(" ")[0]} {atendente.nome.split(" ")[1]?.[0]}.
                            </h4>
                            <p className="text-slate-400 text-xs">{atendente.atendimentos} Atendimentos</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Período - layout individual com tamanhos menores
                  <div className="text-center space-y-2 md:space-y-3">
                    {melhorAtendente && (
                      <>
                        {/* Avatar menor */}
                        <div className="flex justify-center">
                          <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                            {getIniciais(melhorAtendente.nome)}
                          </div>
                        </div>

                        {/* Nome e subtítulo com fontes menores */}
                        <div>
                          <h3 className="text-slate-200 font-medium text-sm md:text-base">
                            {melhorAtendente.nome.split(" ").slice(0, 2).join(" ")}
                          </h3>
                          <p className="text-slate-400 text-xs">Performance</p>
                        </div>

                        {/* Métricas com espaçamento reduzido */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs">Atendimentos</span>
                            <span className="text-white font-bold text-sm md:text-base">{melhorAtendente.atendimentos}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs">Tempo Médio</span>
                            <span className="text-cyan-400 font-bold text-sm md:text-base">{tempoMedioMelhorAtendente}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ranking de Performance Completo */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm flex-1">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Performance
               </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 md:space-y-2">
                {atendentesOrdenados.map((atendente, index) => (
                  <div
                    key={atendente.id}
                    className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-slate-400 font-bold text-sm min-w-[20px]">#{index + 1}</div>
                      <div className="relative">
                        <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {getIniciais(atendente.nome)}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2 md:w-3 h-2 md:h-3 ${getStatusColor(atendente.status)} rounded-full border border-slate-800`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-200 font-medium text-xs truncate">
                        {atendente.nome.split(" ").slice(0, 2).join(" ")}
                      </h4>
                      <div className="flex items-center gap-2 md:gap-3 mt-0.5">
                        <div className="flex items-center gap-1">
                          <PhoneCall className="h-2.5 w-2.5 text-blue-400" />
                          <span className="text-slate-400 text-xs">{atendente.atendimentos}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 text-cyan-400" />
                          <span className="text-slate-400 text-xs">{atendente.tempoMedio}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}