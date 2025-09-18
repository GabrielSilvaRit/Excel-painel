# Configuração da Planilha Excel para o Dashboard

## Estrutura da Planilha

Para que o dashboard funcione corretamente, sua planilha Excel deve ter as seguintes abas e estruturas:

### Aba 1: "Atendentes"
| Nome | Status | Atendimentos | TempoMedio | Satisfacao |
|------|--------|--------------|------------|------------|
| João Rodrigues | online | 45 | 8m 30s | 5 |
| Maria Silva | online | 38 | 7m 15s | 5 |
| Carlos Eduardo | online | 42 | 9m 45s | 5 |
| Ana Paula | pausa | 35 | 12m 22s | 4 |
| Pedro Santos | online | 28 | 6m 18s | 5 |

### Aba 2: "Estatisticas"
| Metrica | Valor |
|---------|-------|
| totalAtendimentos | 21 |
| chamadosFinalizados | 557 |
| chamadosEmAtendimento | 10 |
| taxaResolucao | 94.5 |
| filaEspera | 11 |
| tempoMedioEspera | 2m 45s |

### Aba 3: "GraficoHora"
| Hora | Atendimentos |
|------|--------------|
| 6h | 15 |
| 9h | 32 |
| 15h | 48 |
| 17h | 35 |
| 18h | 18 |
| 23h | 25 |
| 2h | 12 |
| 5h | 8 |

### Aba 4: "Clientes"
| Cliente | Atendimentos | Porcentagem |
|---------|--------------|-------------|
| SPAL JUNDIAÍ | 183 | 32 |
| HEINEKEN | 133 | 23 |
| SPAL/FEMSA | 29 | 5 |
| FILIAL MARÍLIA | 26 | 4 |

## Como Configurar

1. **Crie um arquivo Excel** com o nome `dashboard-data.xlsx`
2. **Crie as 4 abas** conforme mostrado acima
3. **Preencha os dados** seguindo exatamente a estrutura das colunas
4. **Salve o arquivo** na pasta `public/data/` do seu projeto
5. **Configure as variáveis de ambiente** no Vercel:
   - `EXCEL_FILE_PATH`: caminho para o arquivo Excel
   - `EXCEL_UPDATE_INTERVAL`: intervalo de atualização em minutos (padrão: 1)

## Observações Importantes

- **Status dos atendentes**: Use apenas "online", "pausa" ou "offline"
- **Formato de tempo**: Use o formato "Xm Ys" (exemplo: "8m 30s")
- **Porcentagens**: Use números inteiros (exemplo: 32 para 32%)
- **Nomes**: Mantenha consistência nos nomes dos atendentes
- **Atualização**: O dashboard atualiza automaticamente a cada minuto

## Exemplo de Upload para Vercel

Se você quiser fazer upload da planilha diretamente para o Vercel:

1. Coloque o arquivo `dashboard-data.xlsx` na pasta `public/data/`
2. O sistema lerá automaticamente os dados
3. Para atualizações em tempo real, considere usar uma integração com Google Sheets ou OneDrive
