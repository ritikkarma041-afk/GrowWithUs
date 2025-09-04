import React, { useState } from 'react';
import { Building, Lock, Bell, CreditCard, SlidersHorizontal, KeyRound } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import CompanyProfile from '../../components/admin/settings/CompanyProfile';
import SecuritySettings from '../../components/admin/settings/SecuritySettings';
import NotificationSettings from '../../components/admin/settings/NotificationSettings';
import BillingSettings from '../../components/admin/settings/BillingSettings';
import Integrations from '../../components/admin/settings/Integrations';
import ApiKeys from '../../components/admin/settings/ApiKeys';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Admin Notifications', icon: Bell },
    { id: 'billing', label: 'Platform Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: SlidersHorizontal },
    { id: 'api', label: 'API Keys', icon: KeyRound },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'company': return <CompanyProfile />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'billing': return <BillingSettings />;
      case 'integrations': return <Integrations />;
      case 'api': return <ApiKeys />;
      default: return null;
    }
  };

  return (
    <div>
      <PageHeader title="Admin Settings" subtitle="Configure platform-wide settings and integrations." />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 xl:w-1/5">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sticky top-24">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 sm:p-8 min-h-[600px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
