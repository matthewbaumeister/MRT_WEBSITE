-- Rename role from 'client' to 'general' across all users
UPDATE users 
SET role = 'general' 
WHERE role = 'client';

-- Note: You may also need to update any CHECK constraints on the role column
-- If there's a constraint, drop and recreate it:

-- First, check if constraint exists:
-- SELECT constraint_name 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'users' AND constraint_type = 'CHECK';

-- If you have a constraint named 'valid_role' or similar, update it:
-- ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_role;
-- ALTER TABLE users ADD CONSTRAINT valid_role 
--   CHECK (role IN ('admin', 'employee', 'general'));

