
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001;
const saltRounds = 10;
const JWT_SECRET = 'your_super_secret_jwt_key_change_this'; // Use an environment variable for this in production

app.use(cors());
app.use(express.json());

// --- Database Configuration ---
// Replace with your PostgreSQL connection details
// It's recommended to use environment variables for these

const pool = new Pool({
  user: 'growwithus',
  password: 'Ritik@123',
  host: 'localhost',
  port: 5432,
  database: 'growwithus_db'
});

// Test database connection
pool.connect()
  .then(() => console.log('Successfully connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err));

// Export pool for use in other files
module.exports = pool;

// --- Email Transporter Configuration ---
// For production, use a transactional email service like SendGrid, Mailgun, or AWS SES
// For development, you can use a service like Ethereal or your own SMTP server.
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email', // Using Ethereal for testing
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'maddison53@ethereal.email', // Generated Ethereal user
    pass: 'jn7jnAPss4f63QBp6D', // Generated Ethereal password
  },
});


// --- API Routes ---
const apiRouter = express.Router();

// POST /api/auth/signup
apiRouter.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );

    // Send confirmation email
    const mailOptions = {
      from: '"GrowWithUs" <no-reply@growwithus.com>',
      to: email,
      subject: 'Welcome to GrowWithUs!',
      html: `<h1>Hi ${name},</h1><p>Welcome to GrowWithUs! We're thrilled to have you on board.</p><p>You can now log in and start your investment journey.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        // We don't block the signup if email fails, just log it.
      } else {
        console.log('Email sent: ' + info.response);
        // You can get a preview URL from Ethereal
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    });

    res.status(201).json({
      message: 'User created successfully.',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error during signup.' });
  }
});

// POST /api/auth/login
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('User found:', user.email, 'Role:', user.role);

    // For the admin user we just created, we're comparing plain text passwords
    // In a real application, you should use bcrypt.compare for all users
    let isMatch;
    if (user.role === 'admin' && user.email === 'admin@growwithus.com') {
      isMatch = (password === user.password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// POST /api/auth/forgot-password
apiRouter.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log(`Attempted password reset for non-existent user: ${email}`);
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate a password reset token (you'd typically store this in DB with expiry)
    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send password reset email
    const mailOptions = {
      from: '"GrowWithUs" <no-reply@growwithus.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<h1>Password Reset Request</h1><p>Hello ${user.name},</p><p>You requested a password reset. Click the link below to reset your password:</p><a href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a><p>This link will expire in 1 hour.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    console.log(`Password reset link sent to ${email}`);
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error during password reset request.' });
  }
});

// POST /api/auth/reset-password
apiRouter.post('/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, decoded.userId]);

    console.log('Password has been successfully reset.');
    res.json({ message: 'Password has been successfully reset.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ message: 'Invalid or expired reset token.' });
  }
});

// POST /api/transaction
apiRouter.post('/transaction', async (req, res) => {
  const { user_id, type, amount } = req.body;

  if (!user_id || !type || !amount) {
    return res.status(400).json({ message: 'user_id, type, and amount are required.' });
  }

  if (type !== 'investment' && type !== 'withdraw') {
    return res.status(400).json({ message: 'Type must be either "investment" or "withdraw".' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than zero.' });
  }

  try {
    // Get current user balance
    const balanceResult = await pool.query(
      'SELECT SUM(CASE WHEN type = \'investment\' THEN amount ELSE -amount END) as balance FROM transactions WHERE user_id = $1',
      [user_id]
    );
    const currentBalance = balanceResult.rows[0].balance || 0;

    if (type === 'withdraw' && amount > currentBalance) {
      return res.status(400).json({ message: 'Insufficient balance for withdrawal.' });
    }

    // Insert transaction
    const transaction = await pool.query(
      'INSERT INTO transactions (user_id, type, amount) VALUES ($1, $2, $3) RETURNING *',
      [user_id, type, amount]
    );

    res.status(201).json({
      message: 'Transaction processed successfully.',
      transaction: transaction.rows[0]
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Internal server error during transaction processing.' });
  }
});

// GET /api/investments
apiRouter.get('/investments', async (req, res) => {
  try {
    const investments = await pool.query('SELECT * FROM investments ORDER BY created_at DESC');
    res.json(investments.rows);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ message: 'Internal server error while fetching investments.' });
  }
});

// GET /api/settings/api-keys
apiRouter.get('/settings/api-keys', async (req, res) => {
  try {
    const apiKeys = await pool.query('SELECT * FROM api_keys ORDER BY created_at DESC');
    res.json(apiKeys.rows);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Internal server error while fetching API keys.' });
  }
});

// GET /api/settings/integrations
apiRouter.get('/settings/integrations', async (req, res) => {
  try {
    const integrations = await pool.query('SELECT * FROM integrations ORDER BY name');
    res.json(integrations.rows);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ message: 'Internal server error while fetching integrations.' });
  }
});

// POST /api/settings/integrations/:name/toggle
apiRouter.post('/settings/integrations/:name/toggle', async (req, res) => {
  const { name } = req.params;

  try {
    const integration = await pool.query('SELECT * FROM integrations WHERE name = $1', [name]);
    if (integration.rows.length === 0) {
      return res.status(404).json({ message: 'Integration not found' });
    }

    const updatedIntegration = await pool.query(
      'UPDATE integrations SET connected = NOT connected WHERE name = $1 RETURNING *',
      [name]
    );

    res.json(updatedIntegration.rows[0]);
  } catch (error) {
    console.error('Error toggling integration:', error);
    res.status(500).json({ message: 'Internal server error while toggling integration.' });
  }
});

// Apply the API routes
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
