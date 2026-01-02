# ✅ Configuração Completa do Vercel

## 🔴 PROBLEMA ATUAL: Erro 500 nas APIs

O erro 500 indica que o backend não está conseguindo inicializar ou conectar ao banco de dados.

## 📋 CHECKLIST DE CONFIGURAÇÃO

### 1. Variáveis de Ambiente (OBRIGATÓRIO)

No painel do Vercel: **Settings > Environment Variables**

Adicione TODAS estas variáveis:

```env
DB_HOST=seu-host-mysql.com
DB_PORT=3306
DB_NAME=qualiseg
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
SESSION_SECRET=uma-chave-secreta-forte-aleatoria-mude-isso
FRONTEND_URL=https://qsv-kyg5.vercel.app
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- Substitua `seu-host-mysql.com` pelo IP ou hostname real do seu MySQL
- Substitua `seu_usuario` e `sua_senha` pelas credenciais reais
- Gere uma `SESSION_SECRET` forte (ex: `openssl rand -base64 32`)
- Use a URL real do seu projeto Vercel em `FRONTEND_URL`

### 2. Verificar Banco de Dados

#### O MySQL precisa estar:
- ✅ Acessível publicamente (não apenas localhost)
- ✅ Firewall permitindo conexões na porta 3306
- ✅ Usuário com permissão para conectar de qualquer IP

#### Testar conexão localmente:
```bash
mysql -h SEU_HOST -u SEU_USUARIO -p SEU_BANCO
```

### 3. Verificar Logs no Vercel

Após configurar as variáveis e fazer novo deploy:

1. Acesse: **Deployments** > [deploy mais recente]
2. Clique em **Functions** > `api/index.ts`
3. Veja os logs em tempo real
4. Procure por:
   - `✅ Database connection established successfully` (sucesso)
   - `⚠️ Unable to connect to the database` (erro)
   - `Error in API handler` (erro no handler)

### 4. Testar Endpoints

Após o deploy, teste:

1. **Health Check:**
   ```
   https://qsv-kyg5.vercel.app/api/health
   ```
   Deve retornar: `{"status":"ok","timestamp":"..."}`

2. **Login:**
   ```
   POST https://qsv-kyg5.vercel.app/api/auth/login
   Body: {"email":"tecnico@qualiseg.com.br","password":"admin123"}
   ```

## 🔧 Alternativas de Banco de Dados

Se seu MySQL não está acessível publicamente, use um serviço gerenciado:

### Opção 1: PlanetScale (Recomendado - Gratuito)
1. Crie conta em [planetscale.com](https://planetscale.com)
2. Crie um banco MySQL
3. Use as credenciais fornecidas nas variáveis de ambiente

### Opção 2: Railway
1. Crie conta em [railway.app](https://railway.app)
2. Adicione serviço MySQL
3. Use as credenciais fornecidas

### Opção 3: Supabase (PostgreSQL)
1. Crie conta em [supabase.com](https://supabase.com)
2. Crie projeto
3. Use PostgreSQL (precisa ajustar o código)

## 📝 Próximos Passos

1. ✅ Configure todas as variáveis de ambiente no Vercel
2. ✅ Faça um novo deploy (ou aguarde redeploy automático)
3. ✅ Verifique os logs no Vercel
4. ✅ Teste o endpoint `/api/health`
5. ✅ Se ainda houver erro, verifique os logs detalhados

## 🐛 Debug

Se ainda houver erro 500 após configurar tudo:

1. **Verifique os logs** no Vercel (Functions > api/index.ts)
2. **Verifique se as variáveis estão configuradas** (Settings > Environment Variables)
3. **Teste a conexão MySQL** localmente com as mesmas credenciais
4. **Verifique se o banco existe** e tem as tabelas criadas

Os logs agora mostram informações detalhadas sobre o que está falhando!

