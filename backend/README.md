# Qualiseg Backend API

Backend Node.js/Express para o sistema Qualiseg de vistoria técnica.

## 🚀 Início Rápido

```bash
npm install
cp .env.example .env  # Configure as variáveis
npm run build
npm start
```

## 📋 Requisitos

- Node.js 18+
- MySQL 5.7+ ou 8.0+

## ⚙️ Configuração

Crie um arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qualiseg
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=sua-chave-secreta
UPLOAD_DIR=./uploads
```

## 🗄️ Banco de Dados

Execute o script SQL em `../deploy/CRIAR_BANCO_DADOS_MYSQL.sql` para criar o banco e tabelas.

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual
- `POST /api/auth/logout` - Logout

### Vistoria
- `GET /api/inspections` - Listar vistorias
- `POST /api/inspections` - Criar vistoria
- `GET /api/inspections/:id` - Detalhes da vistoria
- `PUT /api/inspections/:id` - Atualizar vistoria
- `DELETE /api/inspections/:id` - Deletar vistoria

### POI Instances
- `POST /api/poi-instances` - Criar instância POI
- `PUT /api/poi-instances/:id` - Atualizar instância POI

### Fotos
- `POST /api/photos/upload` - Upload de foto
- `GET /api/photos/:filename` - Obter foto

### Acesso Delegado
- `GET /api/delegated/:token` - Obter dados da vistoria (público)
- `POST /api/delegated/:token/capture` - Capturar foto (público)
- `POST /api/delegated/generate/:inspectionId` - Gerar token de acesso

## 🏗️ Estrutura

```
backend/
├── src/
│   ├── config/       # Configurações (database, multer)
│   ├── models/       # Modelos Sequelize
│   ├── routes/       # Rotas da API
│   ├── middleware/   # Middlewares (auth, errorHandler)
│   └── server.ts     # Servidor principal
├── migrations/       # Scripts SQL de migração
└── dist/            # Código compilado
```

## 🔧 Scripts

- `npm run dev` - Desenvolvimento com hot-reload
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar produção
- `npm run migrate` - Executar migrações
