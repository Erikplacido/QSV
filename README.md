# Qualiseg - Sistema de Vistoria

Sistema completo de vistoria técnica com frontend React e backend Node.js/Express.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: MySQL
- **ORM**: Sequelize
- **Autenticação**: Session-based
- **Upload de Imagens**: Multer

## 📁 Estrutura do Projeto

```
qsv4/
├── backend/          # API Node.js/Express
├── components/      # Componentes React
├── hooks/           # Custom hooks
├── services/        # Serviços (API client)
└── deploy/          # Scripts e configurações de deploy
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- MySQL 5.7+ ou 8.0+
- npm ou yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configure as variáveis de ambiente
npm run build
npm start
```

### Frontend

```bash
npm install
npm run dev
```

## ⚙️ Configuração

### Variáveis de Ambiente (Backend)

Crie um arquivo `.env` no diretório `backend/`:

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

### Banco de Dados

Execute o script SQL em `deploy/CRIAR_BANCO_DADOS_MYSQL.sql` no seu MySQL.

## 📝 Scripts Disponíveis

### Backend
- `npm run dev` - Inicia em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm start` - Inicia produção
- `npm run migrate` - Executa migrações

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção

## 🔐 Usuário Padrão

Após criar o banco de dados:
- **Email**: `tecnico@qualiseg.com.br`
- **Senha**: Será definida pelo backend (verifique logs)

## 🚀 Deploy no Vercel

O projeto está configurado para deploy completo (frontend + backend) no Vercel.

### Configuração no Vercel

1. **Conecte seu repositório GitHub ao Vercel**
2. **Configure as variáveis de ambiente** no painel do Vercel:

#### Variáveis de Ambiente Obrigatórias

```env
# Banco de Dados MySQL
DB_HOST=seu-host-mysql
DB_PORT=3306
DB_NAME=qualiseg
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Sessão
SESSION_SECRET=uma-chave-secreta-forte-aleatoria

# Frontend URL (será preenchido automaticamente pelo Vercel)
FRONTEND_URL=https://seu-projeto.vercel.app

# Node Environment
NODE_ENV=production
```

#### Variáveis de Ambiente Opcionais

```env
# Porta (não necessário no Vercel, mas pode ser definida)
PORT=3000

# Upload Directory (usado automaticamente /tmp em serverless)
UPLOAD_DIR=/tmp/uploads
```

### Importante para Deploy no Vercel

- **Banco de Dados**: Você precisa de um MySQL acessível publicamente (ex: PlanetScale, Railway, ou MySQL com IP público)
- **Uploads**: Arquivos são salvos em `/tmp/uploads` (temporário). Para produção, considere usar S3 ou Cloudinary
- **Sessões**: As sessões são armazenadas no MySQL. Para melhor performance em serverless, considere usar Redis

### Build e Deploy

O Vercel detecta automaticamente:
- Frontend: Build com `vite build`
- Backend: Serverless functions em `api/index.ts`

## 📚 Documentação Adicional

- `backend/README.md` - Documentação do backend
- `deploy/` - Scripts e configurações de deploy

## 👥 Desenvolvimento

Para contribuir ou continuar o desenvolvimento, veja:
- `backend/src/` - Código fonte do backend
- `components/` - Componentes React
- `services/api.ts` - Cliente API
