import React, { useState } from 'react';
import { User, Lock, Bell, CreditCard, Shield, Globe, Download, ShieldCheck, UploadCloud, UserCheck, Landmark, PlusCircle, X, Home } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface Nominee {
  id: number;
  name: string;
  relationship: string;
  email: string;
  phone: string;
}

const StatusBadge: React.FC<{ status: 'Verified' | 'Pending' | 'Not Verified' }> = ({ status }) => {
  const statusStyles = {
    Verified: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'Not Verified': 'bg-red-100 text-red-800 border border-red-200',
  };
  return (
    <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true, push: false, sms: true, trading: true, portfolio: false, news: true
  });

  const [kycFile, setKycFile] = useState<File | null>(null);
  const [kycStatus, setKycStatus] = useState<'Not Verified' | 'Pending' | 'Verified'>('Not Verified');

  const [nominees, setNominees] = useState<Nominee[]>([
    { id: 1, name: 'Jane Doe', relationship: 'Spouse', email: 'jane.doe@example.com', phone: '+91 98765 43211' }
  ]);
  
  const [bankDetails, setBankDetails] = useState({
    bankName: 'State Bank of India',
    accountNumber: '**** **** **** 1234',
    ifsc: 'SBIN0001234',
    status: 'Verified' as 'Verified' | 'Pending' | 'Not Verified'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKycFile(e.target.files[0]);
      setKycStatus('Pending');
    }
  };

  const handleNomineeChange = (id: number, field: keyof Omit<Nominee, 'id'>, value: string) => {
    setNominees(nominees.map(nominee => 
      nominee.id === id ? { ...nominee, [field]: value } : nominee
    ));
  };

  const addNominee = () => {
    if (nominees.length < 2) {
      const newId = (nominees[nominees.length - 1]?.id || 0) + 1;
      setNominees([...nominees, { id: newId, name: '', relationship: '', email: '', phone: '' }]);
    }
  };

  const removeNominee = (id: number) => {
    setNominees(nominees.filter(nominee => nominee.id !== id));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'kyc', label: 'Verification & KYC', icon: ShieldCheck },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences and security settings." />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 xl:w-1/5">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                  <tab.icon className="w-5 h-5 mr-3" /> {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 sm:p-8">
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your personal details and address.</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">JD</div>
                  <div className="space-y-2">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Change Photo</button>
                    <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" defaultValue="John" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" defaultValue="john.doe@example.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Phone</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Phone <span className="text-gray-400">(Optional)</span></label>
                    <input type="tel" placeholder="Enter alternative contact number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-3 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 pl-8">Your primary residential address for communication.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input type="text" defaultValue="123, Financial Street, Dalal Avenue" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input type="text" defaultValue="Mumbai" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
                    <input type="text" defaultValue="Maharashtra" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code</label>
                    <input type="text" defaultValue="400001" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input type="text" defaultValue="India" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Changes</button>
                </div>
              </div>
            )}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
                 <p>Content for security settings...</p>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                <p>Content for notification settings...</p>
              </div>
            )}
             {activeTab === 'billing' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing & Subscription</h2>
                <p>Content for billing settings...</p>
              </div>
            )}
            {activeTab === 'kyc' && (
              <div className="space-y-8 animate-fade-in">
                {/* Identity Verification Card */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <UserCheck className="w-6 h-6 mr-3 text-emerald-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Identity Verification (KYC)</h2>
                    <StatusBadge status={kycStatus} />
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Upload your documents for account verification. Status will be updated after review.</p>
                  
                  {kycStatus !== 'Verified' && (
                      <div className="mt-6">
                        <label htmlFor="kyc-upload" className="cursor-pointer block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {kycFile ? `File selected: ${kycFile.name}` : 'Click to upload your ID Proof'}
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">PDF, PNG, JPG up to 5MB</span>
                          <input id="kyc-upload" name="kyc-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={kycStatus === 'Pending'} />
                        </label>
                      </div>
                  )}
                  
                  {kycStatus === 'Verified' && (
                      <div className="mt-6 p-4 bg-emerald-50 rounded-lg text-center">
                          <p className="text-emerald-800 font-medium">Your KYC is verified.</p>
                      </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!kycFile || kycStatus !== 'Pending'}>
                      {kycStatus === 'Pending' ? 'Submit for Verification' : 'Upload & Save'}
                    </button>
                  </div>
                </div>

                {/* Nominee Details Card */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <User className="w-6 h-6 mr-3 text-emerald-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Nominee Information</h2>
                      </div>
                      {nominees.length < 2 && (
                        <button onClick={addNominee} className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800">
                            <PlusCircle className="w-4 h-4 mr-1" />
                            Add Nominee
                        </button>
                      )}
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Designate up to two nominees for your account.</p>
                  
                  <div className="space-y-8">
                      {nominees.map((nominee, index) => (
                        <div key={nominee.id} className="p-4 border border-gray-200 rounded-lg relative bg-gray-50/50">
                            <h3 className="font-semibold text-gray-800 mb-4">Nominee {index + 1}</h3>
                            {nominees.length > 1 && (
                                <button onClick={() => removeNominee(nominee.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                  <input type="text" value={nominee.name} onChange={(e) => handleNomineeChange(nominee.id, 'name', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                                  <input type="text" value={nominee.relationship} onChange={(e) => handleNomineeChange(nominee.id, 'relationship', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                  <input type="email" value={nominee.email} onChange={(e) => handleNomineeChange(nominee.id, 'email', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                  <input type="tel" value={nominee.phone} onChange={(e) => handleNomineeChange(nominee.id, 'phone', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Nominees</button>
                  </div>
                </div>

                {/* Bank Account Card */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <Landmark className="w-6 h-6 mr-3 text-emerald-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Bank Account Details</h2>
                    <StatusBadge status={bankDetails.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Link your bank account for deposits and withdrawals.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                      <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input type="text" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                      <input type="text" value={bankDetails.ifsc} onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Bank Details</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy</h2>
                <p>Content for privacy settings...</p>
              </div>
            )}
            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
                <p>Content for preferences settings...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
