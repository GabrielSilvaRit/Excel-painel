"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  Users,
  Star,
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
  PieChart,
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
const obterPeriodo = (hora: string) => {
  const h = Number.parseInt(hora.split(":")[0])
  if (h >= 22 && h < 6) return "Madrugada"
  if (h >= 6 && h < 15) return "Manhã"
  if (h >= 15 && h < 22) return "Tarde"
}
export default function Dashboard({ dados }: DashboardProps) {
  const { atendentes = [], estatisticas = {}, dadosGraficoHora = [], dadosClientes = [], alertas = [] } = dados || {}

  const [currentTime, setCurrentTime] = useState(new Date())
  const [slideAtual, setSlideAtual] = useState(0)
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({
    totalAtendimentos: 0,
    chamadosFinalizados: 0,
    chamadosEmAtendimento: 0,
    resolucao: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % 2)
    }, 6000)
    return () => clearInterval(slideTimer)
  }, [])

  useEffect(() => {
    // Animação dos valores quando os dados mudam
    const timer = setTimeout(() => {
      setAnimatedValues({
        totalAtendimentos: estatisticas.totalAtendimentos || 0,
        chamadosFinalizados: estatisticas.chamadosFinalizados || 0,
        chamadosEmAtendimento: estatisticas.chamadosEmAtendimento || 0,
        resolucao: estatisticas.taxaResolucao || 0,
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [estatisticas])

  const melhorAtendente =
    atendentes.length > 0
      ? atendentes.reduce((prev, current) => (prev.atendimentos > current.atendimentos ? prev : current))
      : null

  const porcentagemPendentes =
    estatisticas.totalChamados > 0 ? Math.round((estatisticas.chamadosPendentes / estatisticas.totalChamados) * 100) : 0

  const agruparPorPeriodos = (dados: any[]) => {
    const periodos = {
      "Madrugada\n23h-06h": { total: 0, count: 0 },
      "Manhã\n06h-15h": { total: 0, count: 0 },
      "Tarde\n15h-23h": { total: 0, count: 0 },
    }

    dados.forEach((item) => {
      const hora = Number.parseInt(item.hora.split(":")[0])
      if (hora >= 22 && hora < 6) {
        periodos["Madrugada\n23h-06h"].total += item.atendimentos
        periodos["Madrugada\n23h-06h"].count++
      } else if (hora >= 6 && hora < 15) {
        periodos["Manhã\n06h-15h"].total += item.atendimentos
        periodos["Manhã\n06h-15h"].count++
      } else if (hora >= 15 && hora < 22) {
        periodos["Tarde\n15h-23h"].total += item.atendimentos
        periodos["Tarde\n15h-23h"].count++
      }
    })

    return Object.entries(periodos).map(([periodo, data]) => ({
      periodo,
      atendimentos: data.total,
    }))
  }
  const maxValue = dadosGraficoHora.length > 0 ? Math.max(...dadosGraficoHora.map((item) => item.atendimentos)) : 60
  const scaleMax = Math.ceil((maxValue * 1.0) / 19) * 16 // Adiciona 10% de margem e arredonda para múltiplo de 10
  const dadosPorPeriodos = agruparPorPeriodos(dadosGraficoHora)
  const maxAtendimentos = Math.max(...dadosPorPeriodos.map((d) => d.atendimentos), 1)

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 overflow-hidden">
      <div className="h-full max-w-[1920px] mx-auto flex flex-col">
        {/* Header Compacto */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-200">Painel de Atendimentos</h1>
              <p className="text-slate-400 text-xs">
                {currentTime.toLocaleDateString("pt-BR")} - {currentTime.toLocaleTimeString("pt-BR")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {alertas.map((alerta, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alerta.tipo === "warning"
                        ? "bg-yellow-400"
                        : alerta.tipo === "success"
                          ? "bg-green-400"
                          : "bg-red-400"
                    } animate-pulse`}
                  ></div>
                  <span className="text-xs text-slate-300">{alerta.mensagem}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-xs">Sistema Online</span>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="flex-1 grid grid-cols-12 gap-4">
          {/* Coluna Esquerda - Métricas */}
          <div className="col-span-3 space-y-4">
            {/* Cards de Métricas Principais */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Total</p>
                      <p className="text-2xl font-bold text-white">{animatedValues.totalAtendimentos || 0}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        <span className="text-green-400 text-xs">+12%</span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Phone className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Finalizados</p>
                      <p className="text-2xl font-bold text-white">{animatedValues.chamadosFinalizados || 0}</p>
                    </div>
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Em Atendimento</p>
                      <p className="text-2xl font-bold text-white">{animatedValues.chamadosEmAtendimento || 0}</p>
                    </div>
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Activity className="h-4 w-4 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Resolução</p>
                      <p className="text-2xl font-bold text-white">{(animatedValues.resolucao || 0).toFixed(1)}%</p>
                    </div>
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Target className="h-4 w-4 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clientes que mais atendeu */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-cyan-400" />
                  Atendimentos Finalizados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dadosClientes.map((cliente, index) => {
                  const cores = [
                    "bg-gradient-to-r from-blue-500 to-blue-600",
                    "bg-gradient-to-r from-green-500 to-green-600",
                    "bg-gradient-to-r from-purple-500 to-purple-600",
                    "bg-gradient-to-r from-orange-500 to-orange-600",
                    "bg-gradient-to-r from-pink-500 to-pink-600",
                    "bg-gradient-to-r from-cyan-500 to-cyan-600",
                    "bg-gradient-to-r from-yellow-500 to-yellow-600",
                    "bg-gradient-to-r from-red-500 to-red-600",
                  ]
                  const corBarra = cores[index % cores.length]

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-xs font-medium">{cliente.cliente}</span>
                        <span className="text-slate-200 text-xs font-bold">{cliente.atendimentos}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div
                            className={`${corBarra} h-2 rounded-full transition-all duration-1000 ease-out`}
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

            {/* Métricas Tempo Real */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Fila de Espera</span>
                  <span className="text-orange-400 font-bold text-sm">{estatisticas.filaEspera || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Tempo Médio Espera</span>
                  <span className="text-cyan-400 font-bold text-sm">{estatisticas.tempoMedioEspera || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center"></div>
                <div className="flex justify-between items-center"></div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Central - Gráficos */}
          <div className="col-span-6 space-y-4">
            {/* Gráfico Principal */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Atendimentos por Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 relative overflow-hidden px-4">
                  {/* Grid de fundo */}
                  <div className="absolute inset-0 flex flex-col justify-between px-4">
                    {[scaleMax, scaleMax * 0.75, scaleMax * 0.5, scaleMax * 0.25, 0].map((value) => (
                      <div key={value} className="flex items-center">
                        <span className="text-xs text-slate-500 w-8">{value}</span>
                        <div className="flex-1 h-px bg-slate-700/50"></div>
                      </div>
                    ))}
                  </div>

                  {/* Área do gráfico */}
                  {dadosGraficoHora.length > 0 && (
                    <svg className="w-full h-full" viewBox="100 -39 500 250">
                      {/* Área preenchida */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="%" y2="100%">
                          <stop offset="25%" stopColor="rgb(500, 130, 246)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      <path
                        d={`M 0 ${200 - (dadosGraficoHora[0].atendimentos / scaleMax) * 180} ${dadosGraficoHora
                          .map(
                            (item, index) =>
                              `L ${(index * 800) / (dadosGraficoHora.length - 1)} ${200 - (item.atendimentos / scaleMax) * 180}`,
                          )
                          .join(" ")} L 800 200 L 0 200 Z`}
                        fill="url(#areaGradient)"
                      />

                      {/* Linha principal */}
                      <path
                        d={`M 0 ${200 - (dadosGraficoHora[0].atendimentos / 400) * 180} ${dadosGraficoHora
                          .map(
                            (item, index) =>
                              `L ${(index * 800) / (dadosGraficoHora.length - 1)} ${200 - (item.atendimentos / scaleMax) * 180}`,
                          )
                          .join(" ")}`}
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="2"
                        fill="none"
                      />

                      {/* Pontos */}
                      {dadosGraficoHora.map((item, index) => (
                        <circle
                          key={index}
                          cx={(index * 800) / (dadosGraficoHora.length - 1)}
                          cy={200 - (item.atendimentos / scaleMax) * 180}
                          r="3"
                          fill="rgb(59, 130, 246)"
                          stroke="white"
                          strokeWidth="1"
                        />
                      ))}
                    </svg>
                  )}

                  {/* Labels do eixo X */}
                  <div className="absolute bottom-0 left-12 right-4 flex justify-between">
                    {dadosGraficoHora
                      .filter((_, index) => index % 3 === 0)
                      .map((item, index) => (
                        <span key={index} className="text-xs text-slate-400">
                          {item.hora.slice(0, 2)}h
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2"></div>
                </div>
              </CardContent>
            </Card>

            {/* Metas e Performance */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-2">Chamados Pendentes</div>
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-slate-700"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 25 * (1 - porcentagemPendentes / 100)}`}
                          className="text-yellow-400 transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{porcentagemPendentes}4%</span>
                      </div>
                    </div>
                    <div className="text-slate-300 text-xs">
                      {estatisticas.chamadosPendentes || 2}/{estatisticas.totalChamados || 21}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-2">Eficiência Média</div>
                    <div className="text-2xl font-bold text-green-400 mb-1">89.2%</div>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-green-400 text-xs">+3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-2">Tempo Médio</div>
                    <div className="text-2xl font-bold text-cyan-400 mb-1">18m 14s</div>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingDown className="h-3 w-3 text-green-400" />
                      <span className="text-green-400 text-xs">-15s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-2">Pico do Dia</div>
                    <div className="text-lg font-bold text-orange-400 mb-1">
                      {dadosGraficoHora.length > 0 ? Math.max(...dadosGraficoHora.map((d) => d.atendimentos)) : 0}
                    </div>
                    <div className="text-slate-300 text-xs">
                      às{" "}
                      {dadosGraficoHora.length > 0
                        ? dadosGraficoHora.find(
                            (d) => d.atendimentos === Math.max(...dadosGraficoHora.map((item) => item.atendimentos)),
                          )?.hora || "00:00"
                        : "00:00"}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-2">Fila Atual</div>
                    <div className="text-lg font-bold text-blue-400 mb-1">{estatisticas.filaEspera || 0}</div>
                    <div className="text-slate-300 text-xs">{estatisticas.tempoMedioEspera || "0m"}</div>
                  </div>
                </CardContent>
              </Card>
              {/* Central de Manifesto - Título Principal */}
              <div className="text-center py-4 mt-2 relative ml-40 w-full overflow-visible">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="flex items-center gap-8">
                    <Truck className="h-16 w-16 text-blue-400 animate-pulse" />
                    <Phone className="h-12 w-12 text-cyan-400" />
                    <Package className="h-14 w-14 text-purple-400" />
                    <FileText className="h-10 w-10 text-green-400" />
                  </div>
                </div>
                <div className="relative z-10 ">
                  <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text mb-2">
                    Central de Manifesto
                  </h1>
                  <div className="flex items-center justify-center gap-10 mt-auto">
                    <div className="">
                      <Truck className="h-0 w-0 text-blue-400" />
                      <span className="text-slate-300 text-sm font-medium"></span>
                    </div>
                    <div className="">
                      <FileText className="h-0 w-0 text-green-400" />
                      <span className="text-slate-300 text-sm font-medium"></span>
                    </div>
                    <div className="">
                      <Phone className="h-0 w-0 text-cyan-400" />
                      <span className="text-slate-300 text-sm font-medium"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Atendentes e Slide */}
          <div className="col-span-3 space-y-4">
            {/* Slide de Informações */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400 text-xs">Equipe Online</span>
                      <span className="text-green-400 font-bold text-sm">
                        {atendentes.filter((a) => a.status === "online").length}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {atendentes
                        .filter((a) => a.status === "online")
                        .slice(0, 8)
                        .map((atendente) => (
                          <div key={atendente.id} className="flex items-center gap-2 p-1.5 bg-slate-700/30 rounded-md">
                            <div className="relative">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {getIniciais(atendente.nome)}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-slate-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-200 font-medium text-xs truncate">
                                {atendente.nome.split(" ")[0]} {atendente.nome.split(" ")[1]?.[0]}.
                              </p>
                              <p className="text-slate-400 text-xs">{atendente.atendimentos} Atendimentos</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {melhorAtendente && (
                      <>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                            {getIniciais(melhorAtendente.nome)}
                          </div>
                          <h3 className="text-slate-200 font-bold text-sm">
                            {melhorAtendente.nome.split(" ").slice(0, 2).join(" ")}
                          </h3>
                          <p className="text-slate-400 text-xs">Performance</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs">Atendimentos</span>
                            <span className="text-slate-200 font-bold text-sm">
                              {melhorAtendente.atendimentos || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs">Tempo Médio</span>
                            <span className="text-cyan-400 font-bold text-sm">
                              {melhorAtendente.tempoMedio || "N/A"}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ranking Compacto de Atendentes */}
            <Card className="bg-slate-800/60 border-slate-700 backdrop-blur-sm flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {atendentes.map((atendente, index) => (
                  <div
                    key={atendente.id}
                    className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-slate-400 font-bold text-sm min-w-[20px]">#{index + 1}</div>
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {getIniciais(atendente.nome)}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(atendente.status)} rounded-full border border-slate-800`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-200 font-medium text-xs truncate">
                        {atendente.nome.split(" ").slice(0, 2).join(" ")}
                      </h4>
                      <div className="flex items-center gap-3 mt-0.5">
                        <div className="flex items-center gap-1">
                          <PhoneCall className="h-2.5 w-2.5 text-blue-400" />
                          <span className="text-slate-400 text-xs">{atendente.atendimentos || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 text-cyan-400" />
                          <span className="text-slate-400 text-xs">{atendente.tempoMedio || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-2.5 w-2.5 text-yellow-400 fill-current" />
                          <span className="text-slate-400 text-xs">{atendente.satisfacao || 0}</span>
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
