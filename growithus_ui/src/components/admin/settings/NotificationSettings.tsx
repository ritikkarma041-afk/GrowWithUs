import React, { useState } from 'react';
import { Save } from 'lucide-react';

const notificationEvents = [
  { id: 'newUserSignup', label: 'New User Signup', description: 'Get notified when a new user creates an account.' },
  { id: 'largeWithdrawal', label: 'Large Withdrawal Request', description: 'Triggered when a withdrawal exceeds a set threshold.' },
  { id: 'kycSubmission', label: 'New KYC Submission', description: 'Alert when a user submits documents for KYC verification.' },
  { id: 'systemError', label: 'Critical System Error', description: 'Immediate notification for major system failures.' },
  { id: 'supportTicket', label: 'New Support Ticket', description: 'Alert for new high-priority support tickets.' },
];

const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <button type="button" onClick={onToggle} className={`${enabled ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}>
    <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
  </button>
);

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    newUserSignup: { email: true, inApp: true },
    largeWithdrawal: { email: true, inApp: true },
    kycSubmission: { email: false, inApp: true },
    systemError: { email: true, inApp: false },
    supportTicket: { email: true, inApp: true },
  });

  const handleToggle = (eventId: keyof typeof settings, type: 'email' | 'inApp') => {
    setSettings(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [type]: !prev[eventId][type],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving notification settings:', settings);
    alert('Notification settings saved!');
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Admin Notifications</h2>
      <p className="text-sm text-gray-500 mb-8">Choose how you receive important platform notifications.</p>

      <form onSubmit={handleSubmit}>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <div className="hidden md:grid md:grid-cols-3 gap-4 p-4 bg-gray-50/70">
            <div className="font-medium text-sm text-gray-600">Event</div>
            <div className="font-medium text-sm text-gray-600 text-center">Email</div>
            <div className="font-medium text-sm text-gray-600 text-center">In-App</div>
          </div>
          {notificationEvents.map(event => (
            <div key={event.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-center">
              <div>
                <h4 className="font-medium text-gray-800">{event.label}</h4>
                <p className="text-sm text-gray-500 mt-1">{event.description}</p>
              </div>
              <div className="flex items-center justify-between md:justify-center">
                <span className="md:hidden font-medium text-sm text-gray-600">Email</span>
                <Toggle enabled={settings[event.id as keyof typeof settings].email} onToggle={() => handleToggle(event.id as keyof typeof settings, 'email')} />
              </div>
              <div className="flex items-center justify-between md:justify-center">
                <span className="md:hidden font-medium text-sm text-gray-600">In-App</span>
                <Toggle enabled={settings[event.id as keyof typeof settings].inApp} onToggle={() => handleToggle(event.id as keyof typeof settings, 'inApp')} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end pt-8">
          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;
