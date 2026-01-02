import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'qualiseg',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function runMigrations() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Verifying database structure...');
    
    // Verificar se as tabelas existem
    const [tables] = await connection.query('SHOW TABLES');
    const tableCount = Array.isArray(tables) ? tables.length : 0;
    
    console.log(`✓ Encontradas ${tableCount} tabelas no banco de dados`);
    
    if (tableCount === 0) {
      console.log('⚠️  Nenhuma tabela encontrada. Execute o script SQL no MySQL primeiro.');
    } else {
      console.log('✓ Estrutura do banco verificada com sucesso!');
    }
    
    // Verificar se o usuário admin existe
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users WHERE email = ?', ['tecnico@qualiseg.com.br']);
    const userCount = Array.isArray(users) && users.length > 0 ? (users[0] as any).count : 0;
    
    if (userCount > 0) {
      console.log('✓ Usuário admin encontrado');
    } else {
      console.log('⚠️  Usuário admin não encontrado');
    }
    
    console.log('Verificação concluída!');
  } catch (error) {
    console.error('Erro ao verificar banco:', error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

runMigrations().catch(console.error);

