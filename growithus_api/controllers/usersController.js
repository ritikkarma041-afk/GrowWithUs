const sequelize = require('../common/database');
const defineUser = require('../common/models/User');
// const IUserDetails = require('../common/models/businessModels/UserDetails');
const defineUserAddress = require('../common/models/UserAddress');
const defineUserContact = require('../common/models/UserContact');
const UserAddress = defineUserAddress(sequelize);
const UserContact = defineUserContact(sequelize);
const defineUserProfile = require('../common/models/UserProfile');
const UserProfile = defineUserProfile(sequelize);

const User = defineUser(sequelize);

exports.getUser = async (req, res) => {
  const user = await User.findByPk(req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, data: user });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json({ success: true, data: users });
};

// Get combined user data by userId
exports.getCombinedUserDataByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await UserProfile.findByPk(userId, {
      include: [
        {
          model: UserAddress, as: 'Address',
        },
        { model: UserContact, as: 'Contact' },
      ],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.updateOrCreateUserProfile = async (req, res) => {
  const userData = req.body;
  const transaction = await sequelize.transaction();

  try {
    // Upsert UserProfile
    const [userProfile] = await UserProfile.upsert(
      {
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        email: userData.email,
        createdDate: userData.createdDate,
        updatedDate: userData.updatedDate,
      },
      { transaction }
    );

    // Handle Address
    if (userData.Address && userData.Address.length > 0) {
      for (const address of userData.Address) {
        await UserAddress.upsert(
          {
            id: address.id,
            userId: userData.userId,
            AddressType: address.AddressType,
            AddressLine1: address.AddressLine1,
            AddressLine2: address.AddressLine2,
            City: address.City,
            State: address.State,
            ZipCode: address.ZipCode,
            Country: address.Country,
            Isdeleted: address.Isdeleted,
            createdDate: address.createdDate,
            updatedDate: address.updatedDate,
          },
          { transaction }
        );
      }
    }

    // Handle Contact
    if (userData.Contact && userData.Contact.length > 0) {
      for (const contact of userData.Contact) {
        await UserContact.upsert(
          {
            id: contact.id,
            userId: userData.userId,
            type: contact.type,
            valueEncrypted: contact.valueEncrypted,
            isVerified: contact.isVerified,
            isPrimary: contact.isPrimary,
            Isdeleted: contact.Isdeleted,
            createdDate: contact.createdDate,
            updatedDate: contact.updatedDate,
          },
          { transaction }
        );
      }
    }

    // Commit transaction
    await transaction.commit();
    res.json({ success: true, message: 'User profile updated/added successfully.' });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    res.status(500).json({ success: false, message: 'Error updating/adding user profile.', error: error.message });
  }
};