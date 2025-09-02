import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import { ArrowLeft, Edit, Mail, Phone, IndianRupee, TrendingUp, TrendingDown, Clock, ShieldCheck, Home, Users as UsersIcon, Landmark, FileText, CheckCircle, XCircle, UploadCloud, Search } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import ActionConfirmationModal from '../../components/admin/ActionConfirmationModal';
import EditBankDetailsModal from '../../components/admin/EditBankDetailsModal';

type VerificationStatus = 'Verified' | 'Pending' | 'Rejected' | 'Not Verified';

// Mock data generation
const generateUserData = (id: string) => {
  faker.seed(Number(id));
  return {
    id,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    status: faker.helpers.arrayElement(['Active', 'Inactive', 'Pending']) as 'Active' | 'Inactive' | 'Pending',
    joinDate: faker.date.past({ years: 2 }).toLocaleDateString(),
    avatar: faker.image.avatar(),
    totalInvested: faker.number.int({ min: 500000, max: 10000000 }),
    totalWithdrawn: faker.number.int({ min: 0, max: 2000000 }),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      country: 'India',
    },
    kyc: {
      status: faker.helpers.arrayElement<VerificationStatus>(['Verified', 'Pending', 'Rejected', 'Not Verified']),
      documentUrl: 'Identity_Proof.pdf',
      submittedAt: faker.date.recent({ days: 30 }).toISOString(),
    },
    bankAccount: {
      bankName: `${faker.company.name()} Bank`,
      accountNumber: `**** **** **** ${faker.string.numeric(4)}`,
      ifsc: `ABCD0${faker.string.numeric(6)}`,
      status: faker.helpers.arrayElement<VerificationStatus>(['Verified', 'Pending', 'Rejected']),
    },
    nominees: Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Child', 'Sibling']),
      email: faker.internet.email(),
    })),
    transactions: Array.from({ length: 15 }, () => ({
      id: faker.string.uuid(),
      date: faker.date.recent({ days: 180 }).toISOString(),
      type: faker.helpers.arrayElement(['Buy', 'Sell', 'Deposit', 'Withdrawal']),
      amount: faker.number.int({ min: 10000, max: 500000 }),
      status: 'Completed',
    })),
    loginActivity: Array.from({ length: 4 }, () => ({
      id: faker.string.uuid(),
      date: faker.date.recent({ days: 30 }).toLocaleString(),
      ip: faker.internet.ip(),
      device: `${faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari'])} on ${faker.helpers.arrayElement(['Windows', 'MacOS', 'Linux'])}`,
    })),
  };
};

const StatusBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  const statusStyles = {
    Verified: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
    'Not Verified': 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState(() => generateUserData(id || '1'));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBankEditModalOpen, setIsBankEditModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  const [transactionFilterType, setTransactionFilterType] = useState('All');

  const filteredTransactions = useMemo(() => {
    return user.transactions
      .filter(tx => {
        const searchTermLower = transactionSearchTerm.toLowerCase();
        return tx.type.toLowerCase().includes(searchTermLower);
      })
      .filter(tx => {
        return transactionFilterType === 'All' || tx.type === transactionFilterType;
      });
  }, [user.transactions, transactionSearchTerm, transactionFilterType]);

  const openEditModal = () => {
    setEditedUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(editedUser);
    setIsEditModalOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      }
    }));
  };

  const handleStatusUpdate = (type: 'kyc' | 'bank', newStatus: 'Verified' | 'Rejected') => {
    const onConfirm = () => {
      if (type === 'kyc') {
        setUser(prev => ({ ...prev, kyc: { ...prev.kyc, status: newStatus } }));
      } else {
        setUser(prev => ({ ...prev, bankAccount: { ...prev.bankAccount, status: newStatus } }));
      }
      setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    };

    setConfirmationModal({
      isOpen: true,
      title: `Confirm ${newStatus === 'Verified' ? 'Approval' : 'Rejection'}`,
      message: `Are you sure you want to ${newStatus === 'Verified' ? 'approve' : 'reject'} this ${type === 'kyc' ? 'KYC' : 'bank account'}? This action can be changed later.`,
      onConfirm: onConfirm,
    });
  };

  const handleSaveBankDetails = (newBankDetails: Omit<typeof user.bankAccount, 'status'>) => {
    setUser(prev => ({
        ...prev,
        bankAccount: {
            ...prev.bankAccount,
            ...newBankDetails,
            status: 'Pending'
        }
    }));
    setIsBankEditModalOpen(false);
  };

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setKycFile(file);
          setUser(prev => ({
              ...prev,
              kyc: {
                  ...prev.kyc,
                  status: 'Pending',
                  documentUrl: file.name,
                  submittedAt: new Date().toISOString(),
              }
          }));
      }
  };

  return (
    <div>
      <Link to="/admin/users" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Users
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <PageHeader title={user.name} subtitle={`User since ${user.joinDate}`} />
        <button onClick={openEditModal} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center space-x-2 text-sm">
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Invested" value={`₹${user.totalInvested.toLocaleString('en-IN')}`} icon={TrendingUp} />
        <StatCard title="Total Withdrawn" value={`₹${user.totalWithdrawn.toLocaleString('en-IN')}`} icon={TrendingDown} />
        <StatCard title="Net Portfolio" value={`₹${(user.totalInvested - user.totalWithdrawn).toLocaleString('en-IN')}`} icon={IndianRupee} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* KYC Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <ShieldCheck className="w-6 h-6 mr-3 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">KYC Verification</h3>
                </div>
                <StatusBadge status={user.kyc.status} />
            </div>
            <p className="text-sm text-gray-500 mb-4">Submitted on: {new Date(user.kyc.submittedAt).toLocaleString()}</p>
            
            {user.kyc.status === 'Verified' ? (
                <div className="mt-4 p-4 bg-emerald-50 rounded-lg text-center">
                    <p className="text-emerald-800 font-medium">KYC is verified.</p>
                </div>
            ) : (
                <div className="mt-4">
                    <label htmlFor="kyc-upload" className={`cursor-pointer block w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors ${user.kyc.status === 'Pending' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-emerald-500'}`}>
                        <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                            {kycFile ? `File selected: ${kycFile.name}` : (user.kyc.status === 'Pending' || user.kyc.status === 'Rejected' ? `Document submitted: ${user.kyc.documentUrl}` : 'Click to upload user ID Proof')}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">PDF, PNG, JPG up to 5MB</span>
                        <input id="kyc-upload" name="kyc-upload" type="file" className="sr-only" onChange={handleKycFileChange} />
                    </label>
                </div>
            )}

            {user.kyc.status === 'Pending' && (
                <div className="flex justify-end space-x-3 mt-4">
                    <button onClick={() => handleStatusUpdate('kyc', 'Rejected')} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 flex items-center space-x-2"><XCircle className="w-4 h-4" /><span>Reject</span></button>
                    <button onClick={() => handleStatusUpdate('kyc', 'Verified')} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center space-x-2"><CheckCircle className="w-4 h-4" /><span>Approve</span></button>
                </div>
            )}
          </div>

          {/* Bank Account Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Landmark className="w-6 h-6 mr-3 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Bank Account</h3>
                </div>
                <div className="flex items-center space-x-4">
                    <StatusBadge status={user.bankAccount.status} />
                    <button onClick={() => setIsBankEditModalOpen(true)} className="text-emerald-600 hover:text-emerald-800 p-1 rounded-full hover:bg-emerald-100">
                        <Edit className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium text-gray-500">Bank:</span> {user.bankAccount.bankName}</p>
                <p><span className="font-medium text-gray-500">Account No:</span> {user.bankAccount.accountNumber}</p>
                <p><span className="font-medium text-gray-500">IFSC:</span> {user.bankAccount.ifsc}</p>
            </div>
            {user.bankAccount.status === 'Pending' && (
                <div className="flex justify-end space-x-3 mt-4">
                    <button onClick={() => handleStatusUpdate('bank', 'Rejected')} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 flex items-center space-x-2"><XCircle className="w-4 h-4" /><span>Reject</span></button>
                    <button onClick={() => handleStatusUpdate('bank', 'Verified')} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center space-x-2"><CheckCircle className="w-4 h-4" /><span>Approve</span></button>
                </div>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search type..."
                            value={transactionSearchTerm}
                            onChange={(e) => setTransactionSearchTerm(e.target.value)}
                            className="w-full sm:w-40 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                    </div>
                    <select
                        value={transactionFilterType}
                        onChange={(e) => setTransactionFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    >
                        <option value="All">All Types</option>
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                        <option value="Deposit">Deposit</option>
                        <option value="Withdrawal">Withdrawal</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-emerald-50/70">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(tx => (
                      <tr key={tx.id}>
                        <td className="px-4 py-2 text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm">{tx.type}</td>
                        <td className={`px-4 py-2 text-sm font-medium ${tx.type === 'Deposit' || tx.type === 'Buy' ? 'text-emerald-600' : 'text-red-600'}`}>
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="space-y-8 self-start">
            {/* User Info Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
                <div className="flex flex-col items-center">
                    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mb-4 border-4 border-emerald-200" />
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mb-4 ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                </div>
                <ul className="space-y-4 text-sm mt-4">
                    <li className="flex items-center"><Mail className="w-4 h-4 mr-3 text-gray-400" /><span className="text-gray-700">{user.email}</span></li>
                    <li className="flex items-center"><Phone className="w-4 h-4 mr-3 text-gray-400" /><span className="text-gray-700">{user.phone}</span></li>
                </ul>
            </div>
            {/* Address Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
                <div className="flex items-center mb-4">
                    <Home className="w-6 h-6 mr-3 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                </div>
                <address className="text-sm text-gray-700 not-italic">
                    {user.address.street}<br/>
                    {user.address.city}, {user.address.state} {user.address.zip}<br/>
                    {user.address.country}
                </address>
            </div>
            {/* Nominees Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
                <div className="flex items-center mb-4">
                    <UsersIcon className="w-6 h-6 mr-3 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Nominees</h3>
                </div>
                <ul className="space-y-3">
                    {user.nominees.map(nominee => (
                        <li key={nominee.id} className="text-sm">
                            <p className="font-medium text-gray-800">{nominee.name}</p>
                            <p className="text-gray-500">{nominee.relationship}</p>
                        </li>
                    ))}
                </ul>
            </div>
             {/* Login Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Activity</h3>
                <ul className="space-y-3">
                {user.loginActivity.map(activity => (
                    <li key={activity.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                        <p className="text-gray-800">{activity.device}</p>
                        <p className="text-gray-500 text-xs">{activity.ip}</p>
                        </div>
                    </div>
                    <span className="text-gray-600 text-xs">{new Date(activity.date).toLocaleDateString()}</span>
                    </li>
                ))}
                </ul>
            </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-2xl">
        <form onSubmit={handleSaveChanges} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Edit User Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input id="edit-name" name="name" type="text" value={editedUser.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input id="edit-email" name="email" type="email" value={editedUser.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input id="edit-phone" name="phone" type="tel" value={editedUser.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select id="edit-status" name="status" value={editedUser.status} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-200" />
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="edit-street" className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input id="edit-street" name="street" type="text" value={editedUser.address.street} onChange={handleAddressChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input id="edit-city" name="city" type="text" value={editedUser.address.city} onChange={handleAddressChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="edit-state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input id="edit-state" name="state" type="text" value={editedUser.address.state} onChange={handleAddressChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="edit-zip" className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input id="edit-zip" name="zip" type="text" value={editedUser.address.zip} onChange={handleAddressChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Changes</button>
          </div>
        </form>
      </Modal>

      <ActionConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />

      <EditBankDetailsModal
        isOpen={isBankEditModalOpen}
        onClose={() => setIsBankEditModalOpen(false)}
        onSave={handleSaveBankDetails}
        bankDetails={user.bankAccount}
      />
    </div>
  );
};

export default UserDetail;
