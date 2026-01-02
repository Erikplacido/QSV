-- ============================================
-- SCRIPT PARA CRIAR BANCO DE DADOS QUALISEG (MySQL)
-- ============================================
-- Cole este script diretamente no MySQL (phpMyAdmin, MySQL Workbench, etc.)
-- Compatível com MySQL 5.7+ e 8.0+

-- 1. Criar banco de dados
CREATE DATABASE IF NOT EXISTS qualiseg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Usar o banco
USE qualiseg;

-- 3. Criar usuário (descomente se necessário, ajuste conforme seu ambiente)
-- CREATE USER 'qsv1'@'localhost' IDENTIFIED BY 'Qualiseg123';
-- GRANT ALL PRIVILEGES ON qualiseg.* TO 'qsv1'@'localhost';
-- FLUSH PRIVILEGES;

-- 4. Criar tabela users
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Criar tabela companies
CREATE TABLE IF NOT EXISTS companies (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    responsible_name VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Criar tabela inspections
CREATE TABLE IF NOT EXISTS inspections (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36),
    establishment_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    type ENUM('Interna', 'Delegada') NOT NULL,
    date TIMESTAMP NOT NULL,
    cnpj VARCHAR(18),
    responsible_name VARCHAR(255),
    contact_phone VARCHAR(20),
    total_area DECIMAL(10, 2),
    floors INT,
    construction_year INT,
    operating_hours VARCHAR(50),
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_company_id (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Criar tabela poi_instances
CREATE TABLE IF NOT EXISTS poi_instances (
    id CHAR(36) PRIMARY KEY,
    inspection_id CHAR(36) NOT NULL,
    poi_id VARCHAR(255) NOT NULL,
    current_phase INT NOT NULL DEFAULT 0,
    risk_level ENUM('critical', 'medium', 'low'),
    deadline INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE,
    INDEX idx_inspection_id (inspection_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Criar tabela inspection_phases
CREATE TABLE IF NOT EXISTS inspection_phases (
    id CHAR(36) PRIMARY KEY,
    poi_instance_id CHAR(36) NOT NULL,
    phase_number INT NOT NULL,
    photo_url VARCHAR(500),
    timestamp TIMESTAMP NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status ENUM('satisfactory', 'not_satisfactory', 'pending', 'not_applicable') NOT NULL DEFAULT 'pending',
    comment TEXT,
    selected_recommendation_ids JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (poi_instance_id) REFERENCES poi_instances(id) ON DELETE CASCADE,
    UNIQUE KEY unique_poi_phase (poi_instance_id, phase_number),
    INDEX idx_poi_instance_id (poi_instance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Criar tabela delegated_access_tokens
CREATE TABLE IF NOT EXISTS delegated_access_tokens (
    id CHAR(36) PRIMARY KEY,
    inspection_id CHAR(36) NOT NULL,
    token CHAR(36) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE,
    INDEX idx_inspection_id (inspection_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Criar tabela session para express-session
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR(255) NOT NULL,
    sess JSON,
    expire DATETIME(6) NOT NULL,
    PRIMARY KEY (sid),
    INDEX idx_expire (expire)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Criar usuário admin padrão (senha será atualizada pelo backend)
-- NOTA: O backend irá atualizar a senha usando bcrypt
INSERT INTO users (id, email, password_hash, name) 
VALUES (
    UUID(),
    'tecnico@qualiseg.com.br',
    '$2b$10$placeholder_will_be_updated_by_backend',
    'Técnico Qualiseg'
) ON DUPLICATE KEY UPDATE email=email;

-- 12. Mensagem de sucesso
SELECT 'Banco de dados qualiseg criado com sucesso!' AS status;
