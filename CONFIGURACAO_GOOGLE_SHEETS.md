# Configuração do Google Sheets para Dashboard

## Passo 1: Criar a Planilha no Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Renomeie para "Dashboard Atendimentos"

## Passo 2: Estrutura das Abas

### Aba 1: "Métricas Gerais"
\`\`\`
A1: Métrica          | B1: Valor
A2: Total            | B2: 21
A3: Finalizados      | B3: 557
A4: Em Atendimento   | B4: 10
A5: Resolução        | B5: 94.5
A6: Chamados Pendentes | B6: 0.04
A7: Eficiência Média | B7: 89.2
A8: Tempo Médio      | B8: 18m 14s
A9: Pico do Dia      | B9: 75
A10: Fila Atual      | B10: 11
A11: Fila Espera     | B11: 11
A12: Tempo Médio Espera | B12: 2m 45s
\`\`\`

### Aba 2: "Atendimentos por Hora"
\`\`\`
A1: Hora | B1: Atendimentos
A2: 6h   | B2: 35
A3: 9h   | B3: 28
A4: 15h  | B4: 48
A5: 17h  | B5: 45
A6: 18h  | B6: 15
A7: 23h  | B7: 32
A8: 2h   | B8: 25
A9: 5h   | B9: 18
\`\`\`

### Aba 3: "Atendentes"
\`\`\`
A1: Nome           | B1: Iniciais | C1: Atendimentos | D1: Tempo Médio | E1: Rating | F1: Online
A2: Jean Lucas     | B2: JF       | C2: 164          | D2: 28m 11s     | E2: 5      | F2: TRUE
A3: Melissa Maria  | B3: MZ       | C3: 90           | D3: 19m 54s     | E3: 5      | F3: TRUE
A4: Paulo Roberto  | B4: PJ       | C4: 78           | D4: 12m 22s     | E4: 5      | F4: TRUE
A5: Rodrigo Moura  | B5: RM       | C5: 71           | D5: 16m 26s     | E5: 5      | F5: FALSE
A6: Oxana Andreli  | B6: OS       | C6: 64           | D6: 21m 18s     | E6: 5      | F6: TRUE
\`\`\`

### Aba 4: "Clientes"
\`\`\`
A1: Nome          | B1: Atendimentos | C1: Porcentagem | D1: Cor
A2: SPAL JUNDIAÍ  | B2: 183          | C2: 32          | D2: #3b82f6
A3: HEINEKEN      | B3: 133          | C3: 23          | D3: #10b981
A4: SPAL/FEMSA    | B4: 29           | C4: 5           | D4: #8b5cf6
A5: FILIAL MARÍLIA| B5: 26           | C5: 4           | D5: #f97316
\`\`\`

## Passo 3: Configurar API do Google Sheets

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google Sheets
4. Crie uma chave de API
5. Torne a planilha pública (Compartilhar > Qualquer pessoa com o link)

## Passo 4: Configurar Variáveis de Ambiente no Vercel

Adicione estas variáveis no seu projeto Vercel:

\`\`\`
GOOGLE_SHEET_ID=seu_id_da_planilha_aqui
GOOGLE_SHEETS_API_KEY=sua_chave_api_aqui
\`\`\`

O ID da planilha está na URL: `https://docs.google.com/spreadsheets/d/[ID_AQUI]/edit`

## Como Funciona

- Você edita a planilha no Google Sheets
- O dashboard atualiza automaticamente a cada 30 segundos
- Não precisa fazer upload novamente
- Dados sempre sincronizados em tempo real
