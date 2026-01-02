# ⚠️ MySQL Local Necessário

O projeto está configurado para usar MySQL, mas o MySQL não está rodando localmente.

## Opções:

### Opção 1: Instalar MySQL Localmente (Recomendado)

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Depois criar o banco:**
```bash
mysql -u root -e "CREATE DATABASE qualiseg;"
mysql -u root qualiseg < ../deploy/CRIAR_BANCO_DADOS_MYSQL.sql
```

### Opção 2: Usar o Banco do Servidor

Se você quiser usar o banco do servidor remoto, altere o `.env`:

```env
DB_HOST=72.61.141.16
DB_PORT=3306
DB_NAME=qualiseg
DB_USER=qsv1
DB_PASSWORD=Qualiseg123
```

**⚠️ Nota:** Isso requer que o MySQL do servidor aceite conexões externas.

### Opção 3: Usar Docker MySQL

```bash
docker run --name qualiseg-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=qualiseg -p 3306:3306 -d mysql:8.0
```

Depois execute o script SQL:
```bash
mysql -h 127.0.0.1 -u root -proot qualiseg < deploy/CRIAR_BANCO_DADOS_MYSQL.sql
```

