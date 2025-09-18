# Template da Planilha Excel para Dashboard

Crie um arquivo Excel chamado `dados-atendimentos.xlsx` na pasta raiz do projeto com as seguintes abas:

## Aba "Métricas Gerais"
```
totalAtendimentos | chamadosFinalizados | chamadosEmAtendimento | taxaResolucao | filaEspera | tempoMedioEspera | chamadosPendentes | totalChamados
25                | 600                 | 8                     | 95.5          | 15         | 3m 20s           | 3                 | 25
```

## Aba "Atendentes"
```
id | nome              | status  | atendimentos | tempoMedio | satisfacao | eficiencia
1  | João Rodrigues    | online  | 50           | 7m 45s     | 5          | 96
2  | Maria Silva       | online  | 42           | 6m 30s     | 5          | 94
3  | Carlos Eduardo    | online  | 48           | 8m 15s     | 5          | 90
4  | Ana Paula         | pausa   | 38           | 11m 10s    | 4          | 92
5  | Pedro Santos      | online  | 35           | 5m 45s     | 5          | 89
```

## Aba "Atendimentos por Hora"
```
hora | atendimentos
6h   | 18
9h   | 35
15h  | 52
17h  | 40
18h  | 22
23h  | 30
2h   | 15
5h   | 10
```

## Aba "Clientes"
```
cliente        | atendimentos | porcentagem
SPAL JUNDIAÍ   | 200          | 33
HEINEKEN       | 150          | 25
SPAL/FEMSA     | 35           | 6
FILIAL MARÍLIA | 30           | 5
```

## Aba "Outros Setores"
```
atendimentos
20
```

## Como usar:
1. Salve este arquivo como `dados-atendimentos.xlsx` na pasta raiz do projeto.
2. O dashboard irá carregar automaticamente os dados.
3. Os valores serão atualizados a cada 1 minuto.
