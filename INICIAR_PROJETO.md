# 🚀 Como Iniciar o Projeto Localmente

## Pré-requisitos

1. **MySQL instalado e rodando**
2. **Banco de dados criado** (execute `deploy/CRIAR_BANCO_DADOS_MYSQL.sql`)
3. **Node.js 18+ instalado**

## Passo a Passo

### 1. Configurar Backend

Crie o arquivo `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qualiseg
DB_USER=root
DB_PASSWORD=          # Deixe vazio se MySQL não tem senha
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=qualiseg-dev-secret-key
UPLOAD_DIR=./uploads
```

### 2. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend (na raiz)
cd ..
npm install
```

### 3. Atualizar Senha do Admin

```bash
cd backend
node -e "const bcrypt=require('bcrypt');const mysql=require('mysql2/promise');const p=mysql.createPool({host:'localhost',port:3306,database:'qualiseg',user:'root',password:''});const h=bcrypt.hashSync('admin123',10);p.query('UPDATE users SET password_hash=? WHERE email=?',[h,'tecnico@qualiseg.com.br']).then(()=>{console.log('✅ Senha atualizada!');process.exit(0)}).catch(e=>{console.error('Erro:',e.message);process.exit(1)})"
```

### 4. Iniciar Backend

```bash
cd backend
npm run dev
```

O backend estará em: `http://localhost:3000`

### 5. Iniciar Frontend

Em outro terminal:

```bash
npm run dev
```

O frontend estará em: `http://localhost:5173`

## 🔐 Login

- **Email**: `tecnico@qualiseg.com.br`
- **Senha**: `admin123`

## ✅ Verificação

- Backend: `curl http://localhost:3000/api/health`
- Frontend: Abra `http://localhost:5173` no navegador


