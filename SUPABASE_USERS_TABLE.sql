-- Create users table for authentication and role management
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee', 'client')),
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read users (for login lookup)
CREATE POLICY "Authenticated users can read users" ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only admins can update users
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Only admins can insert users
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (you'll need to update the password hash)
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  role,
  is_active
) VALUES (
  'admin@make-ready-consulting.com',
  '$2b$10$qmOIwPpRKnhboh.mrlCnLu5PCDQW6nU5M2V3YY19eFO8LPdh8CdQ6',
  'Admin',
  'User',
  'admin',
  true
);

-- Optional: Add sample employee account
-- Password will be: Employee123!
-- Hash generated with: bcrypt.hash('Employee123!', 10)
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  role,
  is_active
) VALUES (
  'employee@make-ready-consulting.com',
  '$2b$10$8vN8ZnKMp0oYJ4uXDGN8xOXxQ7mKqE.5YxJwH6P3kL9mN2pR4sT6u',
  'Employee',
  'Demo',
  'employee',
  true
);

-- Create user sessions audit table (optional but recommended)
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  login_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  logout_time TIMESTAMPTZ
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_login ON user_sessions(login_time DESC);

