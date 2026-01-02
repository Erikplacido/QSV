-- Create enum types
CREATE TYPE inspection_type_enum AS ENUM ('Interna', 'Delegada');
CREATE TYPE risk_level_enum AS ENUM ('critical', 'medium', 'low');
CREATE TYPE phase_status_enum AS ENUM ('satisfactory', 'not_satisfactory', 'pending', 'not_applicable');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    responsible_name VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    establishment_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    type inspection_type_enum NOT NULL,
    date TIMESTAMP NOT NULL,
    cnpj VARCHAR(18),
    responsible_name VARCHAR(255),
    contact_phone VARCHAR(20),
    total_area DECIMAL(10, 2),
    floors INTEGER,
    construction_year INTEGER,
    operating_hours VARCHAR(50),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create poi_instances table
CREATE TABLE IF NOT EXISTS poi_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    poi_id VARCHAR(255) NOT NULL,
    current_phase INTEGER NOT NULL DEFAULT 0 CHECK (current_phase >= 0 AND current_phase <= 2),
    risk_level risk_level_enum,
    deadline INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inspection_phases table
CREATE TABLE IF NOT EXISTS inspection_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poi_instance_id UUID NOT NULL REFERENCES poi_instances(id) ON DELETE CASCADE,
    phase_number INTEGER NOT NULL CHECK (phase_number >= 0 AND phase_number <= 2),
    photo_url VARCHAR(500),
    timestamp TIMESTAMP NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status phase_status_enum NOT NULL DEFAULT 'pending',
    comment TEXT,
    selected_recommendation_ids JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poi_instance_id, phase_number)
);

-- Create delegated_access_tokens table
CREATE TABLE IF NOT EXISTS delegated_access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create session table for express-session
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inspections_user_id ON inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_inspections_company_id ON inspections(company_id);
CREATE INDEX IF NOT EXISTS idx_poi_instances_inspection_id ON poi_instances(inspection_id);
CREATE INDEX IF NOT EXISTS idx_inspection_phases_poi_instance_id ON inspection_phases(poi_instance_id);
CREATE INDEX IF NOT EXISTS idx_delegated_access_tokens_inspection_id ON delegated_access_tokens(inspection_id);
CREATE INDEX IF NOT EXISTS idx_delegated_access_tokens_token ON delegated_access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_delegated_access_tokens_expires_at ON delegated_access_tokens(expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poi_instances_updated_at BEFORE UPDATE ON poi_instances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspection_phases_updated_at BEFORE UPDATE ON inspection_phases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delegated_access_tokens_updated_at BEFORE UPDATE ON delegated_access_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

