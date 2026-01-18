const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sequelize = require('../common/database');
const defineUser = require('../common/models/User');
const defineUserProfile = require('../common/models/UserProfile');
const User = defineUser(sequelize);
const UserProfile = defineUserProfile(sequelize);

const encryptPassword = (password) =>
  crypto.createHash('sha256').update(password).digest('hex');

const generateAccessToken = (username, userId) =>
  jwt.sign({ username, userId }, 'your-secret-key', { expiresIn: '24h' });

const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

const schema = {
  type: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 }
  }
};
const validate = ajv.compile(schema);

exports.register = async (req, res) => {
  if (!validate(req.body)) {
    return res.status(400).json({ error: 'Invalid input', details: validate.errors });
  }
  const trn = await sequelize.transaction();
  try {
    const { username, email, password, firstName, lastName, dob, gender } = req.body;
    const encryptedPassword = encryptPassword(password);
    const user = await User.create({
      username,
      passwordHash: encryptedPassword,
    },
    { transaction: trn });
    const userProfile = await UserProfile.create({
      userId: user.id,
      firstName,
      lastName,
      dateOfBirth: dob,
      gender,
      email
    }, { transaction: trn });
    await trn.commit();
    const accessToken = generateAccessToken(username, user.id);
    res.status(201).json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
      token: accessToken
    });
  } catch (err) {
    await trn.rollback();
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const encrypted = encryptPassword(password);
  const user = await User.findOne({ where: { username } });

  if (!user || user.passwordHash !== encrypted)
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateAccessToken(username, user.id);
  res.json({ success: true, user, token });
};