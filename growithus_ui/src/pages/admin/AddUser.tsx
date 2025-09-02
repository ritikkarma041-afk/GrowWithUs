import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Home, Landmark, Users as UsersIcon, PlusCircle, X, ArrowLeft, ChevronDown, ChevronUp, Save, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

interface Nominee {
  id: number;
  name: string;
  relationship: string;
  email: string;
}

const initialUserData = {
  name: '',
  email: '',
  phone: '',
  status: 'Pending' as 'Active' | 'Inactive' | 'Pending',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
  bankAccount: {
    bankName: '',
    accountNumber: '',
    ifsc: '',
  },
  nominees: [] as Nominee[],
  kycStatus: 'Not Verified' as 'Not Verified' | 'Pending' | 'Verified' | 'Rejected',
};

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50">
      <button
        type="button"
        className="w-full flex justify-between items-center p-4 sm:p-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Icon className="w-6 h-6 mr-3 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && <div className="p-4 sm:p-6 pt-0 animate-fade-in">{children}</div>}
    </div>
  );
};

const AddUser: React.FC = () => {
  const [userData, setUserData] = useState(initialUserData);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section: 'address' | 'bankAccount', e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleNomineeChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      nominees: prev.nominees.map(nominee =>
        nominee.id === id ? { ...nominee, [name]: value } : nominee
      ),
    }));
  };

  const addNominee = () => {
    if (userData.nominees.length < 2) {
      const newId = (userData.nominees[userData.nominees.length - 1]?.id || 0) + 1;
      setUserData(prev => ({
        ...prev,
        nominees: [...prev.nominees, { id: newId, name: '', relationship: '', email: '' }],
      }));
    }
  };

  const removeNominee = (id: number) => {
    setUserData(prev => ({
      ...prev,
      nominees: prev.nominees.filter(nominee => nominee.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new user with data:', userData);
    // Here you would typically send the data to your backend API
    alert('User created successfully! (Check console for data)');
    navigate('/admin/users');
  };

  return (
    <div>
      <Link to="/admin/users" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Users
      </Link>
      <PageHeader title="Add New User" subtitle="Create a new user profile with all necessary details." />

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" name="name" value={userData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" name="email" value={userData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input type="tel" name="phone" value={userData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
              <select name="status" value={userData.status} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Pending</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </Section>

        <Section title="Address Details" icon={Home}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input type="text" name="street" value={userData.address.street} onChange={e => handleNestedChange('address', e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input type="text" name="city" value={userData.address.city} onChange={e => handleNestedChange('address', e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
              <input type="text" name="state" value={userData.address.state} onChange={e => handleNestedChange('address', e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code</label>
              <input type="text" name="zip" value={userData.address.zip} onChange={e => handleNestedChange('address', e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </Section>

        <Section title="Bank Account" icon={Landmark}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input type="text" name="bankName" value={userData.bankAccount.bankName} onChange={e => handleNestedChange('bankAccount', e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input type="text" name="accountNumber" value={userData.bankAccount.accountNumber} onChange={e => handleNestedChange('bankAccount', e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
              <input type="text" name="ifsc" value={userData.bankAccount.ifsc} onChange={e => handleNestedChange('bankAccount', e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </Section>
        
        <Section title="KYC Status" icon={ShieldCheck}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial KYC Status</label>
              <select name="kycStatus" value={userData.kycStatus} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Not Verified</option>
                <option>Pending</option>
                <option>Verified</option>
                 <option>Rejected</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Set the initial verification status. Documents must be uploaded by the user.</p>
            </div>
        </Section>

        <Section title="Nominee Information" icon={UsersIcon}>
          <div className="space-y-6">
            {userData.nominees.map((nominee, index) => (
              <div key={nominee.id} className="p-4 border border-gray-200 rounded-lg relative bg-gray-50/50">
                <h3 className="font-semibold text-gray-800 mb-4">Nominee {index + 1}</h3>
                <button type="button" onClick={() => removeNominee(nominee.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="name" placeholder="Full Name" value={nominee.name} onChange={e => handleNomineeChange(nominee.id, e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="text" name="relationship" placeholder="Relationship" value={nominee.relationship} onChange={e => handleNomineeChange(nominee.id, e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <div className="md:col-span-2">
                    <input type="email" name="email" placeholder="Email Address" value={nominee.email} onChange={e => handleNomineeChange(nominee.id, e)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>
            ))}
            {userData.nominees.length < 2 && (
              <button type="button" onClick={addNominee} className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800">
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Nominee
              </button>
            )}
          </div>
        </Section>
        
        <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-gradient-to-t from-emerald-50/50 via-emerald-50/50 to-transparent -mx-8 -mb-8 px-8 py-6">
          <Link to="/admin/users">
            <button type="button" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold">Cancel</button>
          </Link>
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 font-semibold flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Create User</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
