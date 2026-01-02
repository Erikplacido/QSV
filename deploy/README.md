# Deploy - Qualiseg

Scripts e configurações para deploy do sistema Qualiseg.

## 📋 Arquivos

- `CRIAR_BANCO_DADOS_MYSQL.sql` - Script SQL para criar o banco de dados MySQL
- `nginx.conf` - Configuração do Nginx (exemplo)
- `pm2.config.js` - Configuração do PM2

## 🗄️ Banco de Dados

Execute o script `CRIAR_BANCO_DADOS_MYSQL.sql` no seu MySQL para criar:
- Banco de dados `qualiseg`
- Todas as tabelas necessárias
- Usuário admin padrão

## ⚙️ Configuração

### Variáveis de Ambiente

Configure o arquivo `.env` no backend:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qualiseg
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com.br
SESSION_SECRET=chave-secreta-aleatoria
UPLOAD_DIR=./uploads
```

### PM2

```bash
pm2 start pm2.config.js
pm2 save
```

### Nginx

Ajuste o `nginx.conf` conforme seu ambiente e configure o proxy reverso para a porta do backend.
