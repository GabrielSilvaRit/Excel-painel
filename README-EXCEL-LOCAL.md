# Dashboard de Atendimentos - Integração com Excel Local

Este dashboard suporta atualização automática a cada 1 minuto com dados de uma planilha Excel local.

## Como usar localmente:

### 1. Preparar a planilha Excel
Crie um arquivo Excel chamado `dados-atendimentos.xlsx` na pasta raiz do projeto com as abas e estrutura conforme descrito.

### 2. Configuração (Opcional)
Edite o arquivo `.env.local` para personalizar:
```env
EXCEL_FILE_PATH=./dados-atendimentos.xlsx  # Caminho do arquivo local
UPDATE_INTERVAL=60000                       # 1 minuto em milissegundos
OPERATION_MODE=local                        # Modo de operação
```

### 3. Executar o projeto localmente
```bash
npm run dev
```

## Como usar no Vercel:

### 1. Coloque o arquivo Excel na pasta `public/data/`
Por exemplo: `public/data/dados-atendimentos.xlsx`

### 2. Configure a variável de ambiente `EXCEL_FILE_PATH` no painel do Vercel
Defina o valor como a URL pública do arquivo Excel, por exemplo:
```
https://<seu-dominio-vercel>/data/dados-atendimentos.xlsx
```

### 3. Deploy no Vercel
Faça o deploy normalmente. O dashboard irá buscar o arquivo Excel da URL pública e atualizar os dados automaticamente.

### Observações
- O arquivo Excel deve estar acessível publicamente para que o dashboard funcione no Vercel.
- A atualização automática ocorre a cada 1 minuto, conforme configurado.
- Caso o arquivo não esteja disponível, o dashboard usará dados em cache ou dados simulados como fallback.

## Estrutura de fallback
A ordem de carregamento é:
1. **Arquivo Excel local ou URL** (`/api/local-excel`)
2. **Google Sheets** (`/api/sheets-data`) - se configurado
3. **Dados simulados** (`/api/excel-data`) - fallback final

## Troubleshooting

**Problema**: Arquivo não encontrado  
**Solução**: Verifique se o arquivo está na pasta correta e o caminho da variável `EXCEL_FILE_PATH` está correto.

**Problema**: Erro de permissão  
**Solução**: Certifique-se que a aplicação tem permissão para acessar o arquivo.

**Problema**: Estrutura incorreta  
**Solução**: Use o template fornecido como referência.

Para mais ajuda, consulte o arquivo `dados-atendimentos.xlsx` que contém um template de exemplo.

## Automação com OneDrive e GitHub
Para que a planilha seja atualizada automaticamente sem intervenção manual:

1. **Configure o link do OneDrive:**
   - Obtenha o link compartilhado da planilha no OneDrive.
   - Converta para link de download direto: adicione `?download=1` ao final do link.
     Exemplo: `https://1drv.ms/x/s!A...` → `https://1drv.ms/x/s!A...?download=1`

2. **Configure o segredo no GitHub:**
   - Vá para o repositório no GitHub → Settings → Secrets and variables → Actions.
   - Adicione um novo segredo chamado `ONEDRIVE_URL` com o valor do link de download direto.

3. **A automação funcionará automaticamente:**
   - A cada hora, o GitHub Actions baixará a planilha do OneDrive.
   - Se houver mudanças, o arquivo será atualizado no repositório.
   - O Vercel detectará a mudança e atualizará o dashboard automaticamente.
   - Você não precisa fazer nada manualmente após a configuração inicial.

**Nota:** Certifique-se de que o link do OneDrive seja público ou compartilhado com permissão de download.
