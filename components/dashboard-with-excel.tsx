"use client"

import { useState, useEffect } from "react"
import Dashboard from "./dashboard"

// Dados padrão (fallback)
const dadosPadrao = {
  atendentes: [
    {
      id: 1,
      nome: "João Rodrigues Pereira",
      atendimentos: 45,
      tempoMedio: "8m 30s",
      satisfacao: 5,
      status: "online",
      eficiencia: 92,
    },
    {
      id: 2,
      nome: "Maria Silva Santos",
      atendimentos: 38,
      tempoMedio: "7m 15s",
      satisfacao: 5,
      status: "online",
      eficiencia: 95,
    },
    {
      id: 3,
      nome: "Carlos Eduardo Lima",
      atendimentos: 42,
      tempoMedio: "9m 45s",
      satisfacao: 5,
      status: "ocupado",
      eficiencia: 88,
    },
    {
      id: 4,
      nome: "Ana Paula Costa",
      atendimentos: 35,
      tempoMedio: "6m 30s",
      satisfacao: 5,
      status: "online",
      eficiencia: 91,
    },
  ],
  estatisticas: {
    totalAtendimentos: 280,
    chamadosFinalizados: 245,
    chamadosEmAtendimento: 18,
    taxaResolucao: 94.5,
    filaEspera: 12,
    tempoMedioEspera: "2m 45s",
  },
  dadosGrafico: [
    { hora: "08:00", atendimentos: 15 },
    { hora: "09:00", atendimentos: 28 },
    { hora: "10:00", atendimentos: 35 },
    { hora: "11:00", atendimentos: 42 },
    { hora: "12:00", atendimentos: 38 },
    { hora: "13:00", atendimentos: 25 },
    { hora: "14:00", atendimentos: 45 },
    { hora: "15:00", atendimentos: 52 },
  ],
  clientes: [
    { cliente: "Spal", atendimentos: 85, porcentagem: 70 },
    { cliente: "Heineken", atendimentos: 64, porcentagem: 53 },
    { cliente: "Coca-Cola", atendimentos: 48, porcentagem: 40 },
    { cliente: "Pepsi", atendimentos: 35, porcentagem: 29 },
    { cliente: "Guaraná", atendimentos: 28, porcentagem: 23 },
  ],
}

export default function DashboardWithExcel() {
  const [dados, setDados] = useState(dadosPadrao)
  const [status, setStatus] = useState<"carregando" | "sucesso" | "erro" | "usando-padrao">("usando-padrao")
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>("")
  const [contadorAtualizacoes, setContadorAtualizacoes] = useState(0)
  const [inicioSistema] = useState(new Date())
  const [isUpdating, setIsUpdating] = useState(false)

  const metaDiariaAtingida = dados.estatisticas.totalAtendimentos >= 500

  const filaAcimaNormal = dados.estatisticas.filaEspera > 30

  const carregarDados = async () => {
    try {
      setIsUpdating(true)
      setStatus("carregando")

      const response = await fetch("/api/excel-data")
      const result = await response.json()

      if (result.success) {
        await new Promise((resolve) => setTimeout(resolve, 800))

        setDados(result.data)
        setStatus("sucesso")
        setUltimaAtualizacao(new Date(result.lastUpdate).toLocaleString("pt-BR"))
        setContadorAtualizacoes((prev) => prev + 1)
      } else {
        console.error("Erro ao carregar dados:", result.error)
        setStatus("erro")
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      setStatus("erro")
    } finally {
      setTimeout(() => setIsUpdating(false), 1500)
    }
  }

  const calcularTempoFuncionamento = () => {
    const agora = new Date()
    const diferenca = agora.getTime() - inicioSistema.getTime()
    const horas = Math.floor(diferenca / (1000 * 60 * 60))
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60))
    return `${horas}h ${minutos}m`
  }

  useEffect(() => {
    carregarDados()

    const interval = setInterval(carregarDados, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="">
      {isUpdating && (
        <div className="">
          <div className="">
            <div className="">
              <div className="absolute top-4 left-4 w-24 h-24 border-4 border-green-500/40 rounded-full animate-ping animation-delay-0"></div>
              <div className="absolute top-8 left-8 w-16 h-16 border-4 border-purple-500/50 rounded-full animate-ping animation-delay-0"></div>
            </div>
          </div>

          <div className="">
            <div className="">
              <div className="">
                <div className=""></div>
                <span className=""></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${metaDiariaAtingida ? "bg-green-400" : "bg-green-400"}`} />
            <span className="text-slate-300 text-xs">Meta diária atingida</span>
          </div>

          {/* Separador */}
          <div className="w-px h-4 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${filaAcimaNormal ? "bg-yellow-400" : "bg-green-400"}`} />
            <span className="text-slate-300 text-xs">Fila acima do normal</span>
          </div>

          {/* Separador */}
          <div className="w-px h-4 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                status === "carregando"
                  ? "bg-yellow-400 animate-pulse"
                  : status === "sucesso"
                    ? "bg-green-400 animate-pulse"
                    : status === "erro"
                      ? "bg-red-400"
                      : "bg-gray-400"
              }`}
            />
            <span className="text-slate-300 text-xs">
              {status === "carregando"
                ? "Sistema Atualizando..."
                : status === "sucesso"
                  ? "Sistema Atualizado"
                  : status === "erro"
                    ? "Erro na Planilha"
                    : "Modo Demonstração"}
            </span>
          </div>

          {/* Contador de atualizações */}
          <div className="flex items-center gap-1"></div>

          {/* Tempo de funcionamento */}
          <div className="flex items-center gap-1"></div>
        </div>

        {ultimaAtualizacao && (
          <div className="text-center mt-1 text-xs text-gray-500">Última atualização: {ultimaAtualizacao}</div>
        )}
      </div>

      <div className={`transition-all duration-700 ${isUpdating ? "scale-100 opacity-95" : "scale-100 opacity-100"}`}>
        <Dashboard dados={dados} />
      </div>
    </div>
  )
}
