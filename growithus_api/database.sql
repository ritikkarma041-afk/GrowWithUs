
-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a custom type for transaction types
CREATE TYPE transaction_type AS ENUM ('investment', 'withdraw');

-- Create the transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type transaction_type NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create a sample admin user for testing
INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@example.com', '$2b$10$your_hashed_admin_password', 'admin');
-- Note: Replace the password with a securely hashed one. You can generate one by running your signup endpoint once.
