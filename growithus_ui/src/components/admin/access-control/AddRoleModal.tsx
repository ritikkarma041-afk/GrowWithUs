import React, { useState } from 'react';
import Modal from '../../Modal';
import { ShieldPlus } from 'lucide-react';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description: string) => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, description);
      setName('');
      setDescription('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <ShieldPlus className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800">Add New Role</h2>
        </div>
        <div>
          <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
          <input
            id="roleName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., Content Moderator"
          />
        </div>
        <div>
          <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            id="roleDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Briefly describe what this role can do"
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Add Role</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRoleModal;
