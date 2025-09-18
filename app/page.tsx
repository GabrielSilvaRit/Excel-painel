"use client"

import { useState, useEffect } from "react"
import DashboardExact from "@/components/dashboard-exact"
import PendenciasTab from "@/components/pendencias-tab"
import LoginScreen from "@/components/login-screen"
import { ExcelUpload } from "@/components/excel-upload"
import type { DashboardData } from "@/types/dashboard"

interface Pendencia {
  protocolo: string
  cliente: string
  titulo: string
  solicitante: string
  abertura: string
}

const dadosPadrao: DashboardData = {
  atendentes: [
    {
      id: 1,
      nome: "João Rodrigues",
      atendimentos: 45,
      tempoMedio: "8m 30s",
      satisfacao: 5,
      status: "online",
      eficiencia: 95,
    },
    {
      id: 2,
      nome: "Maria Silva",
      atendimentos: 38,
      tempoMedio: "7m 15s",
      satisfacao: 5,
      status: "online",
      eficiencia: 92,
    },
    {
      id: 3,
      nome: "Carlos Eduardo",
      atendimentos: 42,
      tempoMedio: "9m 45s",
      satisfacao: 5,
      status: "online",
      eficiencia: 88,
    },
    {
      id: 4,
      nome: "Ana Paula",
      atendimentos: 35,
      tempoMedio: "12m 22s",
      satisfacao: 4,
      status: "pausa",
      eficiencia: 91,
    },
    {
      id: 5,
      nome: "Pedro Santos",
      atendimentos: 28,
      tempoMedio: "6m 18s",
      satisfacao: 5,
      status: "online",
      eficiencia: 87,
    },
    {
      id: 6,
      nome: "Raimundo Francisco",
      atendimentos: 22,
      tempoMedio: "11m 5s",
      satisfacao: 4,
      status: "online",
      eficiencia: 89,
    },
  ],
  estatisticas: {
    totalAtendimentos: 21,
    chamadosFinalizados: 557,
    chamadosEmAtendimento: 10,
    taxaResolucao: 94.5,
    filaEspera: 11,
    tempoMedioEspera: "2m 45s",
    chamadosPendentes: 2,
    totalChamados: 21,
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
  pendencias: [
    {
      protocolo: "1111111",
      cliente: "Master Cargo",
      titulo: "ICM incorreto devido a grave erro de tttp as e nFS 66777",
      solicitante: "sergio.rodrigues@gmail.com.br",
      abertura: "25/08/2025 16:07:59"
    },
    {
      protocolo: "2222222",
      cliente: "SPAL JUNDIAÍ",
      titulo: "Problema com sistema de faturamento - NF 4455",
      solicitante: "maria.silva@spal.com.br",
      abertura: "26/08/2025 09:15:22"
    },
    {
      protocolo: "3333333",
      cliente: "HEINEKEN",
      titulo: "Erro na integração API - pedido 7788",
      solicitante: "carlos.santos@heineken.com",
      abertura: "27/08/2025 14:30:45"
    }
  ],
  alertas: [
    { tipo: "success", mensagem: "Meta diária atingida" },
    { tipo: "success", mensagem: "Fila acima do normal" },
    { tipo: "success", mensagem: "Sistema Atualizado" },
  ],
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [dados, setDados] = useState<DashboardData>(dadosPadrao)
  const [status, setStatus] = useState<"carregando" | "sucesso" | "erro" | "usando-padrao">("usando-padrao")
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [currentTab, setCurrentTab] = useState<"dashboard" | "pendencias">("dashboard")

  // Dados de exemplo para pendências (mantido para fallback)
  const pendenciasExemplo: Pendencia[] = dadosPadrao.pendencias

  const handleLogin = async (username: string, password: string) => {
    // Credenciais configuráveis - você pode modificar estas credenciais
    const validUsername = "bigo"
    const validPassword = "123"

    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true)
      setLoginError("")
      // Iniciar carregamento dos dados após login bem-sucedido
      carregarDados()
    } else {
      setLoginError("Usuário ou senha incorretos")
    }
  }

  const toggleTab = () => {
    setCurrentTab(currentTab === "dashboard" ? "pendencias" : "dashboard")
  }

  const carregarDados = async () => {
    try {
      setIsUpdating(true)
      setStatus("carregando")

      // Primeiro tenta carregar do arquivo Excel local
      let response = await fetch("/api/local-excel")
      let result = await response.json()

      if (!response.ok || result.error) {
        // Fallback para Google Sheets se arquivo local falhar
        response = await fetch("/api/sheets-data")
        result = await response.json()
      }

      if (!response.ok || result.error) {
        // Fallback para API do Excel simulation se ambos falharem
        response = await fetch("/api/excel-data")
        result = await response.json()
      }

      if (response.ok && !result.error) {
        await new Promise((resolve) => setTimeout(resolve, 800))

        setDados(result.data || result)
        setStatus("sucesso")
        setUltimaAtualizacao(new Date(result.lastUpdated || result.lastUpdate || Date.now()).toLocaleString("pt-BR"))
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

  const handleDataUpdate = (newData: any) => {
    setDados(newData)
    setStatus("sucesso")
    setUltimaAtualizacao(new Date().toLocaleString("pt-BR"))
    setShowUpload(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      carregarDados()
      const interval = setInterval(carregarDados, 60000) // 1 minuto
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />
  }

  return (
    <div className="relative">
      {showUpload && (
        <div className="fixed top-4 right-4 z-50">
          <ExcelUpload onDataUpdate={handleDataUpdate} />
        </div>
      )}

      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-slate-800/90 rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="text-slate-200">Atualizando dados do Google Sheets...</span>
          </div>
        </div>
      )}

      <div className={`transition-all duration-700 ${isUpdating ? "scale-95 opacity-80" : "scale-100 opacity-100"}`}>
        {currentTab === "dashboard" ? (
          <DashboardExact dados={dados} />
        ) : (
          <PendenciasTab pendencias={dados.pendencias || pendenciasExemplo} />
        )}
      </div>

      {/* Botão para alternar entre abas - visível apenas em mobile */}
      <button
        onClick={toggleTab}
        className="fixed bottom-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg z-50 transition-colors md:hidden"
        title={currentTab === "dashboard" ? "Ver Pendências" : "Voltar ao Dashboard"}
      >
        {currentTab === "dashboard" ? "📋" : "📊"}
      </button>
    </div>
  )
}
