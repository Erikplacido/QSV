# 🔧 Troubleshooting - Vercel Deploy

## Problemas Comuns e Soluções

### ❌ Erro 500 nas APIs (`/api/auth/me`, `/api/inspections`)

**Causa mais comum:** Banco de dados não acessível ou variáveis de ambiente não configuradas.

#### Verificar:

1. **Variáveis de Ambiente no Vercel:**
   - Acesse: Settings > Environment Variables
   - Verifique se TODAS estas variáveis estão configuradas:
     ```
     DB_HOST=seu-host-mysql
     DB_PORT=3306
     DB_NAME=qualiseg
     DB_USER=seu_usuario
     DB_PASSWORD=sua_senha
     SESSION_SECRET=uma-chave-secreta-forte
     FRONTEND_URL=https://seu-projeto.vercel.app
     NODE_ENV=production
     ```

2. **Banco de Dados Acessível:**
   - O MySQL precisa estar acessível publicamente
   - Firewall deve permitir conexões na porta 3306
   - Usuário MySQL deve ter permissão para conectar de qualquer IP (`'%'`)

3. **Verificar Logs no Vercel:**
   - Acesse: Deployments > [seu deploy] > Functions
   - Clique em `api/index.ts` para ver os logs
   - Procure por erros de conexão com banco de dados

#### Testar Conexão:

No terminal local, teste se consegue conectar:
```bash
mysql -h SEU_HOST -u SEU_USUARIO -p SEU_BANCO
```

### ❌ Erro 404 em arquivos estáticos (`index.css`, `/vite.svg`)

**Solução:** Já corrigido removendo referências a arquivos inexistentes no `index.html`.

### ⚠️ Aviso sobre Tailwind CSS via CDN

**Solução (opcional):** Para produção, instale Tailwind CSS como dependência:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📊 Verificar Status da API

### Health Check:
Acesse: `https://seu-projeto.vercel.app/api/health`

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2025-01-03T..."
}
```

### Se retornar erro 500:
1. Verifique os logs no Vercel
2. Verifique se as variáveis de ambiente estão configuradas
3. Verifique se o banco de dados está acessível

## 🔍 Logs no Vercel

Para ver logs detalhados:
1. Acesse o painel do Vercel
2. Vá em **Deployments**
3. Clique no deployment mais recente
4. Vá em **Functions** > `api/index.ts`
5. Veja os logs em tempo real

## 🚀 Próximos Passos

1. ✅ Commit e push das correções
2. ✅ Aguardar novo deploy
3. ✅ Configurar variáveis de ambiente no Vercel
4. ✅ Testar `/api/health`
5. ✅ Verificar logs se ainda houver erros

