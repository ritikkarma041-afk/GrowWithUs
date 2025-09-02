import React, { useState } from 'react';
import { PlusCircle, KeyRound, Copy, Check, Trash2, Save } from 'lucide-react';
import Modal from '../../Modal';
import ActionConfirmationModal from '../ActionConfirmationModal';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: 'Read-only' | 'Read & Write';
  createdAt: string;
  lastUsed: string;
}

const initialKeys: ApiKey[] = [
  { id: '1', name: 'Data Analytics Tool', key: 'sk_live_1234...wxyz', permissions: 'Read-only', createdAt: 'Jan 15, 2025', lastUsed: 'Mar 28, 2025' },
  { id: '2', name: 'Mobile App Backend', key: 'sk_live_5678...uvwx', permissions: 'Read & Write', createdAt: 'Feb 01, 2025', lastUsed: 'Today' },
];

const ApiKeys: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<'Read-only' | 'Read & Write'>('Read-only');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const newKey = `sk_live_${Math.random().toString(36).substr(2, 16)}`;
    setGeneratedKey(newKey);
    
    const newKeyData: ApiKey = {
        id: (keys.length + 1).toString(),
        name: newKeyName,
        key: `${newKey.substring(0, 12)}...${newKey.substring(newKey.length - 4)}`,
        permissions: newKeyPermissions,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastUsed: 'Never'
    };
    setKeys(prev => [...prev, newKeyData]);
  };
  
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setGeneratedKey(null);
    setNewKeyName('');
    setNewKeyPermissions('Read-only');
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const openDeleteModal = (key: ApiKey) => {
    setKeyToDelete(key);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (keyToDelete) {
      setKeys(keys.filter(k => k.id !== keyToDelete.id));
      setIsDeleteModalOpen(false);
      setKeyToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">API Keys</h2>
          <p className="text-sm text-gray-500">Manage API keys for programmatic access to your platform.</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2">
          <PlusCircle className="w-4 h-4" />
          <span>Generate Key</span>
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/70">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {keys.map(key => (
              <tr key={key.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{key.key}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${key.permissions === 'Read & Write' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{key.permissions}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{key.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openDeleteModal(key)} className="text-red-600 hover:text-red-800 flex items-center space-x-1">
                    <Trash2 className="w-4 h-4" />
                    <span>Revoke</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Key Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        {generatedKey ? (
          <div className="p-4 text-center">
            <KeyRound className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">API Key Generated</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4">Here is your new API key. Please copy it now. You won't be able to see it again.</p>
            <div className="relative bg-gray-100 p-4 rounded-lg font-mono text-sm">
              {generatedKey}
              <button onClick={copyToClipboard} className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-200">
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            <button onClick={closeCreateModal} className="mt-6 w-full px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Done</button>
          </div>
        ) : (
          <form onSubmit={handleGenerateKey} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 text-center">Generate New API Key</h2>
            <div>
              <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-2">Key Name</label>
              <input id="keyName" type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Marketing Analytics" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <select value={newKeyPermissions} onChange={(e) => setNewKeyPermissions(e.target.value as any)} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Read-only</option>
                <option>Read & Write</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={closeCreateModal} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Generate Key</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ActionConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Revoke API Key"
        message={`Are you sure you want to revoke the key "${keyToDelete?.name}"? This action is permanent and cannot be undone.`}
      />
    </div>
  );
};

export default ApiKeys;
