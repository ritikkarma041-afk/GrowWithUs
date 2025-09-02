import React, { useState } from 'react';
import { Save } from 'lucide-react';

const Toggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
  <button type="button" onClick={onToggle} className={`${enabled ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}>
    <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
  </button>
);

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    enforce2FA: true,
    passwordMinLength: 12,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSymbol: true,
    sessionTimeout: 30, // in minutes
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving security settings:', settings);
    alert('Security settings saved!');
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Security Settings</h2>
      <p className="text-sm text-gray-500 mb-8">Manage global security policies for all users.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 2FA Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800">Two-Factor Authentication (2FA)</h3>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">Enforce 2FA for all admin accounts.</p>
            <Toggle enabled={settings.enforce2FA} onToggle={() => handleToggle('enforce2FA')} label="Enforce 2FA" />
          </div>
        </div>

        {/* Password Policy Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Password Policy</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
              <input type="number" id="passwordMinLength" name="passwordMinLength" value={settings.passwordMinLength} onChange={handleInputChange} className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex items-center space-x-4">
              <input type="checkbox" id="passwordRequireUppercase" name="passwordRequireUppercase" checked={settings.passwordRequireUppercase} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
              <label htmlFor="passwordRequireUppercase" className="text-sm text-gray-700">Require at least one uppercase letter</label>
            </div>
            <div className="flex items-center space-x-4">
              <input type="checkbox" id="passwordRequireNumber" name="passwordRequireNumber" checked={settings.passwordRequireNumber} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
              <label htmlFor="passwordRequireNumber" className="text-sm text-gray-700">Require at least one number</label>
            </div>
            <div className="flex items-center space-x-4">
              <input type="checkbox" id="passwordRequireSymbol" name="passwordRequireSymbol" checked={settings.passwordRequireSymbol} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
              <label htmlFor="passwordRequireSymbol" className="text-sm text-gray-700">Require at least one special character</label>
            </div>
          </div>
        </div>

        {/* Session Management Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Session Management</h3>
          <div>
            <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
            <select id="sessionTimeout" name="sessionTimeout" value={settings.sessionTimeout} onChange={handleInputChange} className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">Automatically log out users after a period of inactivity.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
