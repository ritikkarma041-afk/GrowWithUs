const sequelize = require('../common/database');
const defineUser = require('../common/models/UserTransactions');
const UserTrn = defineUser(sequelize);

const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: 'object',
    required: ['amount', 'transactionType', 'paymentMode', 'transactionReferenceId', 'destinationAccount'],
    properties: {
        amount: { type: 'string', pattern: '^[0-9]+(\\.[0-9]{1,2})?$' },
        transactionType: { enum: ['DEPOSIT', 'WITHDRAW'] },
        paymentMode: { enum: ['UPI', 'CARD', 'NET_BANKING', 'WALLET'] },
        transactionReferenceId: { type: 'string', minLength: 5 },
        destinationAccount: { type: 'string', nullable: true }
    }
};
const validate = ajv.compile(schema);

exports.getUserTrn = async (req, res) => {
    // console.log('Fetching transactions for user ID:', req);
    const usertrn = await UserTrn.findAll({ where: { userId: req.user.userId } });
    if (usertrn.length === 0) {
        return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: usertrn });
};

exports.getAllUserTrn = async (req, res) => {
    const usertrn = await UserTrn.findAll();
    res.json({ success: true, data: usertrn });
};

exports.createUserTrn = async (trnReq, trnRes) => {
    try {
        if (!validate(trnReq.body)) {
            return trnRes.status(400).json({ success: false, error: 'Invalid input', details: validate.errors });
        }
        const { userId, amount, transactionType, paymentMode, transactionReferenceId, destinationAccount } = trnReq.body;
        const userTrn = await UserTrn.create({
            userId,
            amount,
            transactionType,
            paymentMode,
            transactionReferenceId,
            destinationAccount
        });
        // console.log('User transaction created successfully:', userTrn);
        trnRes.status(201).json({
            success: true,
            userTrn: { trnid: userTrn.id, userid: userTrn.userId, trnAmount: userTrn.amount, trnType: userTrn.transactionType }
        });
    } catch (err) {
        trnRes.status(500).json({ success: false, error: err.message });
    }
};