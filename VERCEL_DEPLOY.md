# 🚀 Guia de Deploy no Vercel

Este guia explica como fazer deploy completo do projeto Qualiseg no Vercel.

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Repositório no GitHub
3. Banco de dados MySQL acessível publicamente (PlanetScale, Railway, ou MySQL com IP público)

## 🔧 Passo a Passo

### 1. Conectar Repositório ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Conecte seu repositório GitHub
4. Selecione o repositório `QSV`

### 2. Configurar Build

O Vercel detecta automaticamente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

#### Obrigatórias:

```env
DB_HOST=seu-host-mysql.exemplo.com
DB_PORT=3306
DB_NAME=qualiseg
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
SESSION_SECRET=uma-chave-secreta-forte-aleatoria
NODE_ENV=production
```

#### Após o primeiro deploy:

O Vercel fornecerá a URL do projeto. Adicione:

```env
FRONTEND_URL=https://seu-projeto.vercel.app
```

### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. Se houver erros, verifique os logs

## ⚠️ Problemas Comuns

### Erro: "Could not resolve ./services/api"

**Solução**: Já corrigido no `vite.config.ts` com extensões explícitas.

### Erros de TypeScript durante o build

**Solução**: 
- Todas as dependências do backend foram adicionadas ao `package.json` da raiz
- O Vercel pode mostrar warnings de TypeScript, mas o build deve completar
- Os erros de tipo não impedem o funcionamento em runtime

### Erro: "Database connection failed"

**Solução**: 
- Verifique se o MySQL está acessível publicamente
- Verifique as credenciais nas variáveis de ambiente
- Teste a conexão manualmente

### Erro: "Module not found"

**Solução**: 
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para verificar

### Uploads não funcionam

**Nota**: Em serverless, arquivos são salvos em `/tmp/uploads` (temporário).
- Para produção, considere usar S3 ou Cloudinary
- Arquivos em `/tmp` são apagados após cada execução

## 📝 Estrutura de Deploy

```
/
├── api/
│   └── index.ts          # Handler serverless
├── backend/              # Código do backend
├── dist/                 # Build do frontend (gerado)
└── vercel.json           # Configuração do Vercel
```

## 🔗 URLs Após Deploy

- **Frontend**: `https://seu-projeto.vercel.app`
- **API**: `https://seu-projeto.vercel.app/api/*`

## 📚 Recursos

- [Documentação Vercel](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

