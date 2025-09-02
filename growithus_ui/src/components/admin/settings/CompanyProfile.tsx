import React, { useState } from 'react';
import { UploadCloud, Save } from 'lucide-react';

const CompanyProfile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'GrowWithUs Company',
    email: 'contact@growwithus.com',
    phone: '+91 22 1234 5678',
    address: '123 Financial Street, Dalal Avenue, Mumbai, Maharashtra, 400001',
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>('https://via.placeholder.com/128');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving company profile:', { profile, logo });
    alert('Company profile saved!');
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Company Profile</h2>
      <p className="text-sm text-gray-500 mb-6">Update your company's public details and logo.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          {logoPreview && <img src={logoPreview} alt="Company Logo" className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100" />}
          <div>
            <label htmlFor="logo-upload" className="cursor-pointer px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
              Upload Logo
            </label>
            <input id="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input type="text" id="name" name="name" value={profile.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Public Email</label>
            <input type="email" id="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input type="text" id="address" name="address" value={profile.address} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
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

export default CompanyProfile;
