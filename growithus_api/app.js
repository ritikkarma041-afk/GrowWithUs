const express = require('express');
const cors  = require ('cors');
const app = express();

app.use(cors());   
app.use(express.json());

require('dotenv').config();

app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});
const sequelize = require('./common/database');
const defineUser = require('./common/models/User');
const User = defineUser(sequelize);

const defineUserProfile = require('./common/models/UserProfile');
const UserProfile = defineUserProfile(sequelize);

const defineUserTransactions = require('./common/models/UserTransactions');
const UserTransactions = defineUserTransactions(sequelize);

(async () => {
  try {
    sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error);
  }
})();

// sequelize.sync(); // Use this line for initial sync without altering existing tables (use for production)
sequelize.sync({ alter: true });

const authRoutes = require('./routes/authorizationRoutes');
app.use('/api/', authRoutes);

const userRoutes = require('./routes/usersRoutes');
app.use('/api/user', userRoutes);

const userTrnRoutes = require('./routes/userTrnRoutes');
app.use('/api/usertrn', userTrnRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));