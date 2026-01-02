-- Create default admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash for 'admin123' using bcrypt
-- You should generate a new hash in production using: bcrypt.hashSync('your-password', 10)
INSERT INTO users (email, password_hash, name)
VALUES (
    'tecnico@qualiseg.com.br',
    '$2b$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq',
    'Técnico Qualiseg'
)
ON CONFLICT (email) DO NOTHING;

-- Note: The password hash above is a placeholder. 
-- In production, generate a proper hash using bcrypt.hashSync('your-password', 10)

